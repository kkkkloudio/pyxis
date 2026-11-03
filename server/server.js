// Pyxis — Backend reale (zero dipendenze, solo Node.js)
// - Database: node:sqlite (integrato)
// - Real-time: SSE (Server-Sent Events)
// - API: POST /api/register, GET /api/lancette?provincia=X, GET /api/events?provincia=X
//        POST /api/lettera (il corvo), GET /api/lettere?id=X (la posta)
// - V4: nessuna categoria (tipo default "utente"), lettere tra vicini via corvo
// - V4.1: seminati i POI di Rovigo — il Polesine entra nella bussola

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
    tipo TEXT NOT NULL DEFAULT 'utente',
    provincia TEXT NOT NULL,
    creato_il TEXT NOT NULL,
    ultimo_accesso TEXT
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
  CREATE TABLE IF NOT EXISTS lettere (
    id TEXT PRIMARY KEY,
    mittente_id TEXT NOT NULL,
    destinatario_id TEXT NOT NULL,
    mittente_nome TEXT NOT NULL,
    testo TEXT NOT NULL,
    creata_il TEXT NOT NULL,
    letta INTEGER NOT NULL DEFAULT 0
  );
`);

// POI reali del Veneto (luoghi sacri/naturali con leggenda) — si espandono provincia per provincia
const poiSeed = [
  ['poi-vi-covoli', 'Covoli di Valstagna', 'Vicenza', 'Grotte con pitture rupestri del Paleolitico, antico luogo sacro della Valbrenta', null],
  ['poi-vr-lessinia', 'Menhir di Giazza', 'Verona', 'Menhir cimbro nel bosco della Lessinia, segna il sorgere del sole al solstizio', null],
  ['poi-tv-grappa', 'Cima del Grappa', 'Treviso', 'La montagna sacra, 1775 m, raduni al solstizio d\'estate', null],
  ['poi-bl-cansiglio', 'Radura del Cansiglio', 'Belluno', 'Foresta sacra dei Cimbri, radura centrale dell\'altopiano del Cansiglio', null],
  ['poi-pd-colli', 'Monte della Madonna', 'Padova', 'Il colle sacro dei Colli Euganei, panorama su tutta la pianura veneta', null],
  ['poi-ve-ponte', 'Ponte Scaligero', 'Verona', 'Ponte medievale sull\'Adige, si dice che a mezzanotte mostri la via giusta', null],
  ['poi-ro-gorino', 'Po di Gorino', 'Rovigo', 'La bocca del Grande Fiume nel Delta, dove il Po si perde nel mare Adriatico tra nebbie e voci', null],
  ['poi-ro-rotonda', 'La Rotonda', 'Rovigo', 'Il tempio ottagonale della Beata Vergine del Soccorso, cuore sacro di Rovigo', null],
  ['poi-ro-panarella', 'Bosco Panarella', 'Rovigo', 'Ultima foresta planiziale del Polesine, resto del bosco antico che copriva la pianura', null],
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
  // CORS su TUTTE le risposte (anche errori e SSE) — prima di tutto
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;

  // CORS preflight
  if (req.method === 'OPTIONS') { json(res, 204, {}); return; }

  // ---- POST /api/register ----
  // V4: la "via" non si chiede più — se un vecchio client la manda, viene accettata;
  // se non la manda, il tipo è semplicemente "utente".
  if (path === '/api/register' && req.method === 'POST') {
    try {
      const body = await readBody(req);
      const { nome, provincia } = body;
      const tipo = (typeof body.tipo === 'string' && body.tipo.trim()) ? body.tipo.trim().slice(0, 20) : 'utente';

      if (!nome || nome.length < 2 || nome.length > 20) return json(res, 400, { error: 'Nome non valido (2-20 caratteri)' });
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

      broadcast(provincia, 'nuovo-utente', { nome: nome.trim(), tipo, provincia });

      return json(res, 201, {
        ok: true,
        utente: { id, nome: nome.trim(), tipo, provincia }
      });
    } catch (e) {
      return json(res, 500, { error: e.message });
    }
  }

  // ---- POST /api/lettera ---- (il corvo: lettera al vicino)
  if (path === '/api/lettera' && req.method === 'POST') {
    try {
      const body = await readBody(req);
      const { mittente_id, destinatario_id, testo } = body;

      if (!mittente_id || !destinatario_id) return json(res, 400, { error: 'Mittente o destinatario mancante' });
      if (!testo || !testo.trim()) return json(res, 400, { error: 'La lettera è vuota' });
      if (testo.length > 500) return json(res, 400, { error: 'La lettera è troppo lunga (max 500 caratteri)' });

      const mittente = db.prepare('SELECT nome, provincia FROM utenti WHERE id = ?').get(mittente_id);
      const destinatario = db.prepare('SELECT id, provincia FROM utenti WHERE id = ?').get(destinatario_id);
      if (!mittente) return json(res, 404, { error: 'Mittente sconosciuto' });
      if (!destinatario) return json(res, 404, { error: 'Destinatario sconosciuto' });

      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      db.prepare('INSERT INTO lettere (id, mittente_id, destinatario_id, mittente_nome, testo, creata_il, letta) VALUES (?, ?, ?, ?, ?, ?, 0)')
        .run(id, mittente_id, destinatario_id, mittente.nome, testo.trim(), now);

      // Il corvo vola: sveglia il destinatario se è online nella sua provincia
      broadcast(destinatario.provincia, 'lettera', {
        destinatario_id,
        da: mittente.nome,
        anteprima: testo.trim().slice(0, 60)
      });

      return json(res, 201, { ok: true, id });
    } catch (e) {
      return json(res, 500, { error: e.message });
    }
  }

  // ---- GET /api/lettere?id=TUO ---- (la posta: lettere ricevute)
  if (path === '/api/lettere' && req.method === 'GET') {
    const mioId = url.searchParams.get('id');
    if (!mioId) return json(res, 400, { error: 'id mancante' });
    const inArrivo = db.prepare('SELECT id, mittente_nome, testo, creata_il, letta FROM lettere WHERE destinatario_id = ? ORDER BY creata_il DESC').all(mioId);
    db.prepare('UPDATE lettere SET letta = 1 WHERE destinatario_id = ?').run(mioId);
    return json(res, 200, { lettere: inArrivo });
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
      'Access-Control-Allow-Headers': 'Content-Type',
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
  if (!filePath.startsWith(pathMod.join(__dirname, '..'))) { res.writeHead(403, {'Access-Control-Allow-Origin':'*'}); return res.end('Forbidden'); }
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404, {'Access-Control-Allow-Origin':'*'}); return res.end('Not found'); }
    const ext = pathMod.extname(filePath);
    const mime = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.json':'application/json', '.png':'image/png', '.jpg':'image/jpeg', '.css':'text/css', '.svg':'image/svg+xml' }[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime, 'Access-Control-Allow-Origin': '*' });
    res.end(data);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🧭 Pyxis backend in ascolto su http://localhost:${PORT}`);
  console.log(`   Database: ${DB_PATH}`);
  console.log(`   Frontend servito da: ${__dirname}/..`);
});
