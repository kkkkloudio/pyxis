// Pyxis — Frontend V8.8: la bussola sveglia — l'ago che indica davvero.
// (V6: molle e attrito) — gli aghi cercano, sforano, si assestano, tremano.
// (grande=POI, media=prima anima, piccola=seconda)
// V8.8: sul telefono con i sensori, l'ago grande punta il luogo NEL MONDO REALE:
// tieni lo schermo davanti e girati — quando l'ago entra nella PORTA (il triangolo
// d'ottone in alto) stai guardando nella direzione del luogo da visitare.
// Tocca un ago (o la sua riga in legenda) e lui si presenta; gli altri si abbassano.
// PIETRA ANGOLARE: mai trattenere, salvare o trasmettere la posizione dell'utente.
// GPS e bussola interna si legano SOLO sul telefono: la rotta vera verso il luogo
// si calcola qui e non parte mai. Al server arrivano solo { utente_id, poi_id }.
// V8.10: le porte d'Italia — tutte le 107 province all'iscrizione (aggiunta
// la Sud Sardegna, che mancava).

const PROVINCE = [
  "Agrigento","Alessandria","Ancona","Aosta","Arezzo","Ascoli Piceno","Asti","Avellino",
  "Bari","Barletta-Andria-Trani","Belluno","Benevento","Bergamo","Biella","Bologna","Bolzano",
  "Brescia","Brindisi","Cagliari","Caltanissetta","Campobasso","Caserta","Catania","Catanzaro",
  "Chieti","Como","Cosenza","Cremona","Crotone","Cuneo","Enna","Fermo","Ferrara","Firenze",
  "Foggia","Forlì-Cesena","Frosinone","Genova","Gorizia","Grosseto","Imperia","Isernia",
  "L'Aquila","La Spezia","Latina","Lecce","Lecco","Livorno","Lodi","Lucca","Macerata",
  "Mantova","Massa-Carrara","Matera","Messina","Milano","Modena","Monza e della Brianza",
  "Napoli","Novara","Nuoro","Oristano","Padova","Palermo","Parma","Pavia","Perugia",
  "Pesaro e Urbino","Pescara","Piacenza","Pisa","Pistoia","Pordenone","Potenza","Prato",
  "Ragusa","Ravenna","Reggio Calabria","Reggio Emilia","Rieti","Rimini","Roma","Rovigo",
  "Salerno","Sassari","Savona","Siena","Siracusa","Sondrio","Sud Sardegna","Taranto","Teramo","Terni",
  "Torino","Trapani","Trento","Treviso","Trieste","Udine","Varese","Venezia","Verbania",
  "Vercelli","Verona","Vibo Valentia","Vicenza","Viterbo"
];

const API = (location.hostname === 'kkkkloudio.github.io' || location.hostname.endsWith('github.io'))
  ? 'https://pyxis-1.tail971635.ts.net'  // backend via Tailscale serve sul mini PC (hostname definitivo: pyxis-1)
  : '';                          // in locale (localhost) usa stesso origin

const RAGGIO_M = 500; // quanto vicino devi essere al luogo di potere perché la stella si posi

let utente = JSON.parse(localStorage.getItem('pyxis-utente') || 'null');
let evtSource = null;
let destinatario = null;   // l'anima più vicina (lancetta media): { id, nome }
let poiCorrente = null;     // il luogo di potere (lancetta grande): { id, nome, lat, lon }

document.addEventListener('DOMContentLoaded', function () {
  // ===== IL SIPARIO: lo scrigno si apre =====
  const apertura = document.getElementById('apertura');
  if (apertura) {
    let chiusa = false;
    const chiudiApertura = () => {
      if (chiusa) return;
      chiusa = true;
      apertura.style.transition = 'opacity .6s';
      apertura.style.opacity = '0';
      apertura.style.pointerEvents = 'none';
      setTimeout(() => apertura.remove(), 700);
    };
    apertura.addEventListener('click', chiudiApertura);
    setTimeout(chiudiApertura, 3300); // il sipario va via da solo
  }

  const select = document.getElementById('provincia');
  PROVINCE.forEach(p => {
    const o = document.createElement('option');
    o.value = p; o.textContent = p;
    select.appendChild(o);
  });

  document.getElementById('btn-inizia').addEventListener('click', async function () {
    const nome = document.getElementById('nome').value.trim();
    const provincia = document.getElementById('provincia').value;

    if (!nome) return alert("Scegli un nome d'arte");
    if (!provincia) return alert('Scegli la provincia');

    try {
      const resp = await fetch(API + '/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, provincia })
      });
      const testo = await resp.text();
      let data;
      try { data = JSON.parse(testo); } catch (e) {
        throw new Error('Il server non risponde (HTML ricevuto). Sei sulla stessa rete del mini PC?');
      }

      if (!resp.ok) {
        alert(data.error || 'Errore nella registrazione');
        return;
      }

      utente = data.utente;
      localStorage.setItem('pyxis-utente', JSON.stringify(utente));
      mostraBussola();
      avviaSSE();
      caricaLancette();
    } catch (e) {
      alert('Backend non raggiungibile: ' + e.message);
    }
  });

  if (utente) {
    mostraBussola();
    avviaSSE();
    caricaLancette();
  }

  // ===== V8.8 — tocca l'ago per sapere chi punta =====
  document.querySelectorAll('.lancetta').forEach(l => {
    l.addEventListener('click', () => selezionaAgo(l.dataset.tipo));
  });
  document.querySelectorAll('.legenda-item').forEach(item => {
    item.addEventListener('click', () => selezionaAgo(item.dataset.tipo));
  });
  const btnSveglia = document.getElementById('btn-sveglia');
  if (btnSveglia) btnSveglia.addEventListener('click', svegliaAgo);

  // ===== il corvo =====
  document.getElementById('btn-lettera').addEventListener('click', apriScrittura);
  document.getElementById('btn-posta').addEventListener('click', apriPosta);
  document.getElementById('btn-affida').addEventListener('click', inviaLettera);
  document.getElementById('btn-annulla-lettera').addEventListener('click', () => chiudiModale('modale-scrittura'));
  document.getElementById('btn-chiudi-posta').addEventListener('click', () => chiudiModale('modale-posta'));

  // ===== il check-in e la collezione =====
  document.getElementById('btn-visita').addEventListener('click', checkIn);
  document.getElementById('btn-collezione').addEventListener('click', apriCollezione);
  document.getElementById('btn-chiudi-collezione').addEventListener('click', () => chiudiModale('modale-collezione'));
});

function mostraBussola() {
  document.getElementById('schermata-iscrizione').classList.remove('attiva');
  document.getElementById('schermata-bussola').classList.add('attiva');
  document.getElementById('sottotitolo-utente').textContent =
    utente.nome + ' · ' + utente.provincia;
  avviaBussolaViva(); // gli aghi prendono vita appena lo scrigno si apre
}

async function caricaLancette() {
  if (!utente) return;
  try {
    const resp = await fetch(API + '/api/lancette?provincia=' + encodeURIComponent(utente.provincia) + '&id=' + utente.id);
    const data = await resp.json();
    aggiornaLancette(data.lancette, data.totale_online);
  } catch (e) {
    console.error('Errore lancette:', e);
  }
}

function aggiornaLancette(l, totale) {
  const itemG = document.querySelector('.legenda-item[data-tipo="grande"]');
  const itemM = document.querySelector('.legenda-item[data-tipo="media"]');
  const itemP = document.querySelector('.legenda-item[data-tipo="piccola"]');
  const btnLettera = document.getElementById('btn-lettera');
  const btnVisita = document.getElementById('btn-visita');

  INFO_AGO.grande = null; INFO_AGO.media = null; INFO_AGO.piccola = null;

  // GRANDE: il luogo di potere (POI)
  if (l.grande) {
    // Bussola sveglia e posizione nota (SOLO sul telefono): la rotta è VERA,
    // da te al luogo. Altrimenti resta la rotta dal capoluogo, l'approssimazione del server.
    let angolo = l.grande.angolo;
    if (BVERA.pos && l.grande.lat != null && l.grande.lon != null) {
      angolo = rottaVera(BVERA.pos.lat, BVERA.pos.lon, l.grande.lat, l.grande.lon);
    }
    puntaLancetta('grande', angolo); // la molla farà il resto: sforo e assesto
    itemG.style.display = '';
    itemG.querySelector('.nome').textContent = l.grande.nome;
    itemG.querySelector('.dett').textContent = l.grande.descrizione || ('luogo di potere · ' + l.grande.provincia);
    poiCorrente = { id: l.grande.id, nome: l.grande.nome, lat: l.grande.lat, lon: l.grande.lon };
    INFO_AGO.grande = { nome: l.grande.nome };
    if (btnVisita) btnVisita.disabled = false;
  } else {
    // Nessun luogo di potere puntato: niente stella da raccogliere
    itemG.style.display = 'none';
    poiCorrente = null;
    spegniLancetta('grande'); // l'ago torna a cercare, e non trova
    if (btnVisita) btnVisita.disabled = true;
  }

  // MEDIA: l'anima più vicina (destinataria del corvo)
  if (l.media) {
    puntaLancetta('media', l.media.angolo);
    itemM.style.display = '';
    itemM.querySelector('.nome').textContent = l.media.nome;
    itemM.querySelector('.dett').textContent = 'anima più vicina';
    destinatario = { id: l.media.id, nome: l.media.nome };
    INFO_AGO.media = { nome: l.media.nome };
    btnLettera.disabled = false;
  } else {
    // Nessuna anima vicina: lancetta spenta, corvo senza meta
    itemM.style.display = 'none';
    destinatario = null;
    spegniLancetta('media');
    btnLettera.disabled = true;
  }

  // PICCOLA: la seconda anima
  if (l.piccola) {
    puntaLancetta('piccola', l.piccola.angolo);
    itemP.style.display = '';
    itemP.querySelector('.nome').textContent = l.piccola.nome;
    itemP.querySelector('.dett').textContent = 'seconda anima';
    INFO_AGO.piccola = { nome: l.piccola.nome };
  } else {
    itemP.style.display = 'none';
    spegniLancetta('piccola');
  }

  aggiornaVisibilitaAghi();
  aggiornaCaption();

  const nota = document.querySelector('#schermata-bussola .nota');
  if (nota) nota.textContent = totale + ' anime in ascolto · la posizione resta sul telefono · solo la bussola sa';
}

// ===== TOCCA L'AGO (V8.8): chi stai puntando? =====
// Tocchi un ago (o la sua riga in legenda): lui si presenta nella didascalia,
// gli altri due si abbassano. Lo tocchi ancora e tutto torna com'era.
const INFO_AGO = { grande:null, media:null, piccola:null };
let agoSelezionato = null;
const COLORI_AGO = { grande:'#d98a6a', media:'#7cc9a2', piccola:'#8ab0e0' };
const DETTI_AGO  = { grande:'il luogo di potere', media:'l\'anima più vicina', piccola:'la seconda anima' };

function selezionaAgo(tipo) {
  if (!tipo) return;
  agoSelezionato = (agoSelezionato === tipo) ? null : tipo;
  document.querySelectorAll('.legenda-item').forEach(i =>
    i.classList.toggle('sel', i.dataset.tipo === agoSelezionato));
  aggiornaVisibilitaAghi();
  aggiornaCaption();
}

function aggiornaVisibilitaAghi() {
  ['grande','media','piccola'].forEach(tipo => {
    const el = document.querySelector('.lancetta.' + tipo);
    if (!el) return;
    const presente = VIVA.aghi[tipo] && VIVA.aghi[tipo].bersaglio != null;
    if (agoSelezionato) el.style.opacity = (tipo === agoSelezionato) ? '1' : '0.12';
    else el.style.opacity = presente ? '1' : '0.1';
  });
}

function aggiornaCaption() {
  const cap = document.getElementById('caption-bussola');
  if (!cap) return;
  if (!agoSelezionato) {
    cap.style.color = '';
    cap.textContent = BVERA.attiva
      ? 'bussola sveglia: gli aghi puntano davvero — tocca un ago per sapere chi è'
      : 'tocca un ago per sapere chi punta';
    return;
  }
  cap.style.color = COLORI_AGO[agoSelezionato];
  const info = INFO_AGO[agoSelezionato];
  if (!info) {
    cap.textContent = '→ quest\'ago sta ancora cercando: non punta nessuno, per ora';
    return;
  }
  let testo = '→ ' + info.nome + ' · ' + DETTI_AGO[agoSelezionato];
  if (agoSelezionato === 'grande' && BVERA.attiva) testo += ' — girati finché l\'ago entra nella porta';
  cap.textContent = testo;
}

// ===== LA BUSSOLA VIVA: molle e attrito =====
// Un ago magnetico vero non sta mai fermo: cerca, sfora il bersaglio, torna,
// si assesta, e da fermo trema appena, come in ascolto. Qui non c'è nessuna
// posizione dell'utente: solo gli angoli che manda il server, vestiti di fisica.

const VIVA = { avviata:false, ferma:false, tPrec:null, aghi:{} };

function avviaBussolaViva() {
  if (VIVA.avviata) return;
  VIVA.avviata = true;
  const partenza = { grande:-50, media:40, piccola:160 }; // gli angoli disegnati nel CSS
  ['grande','media','piccola'].forEach(tipo => {
    const el = document.querySelector('.lancetta.' + tipo);
    if (!el) return;
    VIVA.aghi[tipo] = {
      el: el,
      tipo: tipo,
      angolo: partenza[tipo],
      vel: 0,
      bersaglio: null,          // null: l'ago cerca e non trova
      deriva: partenza[tipo],  // dove vaga chi non ha ancora un segnale
      prossimoGiro: performance.now() + 8000 + Math.random() * 8000,
      perdeIlFilo: 0,          // la piccola deriva di chi ri-ascolta
      prossimoFiloperduto: 0,
      fase: Math.random() * Math.PI * 2,  // il tremito è un respiro lento, mica un fremito
      freq: 0.08 + Math.random() * 0.12,
      tremore: 0.25 + Math.random() * 0.25
    };
  });
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    VIVA.ferma = true; // chi ha chiesto calma al telefono, calma avrà
    return;
  }
  requestAnimationFrame(loopBussolaViva);
}

function loopBussolaViva(t) {
  const dt = Math.min(((t - (VIVA.tPrec ?? t)) / 1000) || 0.016, 0.05);
  VIVA.tPrec = t;
  for (const tipo in VIVA.aghi) stepAgo(VIVA.aghi[tipo], dt, t);
  requestAnimationFrame(loopBussolaViva);
}

function stepAgo(A, dt, t) {
  let bers = A.bersaglio;
  const sveglia = BVERA.attiva && BVERA.heading != null && A.bersaglio != null;
  if (sveglia) {
    // BUSSOLA SVEGLIA: angolo nel mondo meno dove sei rivolto tu = dove sta l'ago
    // sul quadrante. Strada più corta: mai il giro completo quando passi da 359 a 0.
    bers = A.bersaglio - BVERA.heading;
    while (bers - A.angolo > 180) bers -= 360;
    while (bers - A.angolo < -180) bers += 360;
  }
  if (bers == null) {
    // nessun segnale: l'ago vaga piano, quasi addormentato
    if (t >= A.prossimoGiro) {
      A.deriva = Math.random() * 360 - 180;
      A.prossimoGiro = t + 14000 + Math.random() * 12000;
    }
    molla(A, A.deriva, 1.0, 3.0, dt);
  } else {
    // ogni tanto l'ago perde il filo di qualche grado, poi lo ritrova
    if (t >= A.prossimoFiloperduto) {
      A.perdeIlFilo = (Math.random() < 0.5 ? -1 : 1) * (5 + Math.random() * 7);
      A.prossimoFiloperduto = t + 25000 + Math.random() * 35000;
    }
    A.perdeIlFilo *= Math.exp(-dt / 3.5); // il filo si ritrova piano
    // l'ago del luogo, quando la bussola è sveglia, NON perde mai il filo: deve essere vero
    const filo = (sveglia && A.tipo === 'grande') ? 0 : A.perdeIlFilo;
    molla(A, bers + filo, 7, 2.8, dt);
  }
  // il tremito: un respiro di un grado, mai fermo del tutto
  const tremito = Math.sin(t / 1000 * A.freq * Math.PI * 2 + A.fase) * A.tremore;
  A.el.style.transform = 'rotate(' + (A.angolo + tremito).toFixed(2) + 'deg)';
}

function molla(A, bersaglio, k, c, dt) {
  // la molla tira verso il bersaglio, l'attrito rallenta: insieme fanno lo sforo
  const acc = k * (bersaglio - A.angolo) - c * A.vel;
  A.vel += acc * dt;
  if (A.vel > 420) A.vel = 420;      // la magia non ha mai fretta
  if (A.vel < -420) A.vel = -420;
  A.angolo += A.vel * dt;
}

function puntaLancetta(tipo, angolo) {
  const A = VIVA.aghi[tipo];
  if (!A) return;
  if (VIVA.ferma) { A.el.style.transform = 'rotate(' + angolo + 'deg)'; return; }
  A.bersaglio = angolo;
  A.prossimoFiloperduto = performance.now() + 12000 + Math.random() * 20000;
  // niente strattoni d'arrivo: lo sweep elegante lo fa la molla da sola
}

function spegniLancetta(tipo) {
  const A = VIVA.aghi[tipo];
  if (!A) return;
  A.bersaglio = null; // niente segnale: si torna a cercare, e non trovare
}

// ===== LA BUSSOLA SVEGLIA (V8.8): l'ago che indica davvero =====
// Il telefono ha una bussola magnetica e sa dove sei. ENTRAMBE le cose restano
// sul telefono: qui si calcola l'angolo vero verso il luogo, e non parte mai
// niente. Al server arrivano sempre e solo i luoghi pubblici.
const BVERA = { attiva:false, heading:null, pos:null };

function rottaVera(lat1, lon1, lat2, lon2) {
  const rad = x => x * Math.PI / 180;
  const y = Math.sin(rad(lon2 - lon1)) * Math.cos(rad(lat2));
  const x = Math.cos(rad(lat1)) * Math.sin(rad(lat2)) -
            Math.sin(rad(lat1)) * Math.cos(rad(lat2)) * Math.cos(rad(lon2 - lon1));
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

function leggiNord(e) {
  // Safari/vecchi iPhone: webkitCompassHeading è già l'orientamento dal nord (senso orario)
  if (typeof e.webkitCompassHeading === 'number' && !isNaN(e.webkitCompassHeading)) {
    BVERA.heading = e.webkitCompassHeading;
    return;
  }
  // Android assoluto: alpha conta in senso antiorario — si rigira
  if (e.absolute && e.alpha != null) BVERA.heading = (360 - e.alpha) % 360;
}

async function svegliaAgo() {
  const btn = document.getElementById('btn-sveglia');
  if (!btn || BVERA.attiva) return;
  try {
    // iOS chiede il permesso dei sensori da un tocco esplicito
    if (typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      const perm = await DeviceOrientationEvent.requestPermission();
      if (perm !== 'granted') {
        alert('Senza il permesso dei sensori l\'ago resta addormentato: la bussola si vedrà, ma punterà solo nel gioco.');
        return;
      }
    }
    window.addEventListener('deviceorientationabsolute', leggiNord, true);
    window.addEventListener('deviceorientation', leggiNord, true);
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(function (pos) {
        // La posizione vive SOLO qui: serve all'ago per la rotta vera, non parte mai.
        BVERA.pos = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        if (poiCorrente && poiCorrente.lat != null && VIVA.aghi.grande) {
          puntaLancetta('grande', rottaVera(BVERA.pos.lat, BVERA.pos.lon, poiCorrente.lat, poiCorrente.lon));
        }
      }, function () {
        // niente GPS: l'ago userà la rotta dal capoluogo, resta comunque una bussola
      }, { enableHighAccuracy: false, timeout: 30000, maximumAge: 15000 });
    }
    BVERA.attiva = true;
    btn.classList.add('viva');
    btn.textContent = '🧭 l\'ago è sveglio — girati finché il granato entra nella porta';
    aggiornaCaption();
  } catch (e) {
    alert('Questo scrigno non ha l\'ago magnetico: ' + e.message);
  }
}

// ===== IL CHECK-IN: "Il luogo è raggiunto" =====
// Il GPS si legge una volta sola, qui nel browser. La posizione NON viene
// salvata, NON viene inviata: serve solo a confrontare la distanza dal POI
// e muore in questa funzione. Al server partono solo { utente_id, poi_id }.
function distanzaMetri(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const rad = x => x * Math.PI / 180;
  const dLat = rad(lat2 - lat1);
  const dLon = rad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(rad(lat1)) * Math.cos(rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return 2 * R * Math.asin(Math.sqrt(a));
}

function checkIn() {
  if (!utente) return;
  if (!poiCorrente) {
    alert('La bussola non punta ancora a nessun luogo di potere.');
    return;
  }
  if (poiCorrente.lat == null || poiCorrente.lon == null) {
    alert('Questo luogo non ha ancora coordinate: la stella non può posarsi.');
    return;
  }
  if (!navigator.geolocation) {
    alert('Questo scrigno non ha un ago GPS.');
    return;
  }

  const btn = document.getElementById('btn-visita');
  const etichetta = btn.textContent;
  btn.disabled = true;
  btn.textContent = '✨ la bussola ascolta…';

  navigator.geolocation.getCurrentPosition(function (pos) {
    // La posizione vive SOLO qui: confronto sul telefono, poi non serve più.
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    const d = distanzaMetri(lat, lon, poiCorrente.lat, poiCorrente.lon);

    if (d > RAGGIO_M) {
      btn.disabled = false;
      btn.textContent = etichetta;
      alert('Il luogo di potere non ti sente ancora: sei lontano. La distanza non si dice, ma la bussola sa.');
      return;
    }

    fetch(API + '/api/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ utente_id: utente.id, poi_id: poiCorrente.id })
    })
      .then(r => r.json())
      .then(data => {
        btn.disabled = false;
        btn.textContent = etichetta;
        if (!data.ok) { alert(data.error || 'Il luogo non ha accolto la firma.'); return; }
        if (data.gia_visitato) { alert('Avevi già lasciato la tua stella qui.'); return; }
        mostraStella(data.nome, data.stelle);
      })
      .catch(e => {
        btn.disabled = false;
        btn.textContent = etichetta;
        alert('Il server non risponde: ' + e.message);
      });
  }, function () {
    btn.disabled = false;
    btn.textContent = etichetta;
    alert('Lo scrigno non ha il permesso di leggere l\'ago GPS. La posizione resta comunque solo tua.');
  }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 });
}

function mostraStella(nomePoi, stelle) {
  const toast = document.createElement('div');
  toast.className = 'toast-corvo';
  toast.textContent = '⭐ Una stella si è posata: ' + nomePoi + ' — ' + stelle + (stelle === 1 ? ' stella in collezione' : ' stelle in collezione');
  document.querySelector('.screen').appendChild(toast);
  setTimeout(() => toast.classList.add('spegni'), 6000);
  setTimeout(() => toast.remove(), 6600);
}

// ===== LA COLLEZIONE =====
async function apriCollezione() {
  if (!utente) return;
  try {
    const resp = await fetch(API + '/api/collezione?id=' + encodeURIComponent(utente.id));
    const data = await resp.json();
    const lista = document.getElementById('collezione-lista');
    lista.innerHTML = '';
    if (!data.stelle.length) {
      lista.innerHTML = '<div class="stella-raccolta"><div class="nome">Nessuna stella, per ora.</div><div class="quando">Segui la lancetta grande e raggiungi il luogo di potere.</div></div>';
    } else {
      data.stelle.forEach(S => {
        const el = document.createElement('div');
        el.className = 'stella-raccolta';
        const quando = new Date(S.visitato_il).toLocaleString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
        el.innerHTML = '<div class="stella">⭐</div>' +
                       '<div class="nome">' + escapeHtml(S.nome) + '</div>' +
                       '<div class="quando">' + escapeHtml(S.provincia) + ' · ' + quando + '</div>';
        lista.appendChild(el);
      });
    }
    document.getElementById('modale-collezione').classList.remove('nascosto');
  } catch (e) {
    alert('La collezione non risponde (server non raggiungibile): ' + e.message);
  }
}

// ===== IL CORVO =====
function apriScrittura() {
  if (!destinatario) {
    alert('Non c\'è nessuno a cui affidare il corvo: sei da solo nel tuo cielo, per ora.');
    return;
  }
  document.getElementById('lettera-dest').textContent = destinatario.nome;
  document.getElementById('lettera-testo').value = '';
  document.getElementById('modale-scrittura').classList.remove('nascosto');
  document.getElementById('lettera-testo').focus();
}

function chiudiModale(id) {
  document.getElementById(id).classList.add('nascosto');
}

async function inviaLettera() {
  const testo = document.getElementById('lettera-testo').value.trim();
  if (!testo) return;
  try {
    const resp = await fetch(API + '/api/lettera', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mittente_id: utente.id, destinatario_id: destinatario.id, testo })
    });
    if (!resp.ok) {
      const d = await resp.json().catch(() => ({}));
      alert(d.error || 'Il corvo non è riuscito a partire');
      return;
    }
    chiudiModale('modale-scrittura');
    // il corvo spicca il volo
    const corvo = document.createElement('div');
    corvo.className = 'corvo-volo';
    corvo.textContent = '🐦‍⬛';
    document.querySelector('.screen').appendChild(corvo);
    setTimeout(() => corvo.remove(), 1700);
  } catch (e) {
    alert('Il corvo non trova la via (server non raggiungibile): ' + e.message);
  }
}

async function apriPosta() {
  if (!utente) return;
  try {
    const resp = await fetch(API + '/api/lettere?id=' + encodeURIComponent(utente.id));
    const data = await resp.json();
    const lista = document.getElementById('posta-lista');
    lista.innerHTML = '';
    if (!data.lettere.length) {
      lista.innerHTML = '<div class="lettera-ricevuta"><div class="testo">Nessuna lettera, per ora. La bussola sa attendere.</div></div>';
    } else {
      data.lettere.forEach(L => {
        const el = document.createElement('div');
        el.className = 'lettera-ricevuta';
        const quando = new Date(L.creata_il).toLocaleString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
        el.innerHTML = '<div class="da">🐦‍⬛ da ' + escapeHtml(L.mittente_nome) + '</div>' +
                       '<div class="testo">' + escapeHtml(L.testo) + '</div>' +
                       '<div class="quando">' + quando + '</div>';
        lista.appendChild(el);
      });
    }
    document.getElementById('modale-posta').classList.remove('nascosto');
  } catch (e) {
    alert('La posta non risponde (server non raggiungibile): ' + e.message);
  }
}

function escapeHtml(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

// ===== SSE (real-time) =====
function avviaSSE() {
  if (!utente) return;
  if (evtSource) evtSource.close();

  evtSource = new EventSource(API + '/api/events?provincia=' + encodeURIComponent(utente.provincia) + '&id=' + utente.id);

  evtSource.addEventListener('connesso', e => {
    console.log('SSE connesso:', JSON.parse(e.data));
  });

  evtSource.addEventListener('nuovo-utente', e => {
    const d = JSON.parse(e.data);
    console.log('Nuovo utente:', d);
    caricaLancette();
  });

  // una stella si è posata: qualcuno in provincia ha raggiunto un luogo
  evtSource.addEventListener('poi-visitato', e => {
    const d = JSON.parse(e.data);
    if (d.da === utente.nome) return; // la mia stella l'ho già vista
    const toast = document.createElement('div');
    toast.className = 'toast-corvo';
    toast.textContent = '⭐ ' + d.da + ' ha raccolto una stella: ' + d.poi;
    document.querySelector('.screen').appendChild(toast);
    setTimeout(() => toast.classList.add('spegni'), 5000);
    setTimeout(() => toast.remove(), 5600);
  });

  // un corvo è planato: lettera in arrivo
  evtSource.addEventListener('lettera', e => {
    const d = JSON.parse(e.data);
    if (d.destinatario_id !== utente.id) return;
    const toast = document.createElement('div');
    toast.className = 'toast-corvo';
    toast.textContent = '🐦‍⬛ Un corvo è planato: lettera da ' + d.da;
    toast.addEventListener('click', () => { toast.remove(); apriPosta(); });
    document.querySelector('.screen').appendChild(toast);
    setTimeout(() => toast.classList.add('spegni'), 5000);
    setTimeout(() => toast.remove(), 5600);
  });

  evtSource.onerror = () => {
    console.log('SSE disconnesso, riconnetto...');
  };
}
