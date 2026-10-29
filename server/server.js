// Pyxis — Backend reale (zero dipendenze, solo Node.js)
// - Database: node:sqlite (integrato)
// - Real-time: SSE (Server-Sent Events)
// - API: POST /api/register, GET /api/lancette?provincia=X, GET /api/events?provincia=X

const http = require('http');
const { DatabaseSync } = require('node:sqlite');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const DB_PATH = require('path').join(__dirname, 'pyxis.db');

// ============ DATABASE ============
const db = new DatabaseSync(DB_PATH);
db.exec(`
  CREATE TABLE IF NOT EXISTS utenti (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL UNIQUE,
    tipo TEXT NOT NULL,
    provincia TEXT NOT NULL,
    creato_il TEXT NOT NULL,
    ultimo_ Republican TEXT
  );
  CREATE TABLE IF NOT EXISTS presenze (
    utente_id TEXT PRIMARY KEY,
    provincia TEXT NOT NULL,
    online_da TEXT NOT NULL,
    FOREIGN KEY(utente_id) REFERENCES utenti(id)
  );
  CREATE TABLE IF NOT EXISTS poi (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    provincia TEXT NOT NULL,
    descrizione TEXT,
    creato_da TEXT,
    creato_il TEXT NOT NULL
  );
`);

// POI di esempio (uno per alcune province)
const poiSeed = [
  ['poi-milano', 'Quercia dei Sussurri', 'Milano', 'Antica quercia cava, punto di raduno della congrega', null],
  ['poi-roma', 'Pietra del Sole', 'Roma', 'Menir al centro del parco, segna il solstizio', null],
  ['poi-venezia', 'Fontana delle Lagrime', 'Venezia', 'Fontana sotto il ponte, si dice che chi vi bagna le mani trovi la sua via', null],
  ['poi-torino', 'Pietra Filosofale', 'Torino', 'Pietra miliare romana riemersa nel 1700, si narra che brilli a mezzanotte', null],
  ['poi-napoli', 'Grotta di Virgilio', 'Napoli', 'Ingresso della grotta antica, luogo di studio dei sapienti', null],
  ['poi-firenze', 'Giardino delle Streghe', 'Firenze', 'Giardino segreto behind Palazzo Vecchio, si entra solo a Samhain', null],
];
const insPoi = db.prepare('INSERT OR IGNORE INTO poi (id, nome, provincia, descrizione, creato_da, creato_il) VALUES (?, ?, ?, ?, ?, ?)');
for (const p of poiSeed) {
  insPoi.run(p[0], p[1], p[2], p[3], p[4], new Date().toISOString());
}

// ============ HELPERS ============
function json(res, code, data) {
  res.writeHead(code, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', c => { body += c; if (body.length > 1e6) req.destroy(); });
    req.on('end', () => { try { resolve(JSON.parse(body || '{}')); } catch (e) { reject(e); } });
    req.on('error', reject);
  });
}

// ============ SSE (real-time) ============
const clients = new Set(); // { res, provincia }

function broadcast(provincia, event, data) {
  const msg = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const c of clients) {
    if (c.provincia === provincia) {
      try { c.res.write(msg); } catch (e) { clients.delete(c); }
    }
  }
}

// ============ API ============
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;

  // CORS preflight
  if (req.method === 'OPTIONS') { json(res, 204, {}); return; }

  // ---- POST /api/register ----
  if (path === '/api/register' && req.method === 'POST') {
    try {
      const body = await readBody(req);
      const { nome, tipo, provincia } = body;

      if (!nome || nome.length < 2 || nome.length > 20) return json(res, 400, { error: 'Nome non valido (2-20 caratteri)' });
      if (!['strega','stregone','sciamano','guaritore','veggente','viandante'].includes(tipo)) return json(res, 400, { error: 'Via non valida' });
      if (!provincia) return json(res, 400, { error: 'Provincia mancante' });

      const id = crypto.randomUUID();
      const now = new Date().toISOString();

      try {
        db.prepare('INSERT INTO utenti (id, nome, tipo, provincia, creato_il) VALUES (?, ?, ?, ?, ?)')
          .run(id, nome.trim(), tipo, provincia, now);
      } catch (e) {
        if (e.message.includes('UNIQUE')) return json(res, 409, { error: 'Questo nome è già preso' });
        throw e;
      }

      // Registra presenza online
      db.prepare('INSERT OR REPLACE INTO presenze (utente_id, provincia, online_da) VALUES (?, ?, ?)')
        .run(id, provincia, now);

      broadcast(provincia, 'nuovo-utente', { nome, tipo, provincia });

      return json(res, 201, {
        ok: true,
        utente: { id, nome: nome.trim(), tipo, provincia }
      });
    } catch (e) {
      return json(res, 500, { error: e.message });
    }
  }

  // ---- GET /api/lancette?provincia=X&id=TUO ----
  // Restituisce le 3 lancette: vicino, secondo, POI sacro
  if (path === '/api/lancette' && req.method === 'GET') {
    const provincia = url.searchParams.get('provincia');
    const mioId = url.searchParams.get('id');
    if (!provincia) return json(res, 400, { error: 'provincia mancante' });

    // Altri utenti online nella stessa provincia (escluso me)
    const altri = db.prepare(`
      SELECT u.id, u.nome, u.tipo FROM utenti u
      JOIN presenze p ON u.id = p.utente_id
      WHERE u.provincia = ? AND u.id != ?
      ORDER BY p.online_da ASC
    `).all(provincia, mioId || '');

    // POI più vicino (primo POI della provincia — simulazione "più vicino")
    const poi = db.prepare('SELECT id, nome, descrizione, provincia FROM poi WHERE provincia = ? LIMIT 1').get(provincia);

    // Assegna angoli casuali ma stabili per demo (in futuro: calcolo reale)
    const angoli = [-50 + Math.random() * 20, 40 + Math.random() * 20, 155 + Math.random() * 20];

    return json(res, 200, {
      provincia,
      lancette: {
        grande: altri[0] ? { ...altri[0], angolo: Math.round(angoli[0]) } : null,
        media: altri[1] ? { ...altri[1], angolo: Math.round(angoli[1]) } : null,
        piccola: poi ? { ...poi, angolo: Math.round(angoli[2]), tipo: 'poi' } : null,
      },
      totale_online: altri.length + 1
    });
  }

  // ---- GET /api/poi?provincia=X ----
  if (path === '/api/poi' && req.method === 'GET') {
    const provincia = url.searchParams.get('provincia');
    if (!provincia) return json(res, 400, { error: 'provincia mancante' });
    const lista = db.prepare('SELECT * FROM poi WHERE provincia = ?').all(provincia);
    return json(res, 200, { poi: lista });
  }

  // ---- GET /api/events?provincia=X&id=TUO ----
  // SSE: stream real-time per la provincia
  if (path === '/api/events' && req.method === 'GET') {
    const provincia = url.searchParams.get('provincia');
    const mioId = url.searchParams.get('id');
    if (!provincia) return json(res, 400, { error: 'provincia mancante' });

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });
    res.write(`event: connesso\ndata: ${JSON.stringify({ provincia, ok: true })}\n\n`);

    const client = { res, provincia };
    clients.add(client);

    // Heartbeat ogni 25s
    const hb = setInterval(() => {
      try { res.write(`: ping\n\n`); } catch (e) { clearInterval(hb); clients.delete(client); }
    }, 25000);

    // Registra presenza se id dato
    if (mioId) {
      db.prepare('INSERT OR REPLACE INTO presenze (utente_id, provincia, online_da) VALUES (?, ?, ?)')
        .run(mioId, provincia, new Date().toISOString());
    }

    req.on('close', () => {
      clearInterval(hb);
      clients.delete(client);
      if (mioId) db.prepare('DELETE FROM presenze WHERE utente_id = ?').run(mioId);
    });

    return;
  }

  // ---- GET /api/utenti?provincia=X ---- (debug)
  if (path === '/api/utenti' && req.method === 'GET') {
    const provincia = url.searchParams.get('provincia');
    const lista = provincia
      ? db.prepare('SELECT id, nome, tipo, provincia, creato_il FROM utenti WHERE provincia = ?').all(provincia)
      : db.prepare('SELECT id, nome, tipo, provincia, creato_il FROM utenti').all();
    return json(res, 200, { utenti: lista, totale: lista.length });
  }

  // ---- Serve file statici dalla cartella parent (il frontend) ----
  const fs = require('fs');
  const pathMod = require('path');
  let filePath = pathMod.join(__dirname, '..', decodeURIComponent(path === '/' ? '/index.html' : path));
  if (!filePath.startsWith(pathMod.join(__dirname, '..'))) { res.writeHead(403); return res.end('Forbidden'); }
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    const ext = pathMod.extname(filePath);
    const mime = { '.html':'text/html', '.js':'text/javascript', '.json':'application/json', '.png':'image/png', '.jpg':'image/jpeg', '.css':'text/css', '.svg':'image/svg+xml' }[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🧭 Pyxis backend in ascolto su http://localhost:${PORT}`);
  console.log(`   Database: ${DB_PATH}`);
  console.log(`   Frontend servito da: ${__dirname}/..`);
});
