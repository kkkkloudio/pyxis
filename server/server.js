// Pyxis — Backend reale (zero dipendenze, solo Node.js)
// - Database: node:sqlite (integrato)
// - Real-time: SSE (Server-Sent Events)
// - API: POST /api/register, GET /api/lancette, GET /api/events
//        POST /api/lettera (il corvo), GET /api/lettere (la posta)
//        POST /api/checkin (le stelle), GET /api/collezione
//        GET /api/poi, GET /api/utenti (debug)
// - V5: lancette flip — grande=luogo di potere (POI), media=prima anima, piccola=seconda anima
// - V5: check-in — PIETRA ANGOLARE: mai trattenere, salvare o trasmettere la
//        posizione dell'utente. Il confronto GPS avviene SOLO sul telefono:
//        al server arriva unicamente { utente_id, poi_id }. Nessuna coordinata
//        dell'utente esiste nel DB. Le colonne lat/lon della tabella poi sono
//        coordinate di LUOGHI PUBBLICI, non di persone.
// - V6: direzione vera — le lancette puntano la ROTTA tra luoghi pubblici
//        (capoluoghi e POI), mai tra persone. Anime: le più vicine ovunque,
//        misurate tra capoluoghi. Stessa provincia = nessuna rotta possibile:
//        angolo d'albergo, dolce e fisso per coppia.
// - V8.7: presenze vere (Opzione A) — una presenza conta solo se il suo
//        cuore batte da meno di 5 minuti. Nessuna anima "appesa" resta nella
//        legenda: tab chiusa male, telefono morto o riavvio del server non
//        lasciano più fantasmi. Se nessuno è davvero online, media e piccola
//        restano spente (il client le lascia vagare, come da canone VIVA).
// - V8.9: la mappa si riempie — due luoghi per provincia (15 POI totali).
//        Venezia finalmente in mappa (Bovolo + Poveglia). Coordinate stimate
//        da rifinire a mano. NOTA: l'id 'poi-ve-ponte' (Ponte Scaligero) ha
//        il prefisso VE ma il luogo è a VERONA — non rinominarlo: con
//        INSERT OR IGNORE un id nuovo creerebbe una riga doppia nel DB.
// - V8.10: le porte d'Italia — RIF_PROVINCIA copre tutte le 107 province:
//        le anime vicine puntano con la rotta vera da qualunque capoluogo.
// - V8.11: le stanze del Nord, prima ondata — 14 nuovi POI (Trentino,
//        Friuli-Venezia Giulia, Valle d'Aosta): 29 luoghi in tutto.

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
    lat REAL,
    lon REAL,
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
  CREATE TABLE IF NOT EXISTS visite (
    utente_id TEXT NOT NULL,
    poi_id TEXT NOT NULL,
    visitato_il TEXT NOT NULL,
    PRIMARY KEY (utente_id, poi_id),
    FOREIGN KEY(utente_id) REFERENCES utenti(id),
    FOREIGN KEY(poi_id) REFERENCES poi(id)
  );
`);

// Migrazione: se un DB già esistente non ha lat/lon sui POI, aggiungile
const colonnePoi = db.prepare('PRAGMA table_info(poi)').all().map(c => c.name);
if (!colonnePoi.includes('lat')) db.exec('ALTER TABLE poi ADD COLUMN lat REAL');
if (!colonnePoi.includes('lon')) db.exec('ALTER TABLE poi ADD COLUMN lon REAL');
if (!colonnePoi.includes('evidenza')) db.exec('ALTER TABLE poi ADD COLUMN evidenza INTEGER NOT NULL DEFAULT 0');

// POI reali d'Italia (luoghi di potere/naturali con leggenda) — Veneto completo,
// + prima ondata del Nord (Trentino, Friuli, Valle d'Aosta). Si espande regione per regione.
// Coordinate approssimative dei LUOGHI (dati pubblici): da rifinire a mano quando serve precisione.
const poiSeed = [
  ['poi-vi-covoli', 'Covoli di Valstagna', 'Vicenza', 'Grotte con pitture rupestri del Paleolitico, antico luogo di potere della Valbrenta', 45.9100, 11.7520, null],
  ['poi-vr-lessinia', 'Menhir di Giazza', 'Verona', 'Menhir cimbro nel bosco della Lessinia, segna il sorgere del sole al solstizio', 45.5833, 11.0167, null],
  ['poi-tv-grappa', 'Cima del Grappa', 'Treviso', 'La montagna sacra, 1775 m, raduni al solstizio d\'estate', 45.9139, 11.7861, null],
  ['poi-bl-cansiglio', 'Radura del Cansiglio', 'Belluno', 'Foresta sacra dei Cimbri, radura centrale dell\'altopiano del Cansiglio', 46.0583, 12.4333, null],
  ['poi-pd-colli', 'Monte della Madonna', 'Padova', 'Il colle sacro dei Colli Euganei, panorama su tutta la pianura veneta', 45.3167, 11.6833, null],
  ['poi-ve-ponte', 'Ponte Scaligero', 'Verona', 'Ponte medievale sull\'Adige, si dice che a mezzanotte mostri la via giusta', 45.4392, 10.9917, null],
  ['poi-ro-gorino', 'Po di Gorino', 'Rovigo', 'La bocca del Grande Fiume nel Delta, dove il Po si perde nel mare Adriatico tra nebbie e voci', 44.9836, 12.3214, null],
  ['poi-ro-rotonda', 'La Rotonda', 'Rovigo', 'Il tempio ottagonale della Beata Vergine del Soccorso. Prima che sorgesse, le segnaresse — le streghe di Rovigo — si riunivano proprio qui per riti e incantesimi', 45.0692, 11.7910, null],
  ['poi-ro-panarella', 'Bosco Panarella', 'Rovigo', 'Ultima foresta planiziale del Polesine, resto del bosco antico che copriva la pianura', 45.0283, 11.8383, null],
  ['poi-ve-bovolo', 'Scala del Bovolo', 'Venezia', 'La scala a chiocciola dei Contarini, una conchiglia di pietra in piena città: si sale girando su se stessi, come dentro una spirale alchemica', 45.4342, 12.3346, null],
  ['poi-ve-poveglia', 'Isola di Poveglia', 'Venezia', 'L\'isola vietata della laguna: prima borgo di Popilia, poi lazzaretto della peste, infine ospedale abbandonato. Nessuno sbarca — le si gira intorno in barca, e si ascolta', 45.3830, 12.3280, null],
  ['poi-vi-berico', 'Monte Berico', 'Vicenza', 'Il colle sacro sopra Vicenza: nel 1426 la Madonna apparve qui a una contadina. Chi sale vede tutta la città dall\'alto', 45.5199, 11.5489, null],
  ['poi-tv-follina', 'Abbazia di Follina', 'Treviso', 'L\'abbazia cistercense nascosta in fondo alla valle: acqua che cade, silenzio dei monaci, tempo misurato a preghiere e non a ore', 45.9549, 12.1244, null],
  ['poi-bl-santacroce', 'Lago di Santa Croce', 'Belluno', 'Il lago del drago: la leggenda popola le acque profonde di un mostro, e nelle notti di tempesta dalla superficie salgono campane', 46.0511, 12.3556, null],
  ['poi-pd-ragione', 'Palazzo della Ragione', 'Padova', 'Il Salone con il cielo dipinto: stelle e pianeti affrescati secondo la scienza di Pietro d\'Abano, l\'astrologo di Padova processato dall\'Inquisizione', 45.4075, 11.8754, null],
  ['poi-tn-tovel', 'Lago di Tovel', 'Trento', 'Il lago rosso: fino al 1964 le sue acque si tingevano di sangue ogni estate. La leggenda dice principessa, il lago non ha mai smentito', 46.346, 10.965, null],
  ['poi-tn-pergine', 'Castello di Pergine', 'Trento', 'Il castello della Dama Bianca: la signora senza pace vaga ancora tra le mura, e le persiane si aprono da sole', 46.067, 11.149, null],
  ['poi-bz-laurino', 'Catinaccio del Re Laurino', 'Bolzano', 'Il giardino di rose del re dei nani: pietra di giorno, ma al tramonto le pareti bruciano di rosa — l\'enrosadira, la vendetta di Laurino', 46.480, 11.683, null],
  ['poi-bz-carezza', 'Lago di Carezza', 'Bolzano', 'Il lago dell\'arcobaleno: i colori restano imprigionati nell\'acqua dal giorno in cui un mago intrecciò l\'iride per una fanciulla', 46.408, 11.689, null],
  ['poi-ao-cromlech', 'Cromlech di Aosta', 'Aosta', 'Il santuario megalitico ai piedi delle montagne: pietre e steli allineate al cielo, seimila anni di riti che nessuno ricorda', 45.731, 7.328, null],
  ['poi-ao-sanbernardo', 'Colle del Piccolo San Bernardo', 'Aosta', 'Il colle del tempio di Giove: la strada romana sale tra i cippi, e la pietra dei morti conta i passi dei pellegrini', 45.866, 6.950, null],
  ['poi-ud-lussari', 'Monte Lussari', 'Udine', 'La montagna dell\'angelo: un pastore trovò qui la statua della Madonna, e da allora tre popoli salgono insieme allo stesso santuario', 46.462, 13.575, null],
  ['poi-ud-aquileia', 'Basilica di Aquileia', 'Udine', 'La capitale sepolta: il grande porto romano è affondato nei campi, e sotto la basilica il tempo si è fermato ai mosaici', 45.771, 13.368, null],
  ['poi-pn-polcenigo', 'Castello di Polcenigo', 'Pordenone', 'Il castello dei fantasmi: tra le mura vive una presenza che non ha mai trovato pace, e la gente del posto evita la collina di notte', 46.013, 12.532, null],
  ['poi-pn-maniago', 'Castello di Maniago', 'Pordenone', 'Il castello che guarda tutta la valle: qui si forgiano le lame da secoli, e la montagna tiene il conto dei martelli', 46.167, 12.583, null],
  ['poi-go-doberdo', 'Lago di Doberdò', 'Gorizia', 'Il lago che appare e scompare: il carsico lo svuota e lo riempie a suo piacere, e nessuno sa dov\'è l\'acqua quando non c\'è', 45.777, 13.573, null],
  ['poi-go-barbana', 'Isola di Barbana', 'Gorizia', 'L\'isola del voto: un santuario in mezzo alla laguna di Grado, otto secoli di promesse mantenute e di barche all\'alba', 45.674, 13.423, null],
  ['poi-ts-grotta', 'Grotta Gigante', 'Trieste', 'La caverna che misura il cielo: dentro, pendoli appesi al buio studiano la gravità in una cattedrale di pietra', 45.706, 13.861, null],
  ['poi-ts-miramare', 'Castello di Miramare', 'Trieste', 'Il castello della maledizione: Massimiliano lo lasciò per il Messico e non tornò. Chi ci ha dormito dopo non è mai finito bene', 45.704, 13.711, null],
];
const insPoi = db.prepare('INSERT OR IGNORE INTO poi (id, nome, provincia, descrizione, lat, lon, creato_da, creato_il) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
const updPoi = db.prepare('UPDATE poi SET lat = ?, lon = ? WHERE id = ? AND (lat IS NULL OR lon IS NULL)');
for (const p of poiSeed) {
  insPoi.run(p[0], p[1], p[2], p[3], p[4], p[5], p[6], new Date().toISOString());
  updPoi.run(p[4], p[5], p[0]);
}

// Il luogo di potere che la bussola punta: la Rotonda di Rovigo,
// dove prima del tempio si riunivano le segnaresse (le streghe di Rovigo).
// Vale anche per i DB già esistenti: la migrazione gira a ogni avvio.
const rotonda = poiSeed.find(p => p[0] === 'poi-ro-rotonda');
db.prepare('UPDATE poi SET evidenza = 1, descrizione = ? WHERE id = ?').run(rotonda[3], rotonda[0]);

// ============ LA DIREZIONE VERA ============
// Capoluoghi: punti di riferimento PUBBLICI per le rotte della bussola.
// Precisione da cartografo pigro (~km): per un ago è più che sufficiente.
// Le 107 porte d'Italia (V8.10): tutte le province, tutte le rotte.
// I luoghi di potere arrivano dopo, regione per regione: dove non sono ancora
// mappati, l'ago grande vaga e le anime puntano comunque con la rotta vera.
const RIF_PROVINCIA = {
  // Valle d'Aosta
  'Aosta': [45.737, 7.32],
  // Piemonte
  'Alessandria': [44.913, 8.621],
  'Asti': [44.9, 8.207],
  'Biella': [45.566, 8.054],
  'Cuneo': [44.384, 7.541],
  'Novara': [45.446, 8.621],
  'Torino': [45.07, 7.686],
  'Verbania': [45.921, 8.556],
  'Vercelli': [45.325, 8.418],
  // Lombardia
  'Bergamo': [45.698, 9.677],
  'Brescia': [45.541, 10.211],
  'Como': [45.808, 9.085],
  'Cremona': [45.133, 10.029],
  'Lecco': [45.856, 9.393],
  'Lodi': [45.31, 9.5],
  'Mantova': [45.153, 10.774],
  'Milano': [45.464, 9.19],
  'Monza e della Brianza': [45.584, 9.274],
  'Pavia': [45.185, 9.155],
  'Sondrio': [46.139, 9.7],
  'Varese': [45.82, 8.825],
  // Trentino-Alto Adige
  'Bolzano': [46.49, 11.34],
  'Trento': [46.067, 11.117],
  // Veneto
  'Belluno': [46.1425, 12.2167],
  'Padova': [45.4064, 11.8762],
  'Rovigo': [45.071, 11.7915],
  'Treviso': [45.7108, 12.2383],
  'Venezia': [45.4408, 12.3155],
  'Verona': [45.4386, 10.9916],
  'Vicenza': [45.5455, 11.535],
  // Friuli-Venezia Giulia
  'Gorizia': [45.944, 13.624],
  'Pordenone': [45.955, 12.69],
  'Trieste': [45.649, 13.78],
  'Udine': [46.063, 13.234],
  // Liguria
  'Genova': [44.406, 8.933],
  'Imperia': [43.885, 8.033],
  'La Spezia': [44.102, 9.84],
  'Savona': [44.307, 8.479],
  // Emilia-Romagna
  'Bologna': [44.494, 11.343],
  'Ferrara': [44.838, 11.62],
  'Forlì-Cesena': [44.222, 12.041],
  'Modena': [44.647, 10.925],
  'Parma': [44.801, 10.328],
  'Piacenza': [45.053, 9.695],
  'Ravenna': [44.418, 12.203],
  'Reggio Emilia': [44.698, 10.631],
  'Rimini': [44.058, 12.569],
  // Toscana
  'Arezzo': [43.463, 11.878],
  'Firenze': [43.769, 11.257],
  'Grosseto': [42.76, 11.113],
  'Livorno': [43.549, 10.309],
  'Lucca': [43.843, 10.503],
  'Massa-Carrara': [44.035, 10.14],
  'Pisa': [43.717, 10.401],
  'Pistoia': [43.932, 10.918],
  'Prato': [43.878, 11.097],
  'Siena': [43.319, 11.331],
  // Umbria
  'Perugia': [43.11, 12.389],
  'Terni': [42.655, 12.644],
  // Marche
  'Ancona': [43.548, 13.459],
  'Ascoli Piceno': [42.854, 13.572],
  'Fermo': [43.164, 13.719],
  'Macerata': [43.3, 13.554],
  'Pesaro e Urbino': [43.911, 12.906],
  // Lazio
  'Frosinone': [41.643, 13.346],
  'Latina': [41.462, 12.903],
  'Rieti': [42.407, 12.858],
  'Roma': [41.893, 12.483],
  'Viterbo': [42.417, 12.104],
  // Abruzzo
  'L\'Aquila': [42.354, 13.38],
  'Chieti': [42.355, 14.167],
  'Pescara': [42.462, 14.214],
  'Teramo': [42.649, 13.699],
  // Molise
  'Campobasso': [41.563, 14.657],
  'Isernia': [41.594, 14.233],
  // Campania
  'Avellino': [40.914, 14.794],
  'Benevento': [41.133, 14.784],
  'Caserta': [41.081, 14.344],
  'Napoli': [40.854, 14.268],
  'Salerno': [40.68, 14.764],
  // Puglia
  'Bari': [41.126, 16.87],
  'Barletta-Andria-Trani': [41.323, 16.287],
  'Brindisi': [40.634, 17.942],
  'Foggia': [41.462, 15.541],
  'Lecce': [40.352, 18.171],
  'Taranto': [40.464, 17.247],
  // Basilicata
  'Matera': [40.666, 16.604],
  'Potenza': [40.642, 15.809],
  // Calabria
  'Catanzaro': [38.904, 16.6],
  'Cosenza': [39.303, 16.253],
  'Crotone': [39.085, 17.128],
  'Reggio Calabria': [38.111, 15.651],
  'Vibo Valentia': [38.673, 16.1],
  // Sicilia
  'Agrigento': [37.289, 13.578],
  'Caltanissetta': [37.489, 14.062],
  'Catania': [37.503, 15.088],
  'Enna': [37.563, 14.282],
  'Messina': [38.194, 15.554],
  'Palermo': [38.116, 13.366],
  'Ragusa': [36.927, 14.717],
  'Siracusa': [37.065, 15.286],
  'Trapani': [38.018, 12.512],
  // Sardegna
  'Cagliari': [39.224, 9.117],
  'Nuoro': [40.32, 9.328],
  'Oristano': [39.903, 8.588],
  'Sassari': [40.726, 8.561],
  'Sud Sardegna': [39.169, 8.522],
};

// Rotta vera da (lat1,lon1) verso (lat2,lon2), in gradi [0,360)
function rotta(lat1, lon1, lat2, lon2) {
  const rad = x => x * Math.PI / 180;
  const y = Math.sin(rad(lon2 - lon1)) * Math.cos(rad(lat2));
  const x = Math.cos(rad(lat1)) * Math.sin(rad(lat2)) -
            Math.sin(rad(lat1)) * Math.cos(rad(lat2)) * Math.cos(rad(lon2 - lon1));
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

// Distanza tra due punti di riferimento (metri)
function distanzaTraRif(a, b) {
  if (!a || !b) return Infinity;
  const rad = x => x * Math.PI / 180;
  const R = 6371000;
  const dLat = rad(b[0] - a[0]), dLon = rad(b[1] - a[1]);
  const h = Math.sin(dLat/2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLon/2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Angolo d'albergo per chi è vicinissimo: piccolo scarto fisso per coppia (±25°),
// deterministico — due anime vicine non si sovrappongono mai, e ogni giorno è uguale.
function scartoStabile(idA, idB) {
  const h = crypto.createHash('md5').update(String(idA) + ':' + String(idB)).digest('hex');
  return (parseInt(h.slice(0, 2), 16) / 255) * 50 - 25;
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

// ============ PRESENZE VERE (V8.7 — Opzione A) ============
// Una presenza conta solo se il suo cuore batte da meno di 5 minuti.
// online_da è una stringa ISO UTC prodotta da new Date().toISOString()
// (es. 2026-11-14T15:57:19.945Z): la soglia va confrontata per ORDINE
// LESSICOGRAFICO (stesso formato → ordinamento corretto), NON con
// datetime('now') di SQLite, che genererebbe un formato diverso.
const TTL_PRESENZE_MS = 5 * 60 * 1000;

function sogliaPresenze() {
  return new Date(Date.now() - TTL_PRESENZE_MS).toISOString();
}

// Butta via le anime appese: tab chiusa male, telefono morto, riavvio del server.
function spazzaPresenze() {
  db.prepare('DELETE FROM presenze WHERE online_da < ?').run(sogliaPresenze());
}

// Spazzata all'avvio (ripulisce i fantasmi del passato) e poi ogni minuto.
spazzaPresenze();
setInterval(spazzaPresenze, 60 * 1000);

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
  // Restituisce le 3 lancette: GRANDE=luogo di potere (POI), MEDIA=prima anima, PICCOLA=seconda anima
  if (path === '/api/lancette' && req.method === 'GET') {
    const provincia = url.searchParams.get('provincia');
    const mioId = url.searchParams.get('id');
    if (!provincia) return json(res, 400, { error: 'provincia mancante' });

    // Solo presenze vive: battito negli ultimi 5 minuti (Opzione A — nessun dato inventato)
    const viva = sogliaPresenze();

    // Altri utenti online nella stessa provincia (escluso me)
    const altri = db.prepare(`
      SELECT u.id, u.nome, u.tipo FROM utenti u
      JOIN presenze p ON u.id = p.utente_id
      WHERE u.provincia = ? AND u.id != ? AND p.online_da >= ?
      ORDER BY p.online_da ASC
    `).all(provincia, mioId || '', viva);

    // Il luogo di potere della provincia: quello messo in evidenza, altrimenti
    // il primo in ordine stabile. lat/lon servono al TELEFONO per il confronto
    // del check-in: sono coordinate di luoghi pubblici, non la posizione dell'utente.
    const poi = db.prepare('SELECT id, nome, descrizione, provincia, lat, lon FROM poi WHERE provincia = ? ORDER BY evidenza DESC, id LIMIT 1').get(provincia);

    // La rotta della lancetta grande: dal capoluogo della mia provincia
    // verso il luogo di potere. Luoghi pubblici, zero posizioni di persone.
    const mioRif = RIF_PROVINCIA[provincia] || null;
    const angoloLuogo = (poi && mioRif && poi.lat != null && poi.lon != null)
      ? rotta(mioRif[0], mioRif[1], poi.lat, poi.lon)
      : 0; // geografia non ancora mappata: il luogo batte a nord

    // Le anime: le più vicine ovunque (distanza tra capoluoghi, non tra persone).
    // Stessa provincia = distanza zero = nessuna rotta possibile: angolo d'albergo.
    const anime = db.prepare(`
      SELECT u.id, u.nome, u.tipo, u.provincia, p.online_da FROM utenti u
      JOIN presenze p ON u.id = p.utente_id
      WHERE u.id != ? AND p.online_da >= ?
      ORDER BY p.online_da ASC
    `).all(mioId || '', viva);
    const conDistanza = anime.map(a => ({
      ...a,
      _d: distanzaTraRif(mioRif, RIF_PROVINCIA[a.provincia] || null)
    })).sort((a, b) => (a._d - b._d) || (a.online_da < b.online_da ? -1 : 1));

    const angoloAnima = (a, base) => {
      const suoRif = RIF_PROVINCIA[a.provincia] || null;
      if (mioRif && suoRif && a._d > 3000) return rotta(mioRif[0], mioRif[1], suoRif[0], suoRif[1]);
      return base + scartoStabile(mioId, a.id);
    };

    return json(res, 200, {
      provincia,
      lancette: {
        grande: poi ? { ...poi, angolo: Math.round(angoloLuogo), tipo: 'poi' } : null,
        media: conDistanza[0] ? { id: conDistanza[0].id, nome: conDistanza[0].nome, tipo: conDistanza[0].tipo, angolo: Math.round(angoloAnima(conDistanza[0], 90)) } : null,
        piccola: conDistanza[1] ? { id: conDistanza[1].id, nome: conDistanza[1].nome, tipo: conDistanza[1].tipo, angolo: Math.round(angoloAnima(conDistanza[1], 200)) } : null,
      },
      totale_online: altri.length + 1
    });
  }

  // ---- POST /api/checkin ---- ("Il luogo è raggiunto")
  // PIETRA ANGOLARE: questo endpoint accetta SOLO { utente_id, poi_id }.
  // Nessuna coordinata dell'utente viene mai accettata, salvata o loggata:
  // la verifica della vicinanza avviene interamente sul telefono del client.
  if (path === '/api/checkin' && req.method === 'POST') {
    try {
      const body = await readBody(req);
      const { utente_id, poi_id } = body;

      if (!utente_id || !poi_id) return json(res, 400, { error: 'utente o luogo mancanti' });

      const u = db.prepare('SELECT id, nome, provincia FROM utenti WHERE id = ?').get(utente_id);
      if (!u) return json(res, 404, { error: 'Anima sconosciuta' });
      const p = db.prepare('SELECT id, nome FROM poi WHERE id = ?').get(poi_id);
      if (!p) return json(res, 404, { error: 'Luogo sconosciuto' });

      const gia = db.prepare('SELECT 1 FROM visite WHERE utente_id = ? AND poi_id = ?').get(utente_id, poi_id);
      if (gia) return json(res, 200, { ok: true, gia_visitato: true, nome: p.nome });

      db.prepare('INSERT INTO visite (utente_id, poi_id, visitato_il) VALUES (?, ?, ?)')
        .run(utente_id, poi_id, new Date().toISOString());

      const stelle = db.prepare('SELECT COUNT(*) AS n FROM visite WHERE utente_id = ?').get(utente_id).n;

      broadcast(u.provincia, 'poi-visitato', { da: u.nome, poi: p.nome });

      return json(res, 201, { ok: true, gia_visitato: false, nome: p.nome, stelle });
    } catch (e) {
      return json(res, 500, { error: e.message });
    }
  }

  // ---- GET /api/collezione?id=TUO ---- (le stelle raccolte)
  if (path === '/api/collezione' && req.method === 'GET') {
    const mioId = url.searchParams.get('id');
    if (!mioId) return json(res, 400, { error: 'id mancante' });
    const stelle = db.prepare(`
      SELECT v.poi_id, p.nome, p.provincia, p.descrizione, v.visitato_il
      FROM visite v JOIN poi p ON p.id = v.poi_id
      WHERE v.utente_id = ?
      ORDER BY v.visitato_il DESC
    `).all(mioId);
    return json(res, 200, { stelle, totale: stelle.length });
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

    // Heartbeat ogni 25s: tiene vivo lo stream E batte il cuore della presenza
    // (senza questo rintocco, una sessione lunga morirebbe di TTL a 5 minuti)
    const hb = setInterval(() => {
      try {
        res.write(`: ping\n\n`);
        if (mioId) db.prepare('INSERT OR REPLACE INTO presenze (utente_id, provincia, online_da) VALUES (?, ?, ?)')
          .run(mioId, provincia, new Date().toISOString());
      } catch (e) { clearInterval(hb); clients.delete(client); }
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
    const mime = { '.html':'text/html; charset=utf-8', '.js':'text/javascript', '.json':'application/json', '.png':'image/png', '.jpg':'image/jpeg', '.css':'text/css', '.svg':'image/svg+xml' }[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime, 'Access-Control-Allow-Origin': '*' });
    res.end(data);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🧭 Pyxis backend in ascolto su http://localhost:${PORT}`);
  console.log(`   Database: ${DB_PATH}`);
  console.log(`   Frontend servito da: ${__dirname}/..`);
  console.log(`   Pietra angolare: nessuna posizione utente viene mai salvata o trasmessa.`);
});
