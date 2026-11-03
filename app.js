// Pyxis — Frontend V4: nessuna categoria, il corvo per le lettere, apertura animata
// Iscrizione reale via API + bussola real-time (SSE) + lettere al vicino

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

let utente = JSON.parse(localStorage.getItem('pyxis-utente') || 'null');
let evtSource = null;
let destinatario = null; // l'anima più vicina: { id, nome }

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

  if (l.grande) {
    g.style.transform = 'rotate(' + l.grande.angolo + 'deg)';
    g.style.opacity = '1';
    itemG.style.display = '';
    itemG.querySelector('.nome').textContent = l.grande.nome;
    itemG.querySelector('.dett').textContent = 'anima più vicina';
    destinatario = { id: l.grande.id, nome: l.grande.nome };
    btnLettera.disabled = false;
  } else {
    // Nessuna anima vicina: lancetta spenta, corvo senza meta
    itemG.style.display = 'none';
    g.style.opacity = '0.1';
    destinatario = null;
    btnLettera.disabled = true;
  }

  if (l.media) {
    m.style.transform = 'rotate(' + l.media.angolo + 'deg)';
    m.style.opacity = '1';
    itemM.style.display = '';
    itemM.querySelector('.nome').textContent = l.media.nome;
    itemM.querySelector('.dett').textContent = 'seconda anima';
  } else {
    itemM.style.display = 'none';
    m.style.opacity = '0.1';
  }

  if (l.piccola) {
    p.style.transform = 'rotate(' + l.piccola.angolo + 'deg)';
    p.style.opacity = '1';
    itemP.style.display = '';
    itemP.querySelector('.nome').textContent = l.piccola.nome;
    itemP.querySelector('.dett').textContent = 'luogo sacro · ' + l.piccola.provincia;
  }

  const nota = document.querySelector('#schermata-bussola .nota');
  if (nota) nota.textContent = totale + ' anime online a ' + utente.provincia + ' · niente GPS · solo la bussola sa';
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
