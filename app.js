// Pyxis — Frontend V3: iscrizione reale via API + bussola real-time (SSE)

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

const TIPI = {
  strega: '☾ Strega',
  stregone: '✦ Stregone',
  sciamano: '🪶 Sciamano',
  guaritore: '❦ Guaritore',
  veggente: '👁 Veggente',
  viandante: '◎ Viandante'
};

const API = (location.hostname === 'kkkkloudio.github.io' || location.hostname.endsWith('github.io'))
  ? 'https://incidence-tutorial-anna-helen.trycloudflare.com'  // tunnel pubblico HTTPS (mini PC acceso)
  : '';                          // in locale (localhost) usa stesso origin

let utente = JSON.parse(localStorage.getItem('pyxis-utente') || 'null');
let evtSource = null;

document.addEventListener('DOMContentLoaded', function() {
  const select = document.getElementById('provincia');
  PROVINCE.forEach(p => {
    const o = document.createElement('option');
    o.value = p; o.textContent = p;
    select.appendChild(o);
  });

  let selezionata = null;
  document.querySelectorAll('.tipologia').forEach(t => {
    t.addEventListener('click', function() {
      document.querySelectorAll('.tipologia').forEach(x => x.classList.remove('sel'));
      this.classList.add('sel');
      selezionata = this.dataset.tipo;
    });
  });

  document.getElementById('btn-inizia').addEventListener('click', async function() {
    const nome = document.getElementById('nome').value.trim();
    const provincia = document.getElementById('provincia').value;

    if (!nome) return alert("Scegli un nome d'arte");
    if (!selezionata) return alert('Scegli la tua via');
    if (!provincia) return alert('Scegli la provincia');

    try {
      const resp = await fetch(API + '/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, tipo: selezionata, provincia })
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

  document.querySelectorAll('.legenda-item').forEach(item => {
    item.addEventListener('click', function() {
      document.querySelectorAll('.legenda-item').forEach(i => i.classList.remove('sel'));
      this.classList.add('sel');
      const tipo = this.dataset.tipo;
      document.querySelectorAll('.lancetta').forEach(l => l.style.opacity = '0.15');
      const sel = document.querySelector('.lancetta.' + tipo);
      if (sel) sel.style.opacity = '1';
    });
  });
});

function mostraBussola() {
  document.getElementById('schermata-iscrizione').classList.remove('attiva');
  document.getElementById('schermata-bussola').classList.add('attiva');
  const tipoTxt = TIPI[utente.tipo] || utente.tipo;
  document.getElementById('sottotitolo-utente').textContent =
    `${utente.nome} · ${tipoTxt} · ${utente.provincia}`;
}

async function caricaLancette() {
  if (!utente) return;
  try {
    const resp = await fetch(`${API}/api/lancette?provincia=${encodeURIComponent(utente.provincia)}&id=${utente.id}`);
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

  if (l.grande) {
    g.style.transform = `rotate(${l.grande.angolo}deg)`;
    g.style.opacity = '1';
    itemG.querySelector('.nome').textContent = l.grande.nome;
    itemG.querySelector('.dett').textContent = TIPI[l.grande.tipo] + ' · anima più vicina';
  } else {
    itemG.querySelector('.nome').textContent = '— nessuno vicino —';
    itemG.querySelector('.dett').textContent = 'sei il primo qui';
    g.style.opacity = '0.15';
  }

  if (l.media) {
    m.style.transform = `rotate(${l.media.angolo}deg)`;
    m.style.opacity = '1';
    itemM.querySelector('.nome').textContent = l.media.nome;
    itemM.querySelector('.dett').textContent = TIPI[l.media.tipo] + ' · seconda anima';
  } else {
    itemM.querySelector('.nome').textContent = '—';
    itemM.querySelector('.dett').textContent = 'nessuna seconda anima';
    m.style.opacity = '0.15';
  }

  if (l.piccola) {
    p.style.transform = `rotate(${l.piccola.angolo}deg)`;
    p.style.opacity = '1';
    itemP.querySelector('.nome').textContent = l.piccola.nome;
    itemP.querySelector('.dett').textContent = 'luogo sacro · ' + l.piccola.provincia;
  }

  const nota = document.querySelector('#schermata-bussola .nota');
  if (nota) nota.textContent = `${totale} anime online a ${utente.provincia} · niente GPS · solo la bussola sa`;
}

function avviaSSE() {
  if (!utente) return;
  if (evtSource) evtSource.close();

  evtSource = new EventSource(`${API}/api/events?provincia=${encodeURIComponent(utente.provincia)}&id=${utente.id}`);

  evtSource.addEventListener('connesso', e => {
    console.log('SSE connesso:', JSON.parse(e.data));
  });

  evtSource.addEventListener('nuovo-utente', e => {
    const d = JSON.parse(e.data);
    console.log('Nuovo utente:', d);
    caricaLancette();
  });

  evtSource.onerror = () => {
    console.log('SSE disconnesso, riconnetto...');
  };
}
