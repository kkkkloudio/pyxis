// Pyxis — Frontend V5: lancette flip (grande=POI, media=prima anima, piccola=seconda)
// + check-in "Il luogo è raggiunto" + collezione di stelle.
// PIETRA ANGOLARE: mai trattenere, salvare o trasmettere la posizione dell'utente.
// Il GPS si legge SOLO al click sul bottone: la distanza si calcola sul telefono
// e al server partono unicamente { utente_id, poi_id }. Mai coordinate in rete.

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
  "Salerno","Sassari","Savona","Siena","Siracusa","Sondrio","Taranto","Teramo","Terni",
  "Torino","Trapani","Trento","Treviso","Trieste","Udine","Varese","Venezia","Verbania",
  "Vercelli","Verona","Vibo Valentia","Vicenza","Viterbo"
];

const API = (location.hostname === 'kkkkloudio.github.io' || location.hostname.endsWith('github.io'))
  ? 'https://incidence-tutorial-anna-helen.trycloudflare.com'  // tunnel pubblico HTTPS (mini PC acceso)
  : '';                          // in locale (localhost) usa stesso origin

const RAGGIO_M = 500; // quanto vicino devi essere al luogo sacro perché la stella si posi

let utente = JSON.parse(localStorage.getItem('pyxis-utente') || 'null');
let evtSource = null;
let destinatario = null;   // l'anima più vicina (lancetta media): { id, nome }
let poiCorrente = null;     // il luogo sacro (lancetta grande): { id, nome, lat, lon }

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

  // ===== selezione lancette in legenda =====
  document.querySelectorAll('.legenda-item').forEach(item => {
    item.addEventListener('click', function () {
      document.querySelectorAll('.legenda-item').forEach(i => i.classList.remove('sel'));
      this.classList.add('sel');
      const tipo = this.dataset.tipo;
      document.querySelectorAll('.lancetta').forEach(l => l.style.opacity = '0.15');
      const sel = document.querySelector('.lancetta.' + tipo);
      if (sel) sel.style.opacity = '1';
    });
  });

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
  const g = document.querySelector('.lancetta.grande');
  const m = document.querySelector('.lancetta.media');
  const p = document.querySelector('.lancetta.piccola');
  const itemG = document.querySelector('.legenda-item[data-tipo="grande"]');
  const itemM = document.querySelector('.legenda-item[data-tipo="media"]');
  const itemP = document.querySelector('.legenda-item[data-tipo="piccola"]');
  const btnLettera = document.getElementById('btn-lettera');
  const btnVisita = document.getElementById('btn-visita');

  // GRANDE: il luogo sacro (POI)
  if (l.grande) {
    g.style.transform = 'rotate(' + l.grande.angolo + 'deg)';
    g.style.opacity = '1';
    itemG.style.display = '';
    itemG.querySelector('.nome').textContent = l.grande.nome;
    itemG.querySelector('.dett').textContent = 'luogo sacro · ' + l.grande.provincia;
    poiCorrente = { id: l.grande.id, nome: l.grande.nome, lat: l.grande.lat, lon: l.grande.lon };
    if (btnVisita) btnVisita.disabled = false;
  } else {
    // Nessun luogo sacro puntato: niente stella da raccogliere
    itemG.style.display = 'none';
    g.style.opacity = '0.1';
    poiCorrente = null;
    if (btnVisita) btnVisita.disabled = true;
  }

  // MEDIA: l'anima più vicina (destinataria del corvo)
  if (l.media) {
    m.style.transform = 'rotate(' + l.media.angolo + 'deg)';
    m.style.opacity = '1';
    itemM.style.display = '';
    itemM.querySelector('.nome').textContent = l.media.nome;
    itemM.querySelector('.dett').textContent = 'anima più vicina';
    destinatario = { id: l.media.id, nome: l.media.nome };
    btnLettera.disabled = false;
  } else {
    // Nessuna anima vicina: lancetta spenta, corvo senza meta
    itemM.style.display = 'none';
    m.style.opacity = '0.1';
    destinatario = null;
    btnLettera.disabled = true;
  }

  // PICCOLA: la seconda anima
  if (l.piccola) {
    p.style.transform = 'rotate(' + l.piccola.angolo + 'deg)';
    p.style.opacity = '1';
    itemP.style.display = '';
    itemP.querySelector('.nome').textContent = l.piccola.nome;
    itemP.querySelector('.dett').textContent = 'seconda anima';
  } else {
    itemP.style.display = 'none';
    p.style.opacity = '0.1';
  }

  const nota = document.querySelector('#schermata-bussola .nota');
  if (nota) nota.textContent = totale + ' anime in ascolto · la posizione resta sul telefono · solo la bussola sa';
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
    alert('La bussola non punta ancora a nessun luogo sacro.');
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
      alert('Il luogo sacro non ti sente ancora: sei lontano. La distanza non si dice, ma la bussola sa.');
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
      lista.innerHTML = '<div class="stella-raccolta"><div class="nome">Nessuna stella, per ora.</div><div class="quando">Segui la lancetta grande e raggiungi il luogo sacro.</div></div>';
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
