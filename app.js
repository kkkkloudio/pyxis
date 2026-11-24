// Pyxis — Frontend V8.8: la bussola sveglia — l\'ago che indica davvero.
// V8.33 — LA CARTA RISPONDE QUANDO LA CHIAMI: una volta ripiegata (da sola
// o al tocco), il pellegrino non rivedeva più il sentiero. Mai più: il
// bottone "la carta del pellegrino" la srotola di nuovo quando vuole,
// col sentiero RICALCOLATO da dove si trova ora (rotta vera sul telefono,
// pietra angolare intatta). La carta richiamata NON si ripiega da sola:
// si torna alla bussola toccandola, o toccando il bottone che nel
// frattempo dice "torna alla bussola". (Idea di Carlo, primo giorno
// in esterna, 24/11.)
// V8.34 — LA PORTA SI TROVA DA SOLA: allo scrigno non serve più scorrere le
// 107 porte. Le sagome delle province (stivale.js) vivono dentro il telefono:
// il bottone "la bussola trova la porta" legge il GPS QUI, confronta il punto
// con le sagome QUI, e la porta trovata viene solo PRESENTATA nella lista:
// l'utente conferma o cambia, esattamente come prima. Pietra angolare intatta:
// la posizione non esce dal telefono, al server parte solo la porta dichiarata.
// (Idea di Carlo, 24/11 sera: se la bussola sa indicare il luogo, sa anche
// dire in quale provincia ti trovi.)
// V8.35 — PAROLA SEMPLICE: Carlo ha ragione: "segui il granato" per strada
// è arabico per chi entra la prima volta, e nessuno spiega cosa sia. Via
// dai testi operativi: si dice "lancetta grande", come la legenda. Il granato
// resta UNA volta sola, e spiegato: è la gemma rossa della lancetta grande,
// e lo dice la guida al secondo passo, dove c'è il contesto per capirlo.
// (E si aggiustano due "titulo" inglesi rimasti orfani.)
// V8.36 — SOLO LA LANCETTA: Carlo ha chiuso la partita ("ti ho detto di
// scrivere solo \"segui la lancetta\""): il "grande" non serve a nessuno,
// la lancetta è una sola per chi cammina. Via dai testi operativi IT e EN
// (sveglia, distanza, avviso lontano, collezione vuota) e dalla guida, dove
// la gemma è della lancetta, punto. (24/11 notte, terzo giro di parola.)

// (V6: molle e attrito) — gli aghi cercano, sforano, si assestano, tremano.
// (grande=POI, media=prima anima, piccola=seconda)
// V8.8: sul telefono con i sensori, l\'ago grande punta il luogo NEL MONDO REALE:
// tieni lo schermo davanti e girati — quando l\'ago entra nella PORTA (il triangolo
// d\'ottone in alto) stai guardando nella direzione del luogo da visitare.
// Tocca un ago (o la sua riga in legenda) e lui si presenta; gli altri si abbassano.
// PIETRA ANGOLARE: mai trattenere, salvare o trasmettere la posizione dell\'utente.
// GPS e bussola interna si legano SOLO sul telefono: la rotta vera verso il luogo
// si calcola qui e non parte mai. Al server arrivano solo { utente_id, poi_id }.
// V8.10: le porte d\'Italia — tutte le 107 province all\'iscrizione (aggiunta
// la Sud Sardegna, che mancava).
// V8.12: la rotta del pellegrino — per chi cammina davvero verso il luogo:
// declinazione magnetica corretta (il nord dei sensori non è il nord vero),
// GPS ad alta precisione, direzione di marcia se il magnetometro tace,
// e la distanza che manca — calcolata e mostrata SOLO sul telefono.
// V8.13: LA PIAZZA — le voci di tutte le anime: un pensiero lasciato nel cerchio,
// visibile a chiunque entri. Niente posizioni: solo nome, testo, tempo.
// V8.14: FEEDBACK — parola ai costruttori: se qualcosa non torna, il corvo
// lo porta a Carlo e Hermes (tabella feedback, la leggono dal DB).
// V8.15: LA GUIDA — i primi passi: si apre da sola alla prima visita, si
// riapre col bottone ❔. Cinque passi e l\'anima sa camminare.
// V8.17: LE LINGUE — 🇮🇹 IT / 🇬🇧 EN col bottone in fondo a destra: tutto il
// giro di vista si traduce; gli avvisi (alert) restano in italiano per ora.
// V8.19: LA BUSSOLA SI PRESENTA — l\'ago che sogna lo dice ad alta voce (caption)
// e il bottone sveglia chiama davvero: chi entra deve capire COSA manca per
// puntare davvero. E la guida torna ad avanzare un passo alla volta.
// V8.21 — IL CUSTODE DEL LUOGO: i luoghi profondi accolgono con la voce del
// loro spirito, che narra la leggenda in prima persona. Secondo giro della
// stessa sera: il custode è RICONTATTABILE. Parla a ogni check-in (anche a
// chi è già passato), con un racconto diverso ogni volta, e dalla modale si
// può chiedere ancora alla fiammella quante volte si vuole.
// V8.24 — IL CORVO DI PYXIS: il corvo non è più solo un\'emoji che parte: è
// un abitante. Cammina lungo il bordo della notte, becca, saltella, ogni
// tanto traversa in volo — e quando le lettere partono è lui a portarle via
// dallo schermo. Toccagli e ti risponde a modo suo. Chi ha chiesto meno
// movimento al telefono lo trova appollaiato e in silenzio (ma parla).
// Il suo nome è Muninn, memoria di Odino — quello che Odino temeva perdesse
// la strada: per questo ciò che il nostro porta non si perde mai, e torna
// sempre alla fine di ogni viaggio.
// V8.28 — LA CARTA DEL PELLEGRINO: cinque secondi dopo la sveglia, gli aghi
// lasciano il quadrante a una vecchia carta disegnata che mostra il sentiero
// fino alla stella del luogo. Dieci secondi di carta, poi la notte riprende
// gli aghi. La rotta resta quella VERA calcolata sul telefono: la carta è
// solo il modo antico di raccontarla. (Idea di Carlo, 24/11.)

const PROVINCE = [
  "Agrigento","Alessandria","Ancona","Aosta","Arezzo","Ascoli Piceno","Asti","Avellino",
  "Bari","Barletta-Andria-Trani","Belluno","Benevento","Bergamo","Biella","Bologna","Bolzano",
  "Brescia","Brindisi","Cagliari","Caltanissetta","Campobasso","Caserta","Catania","Catanzaro",
  "Chieti","Como","Cosenza","Cremona","Crotone","Cuneo","Enna","Fermo","Ferrara","Firenze",
  "Foggia","Forlì-Cesena","Frosinone","Genova","Gorizia","Grosseto","Imperia","Isernia",
  "L\'Aquila","La Spezia","Latina","Lecce","Lecco","Livorno","Lodi","Lucca","Macerata",
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

// ===== LE LINGUE (V8.17): il cerchio si apre oltre i confini =====
const LINGUA = { corrente: localStorage.getItem('pyxis-lingua') || 'it' };
const TESTI = {
  it: {
    subBussola: "la bussola delle presenze",
    entraScrigno: "Entra nello scrigno",
    nomeArte: "Nome d\'arte",
    provincia: "Provincia",
    scegli: "— scegli —",
    apriBussola: "Apri la bussola",
    parolaPietre: "La parola d\'accesso · la sequenza degli elementi",
    parolaPietreSub: "quattro pietre, un elemento ciascuna: tocca ogni pietra e scegli terra, aria, fuoco o acqua. Le pietre, in quest\'ordine, sono la tua parola: la componi la prima volta, la ricomponi uguale per rientrare",
    subDueCose: "tre cose bastano, poi la bussola gira",
    privacyIscrizione: "nessuna via da scegliere · nessun nome vero · nessuna email · la posizione non lascia mai il telefono",
    legendaTitolo: "Le tre lancette",
    dettGrande: "luogo di potere più vicino",
    dettMedia: "anima più vicina",
    dettPiccola: "seconda anima",
    visita: "✨ Il luogo è raggiunto",
    collezione: "la collezione — le stelle raccolte",
    piazza: "la piazza — le voci di tutte le anime",
    feedback: "🗝️ parola ai costruttori",
    guida: "❔ i primi passi",
    uscita: "lascia lo scrigno",
    sveglia: "🧭 Sveglia l\'ago — la bussola vera",
    svegliaViva: "🧭 l\'ago è sveglio — gira finché la lancetta entra nella porta, poi cammina",
    captionTocca: "tocca un ago per sapere chi punta",
    captionSveglia: "bussola sveglia: gli aghi puntano davvero — tocca un ago per sapere chi è",
    captionSogna: "l\'ago sta sognando il luogo — sveglialo con 🧭 qui sotto, e punterà davvero",
    cartaVai: "la carta del pellegrino: segui il sentiero fino alla stella · toccala per ripiegarla",
    cartaTorna: "📜 la carta del pellegrino — il sentiero da dove sei ora",
    cartaRipiega: "🧭 torna alla bussola",
    trovaPorta: "🧭 la bussola trova la porta",
    portaTrovata: "sussurra la bussola: {p} — conferma la porta, o cambiala",
    portaMuta: "la bussola non sente il cielo: scegli la porta a mano",
    tempoPasseggiata: "una passeggiata",
    tempoCammino: "un bel cammino",
    tempoPellegrinaggio: "pellegrinaggio: gran camminata",
    minCammino: " min",
    hCammino: " h",
    kmCorto: " km",
    mCorto: " m",
    dettoGrande: "il luogo di potere",
    dettoMedia: "l\'anima più vicina",
    dettoPiccola: "la seconda anima",
    portaCaption: " — girati finché l\'ago entra nella porta",
    cerchio: "sei nel cerchio del luogo — la stella può posarsi",
    kmLuogo: " km al luogo · segui la lancetta",
    mLuogo: " m al luogo · segui la lancetta",
    notaAscolto: " anime in ascolto · la posizione resta sul telefono · solo la bussola sa",
    guidaTitolo: "I primi passi",
    guidaSub: "come si cammina in questo mondo",
    avanti: "Avanti",
    entraCerchio: "Entra nel cerchio",
    saltaGuida: "Salta la guida",
    rimettiPenna: "Rimetti la penna",
    chiudi: "Chiudi",
    lasciaVoce: "📣 Lascia la voce",
    collezioneTitolo: "La collezione",
    collezioneSub: "le stelle raccolte sui luoghi di potere",
    piazzaTitolo: "La piazza",
    piazzaSub: "le voci lasciate da tutte le anime",
    feedbackTitolo: "Parola ai costruttori",
    feedbackSub: "cosa non torna, cosa sogni — il corvo lo porta a chi ha fatto la bussola",
    placeholderPiazza: "Lascia un pensiero nel cerchio…",
    placeholderFeedback: "Scrivi al di là del gioco…",
    corvoFrase1: "cra.",
    corvoFrase2: "le lettere viaggiano di notte.",
    corvoFrase3: "io porto le parole. le stelle le portate voi.",
    corvoFrase4: "mi chiamo Muninn. ciò che porto non si perde mai."
  },
  en: {
    subBussola: "the compass of presences",
    entraScrigno: "Enter the casket",
    nomeArte: "Artist name",
    provincia: "Province",
    scegli: "— choose —",
    apriBussola: "Open the compass",
    parolaPietre: "The word of entry · the sequence of elements",
    parolaPietreSub: "four stones, one element each: tap every stone and pick earth, air, fire or water. The stones, in that order, are your word: compose it the first time, recompose it the same to come back",
    subDueCose: "three things are enough, then the compass turns",
    privacyIscrizione: "no road to choose · no real name · no email · the position never leaves your phone",
    legendaTitolo: "The three needles",
    dettGrande: "nearest place of power",
    dettMedia: "nearest soul",
    dettPiccola: "second soul",
    visita: "✨ The place is reached",
    collezione: "the collection — stars gathered",
    piazza: "the square — voices of all souls",
    feedback: "🗝️ word to the makers",
    guida: "❔ first steps",
    uscita: "leave the casket",
    sveglia: "🧭 Wake the needle — the true compass",
    svegliaViva: "🧭 the needle is awake — turn until the needle enters the door, then walk",
    captionTocca: "tap a needle to know who it points at",
    captionSveglia: "compass awake: the needles truly point — tap one to know who it is",
    captionSogna: "the needle is dreaming of the place — wake it with 🧭 below, and it will truly point",
    cartaVai: "the pilgrim chart: follow the trail to the star · tap it to fold it away",
    cartaTorna: "📜 the pilgrim chart — the trail from where you stand now",
    cartaRipiega: "🧭 back to the compass",
    trovaPorta: "🧭 let the compass find the gate",
    portaTrovata: "the compass whispers: {p} — confirm the gate, or change it",
    portaMuta: "the compass cannot hear the sky: pick the gate by hand",
    tempoPasseggiata: "a stroll",
    tempoCammino: "a fair walk",
    tempoPellegrinaggio: "a pilgrimage: a grand walk",
    minCammino: " min",
    hCammino: " h",
    kmCorto: " km",
    mCorto: " m",
    dettoGrande: "the place of power",
    dettoMedia: "the nearest soul",
    dettoPiccola: "the second soul",
    portaCaption: " — turn until the needle enters the door",
    cerchio: "you are inside the place\'s circle — the star can settle",
    kmLuogo: " km to the place · follow the needle",
    mLuogo: " m to the place · follow the needle",
    notaAscolto: " souls listening · the position stays on the phone · only the compass knows",
    guidaTitolo: "First steps",
    guidaSub: "how to walk in this world",
    avanti: "Next",
    entraCerchio: "Enter the circle",
    saltaGuida: "Skip the guide",
    rimettiPenna: "Put the pen back",
    chiudi: "Close",
    lasciaVoce: "📣 Leave a voice",
    collezioneTitolo: "The collection",
    collezioneSub: "the stars gathered at places of power",
    piazzaTitolo: "The square",
    piazzaSub: "voices left by all souls",
    feedbackTitolo: "Word to the makers",
    feedbackSub: "what is off, what you dream — the raven carries it to those who made the compass",
    placeholderPiazza: "Leave a thought in the circle…",
    placeholderFeedback: "Write from beyond the game…",
    corvoFrase1: "cra.",
    corvoFrase2: "letters travel by night.",
    corvoFrase3: "i carry the words. the stars are yours to gather.",
    corvoFrase4: "my name is Muninn — what i carry is never lost."
  }
};

function t(k) { return (TESTI[LINGUA.corrente] || TESTI.it)[k] || TESTI.it[k]; }

function applicaLingua() {
  const set = (sel, k) => { const el = document.querySelector(sel); if (el) el.textContent = t(k); };
  const setId = (id, k) => { const el = document.getElementById(id); if (el) el.textContent = t(k); };
  const setPh = (id, k) => { const el = document.getElementById(id); if (el) el.placeholder = t(k); };
  document.documentElement.lang = LINGUA.corrente;

  // iscrizione
  set('#schermata-iscrizione .sottotitolo', 'subBussola');
  set('#schermata-iscrizione .iscrizione-box h3', 'entraScrigno');
  set('#schermata-iscrizione .sub', 'subDueCose');
  set('label[for="nome"]', 'nomeArte');
  set('label[for="provincia"]', 'provincia');
  set('#password-label', 'parolaPietre');
  set('#password-sub', 'parolaPietreSub');
  const opt = document.querySelector('#provincia option[value=""]');
  if (opt) opt.textContent = t('scegli');
  setId('btn-inizia', 'apriBussola');
  set('.privacy', 'privacyIscrizione');

  // legenda
  set('.legenda-titolo', 'legendaTitolo');
  set('.legenda-item[data-tipo="grande"] .dett', 'dettGrande');
  set('.legenda-item[data-tipo="media"] .dett', 'dettMedia');
  set('.legenda-item[data-tipo="piccola"] .dett', 'dettPiccola');

  // bottoni
  const sveglia = document.getElementById('btn-sveglia');
  if (sveglia && !BVERA.attiva) sveglia.textContent = t('sveglia');
  setId('btn-visita', 'visita');
  setId('btn-collezione', 'collezione');
  setId('btn-piazza', 'piazza');
  setId('btn-feedback', 'feedback');
  setId('btn-guida', 'guida');
  setId('btn-uscita', 'uscita');

  // modali
  const modale = (id, tk, sk) => {
    const box = document.querySelector('#' + id + ' .modale-box');
    if (!box) return;
    const h3 = box.querySelector('h3'); if (h3 && tk) h3.textContent = t(tk);
    const s = box.querySelector('.sub'); if (s && sk) s.textContent = t(sk);
  };
  modale('modale-collezione', 'collezioneTitolo', 'collezioneSub');
  modale('modale-piazza', 'piazzaTitolo', 'piazzaSub');
  modale('modale-feedback', 'feedbackTitolo', 'feedbackSub');
  modale('modale-guida', 'guidaTitolo', 'guidaSub');
  setId('btn-affida', 'affida');
  setId('btn-carta', CARTA.srotolata ? 'cartaRipiega' : 'cartaTorna'); // V8.33: la carta si chiama, e si congeda
  setId('btn-trova', 'trovaPorta'); // V8.34: la porta si trova da sola
  if (typeof ultimaPortaTrovata === 'string' && ultimaPortaTrovata) aggiornaSussurro('trovata', ultimaPortaTrovata);
  setId('btn-chiudi-posta', 'chiudi');
  setId('btn-chiudi-collezione', 'chiudi');
  setId('btn-voce', 'lasciaVoce');
  setId('btn-chiudi-piazza', 'chiudi');
  setId('btn-feedback-invia', 'affidaChiave');
  setId('btn-chiudi-feedback', 'rimettiPenna');
  setId('btn-chiudi-guida', 'saltaGuida');
  setPh('piazza-testo', 'placeholderPiazza');
  setPh('feedback-testo', 'placeholderFeedback');

  // il bottone lingua stesso
  const bl = document.getElementById('btn-lingua');
  if (bl) bl.textContent = LINGUA.corrente === 'en' ? '🇬🇧 EN' : '🇮🇹 IT';
}

function cambiaLingua() {
  LINGUA.corrente = LINGUA.corrente === 'en' ? 'it' : 'en';
  localStorage.setItem('pyxis-lingua', LINGUA.corrente);
  applicaLingua();
  aggiornaCaption();
  if (BVERA.attiva) {
    const btn = document.getElementById('btn-sveglia');
    if (btn) btn.textContent = t('svegliaViva');
  }
}

let utente = JSON.parse(localStorage.getItem('pyxis-utente') || 'null');
let evtSource = null;
let destinatario = null;   // l\'anima più vicina (lancetta media): { id, nome }
let poiCorrente = null;     // il luogo di potere (lancetta grande): { id, nome, lat, lon }

document.addEventListener('DOMContentLoaded', function () {

  applicaLingua(); // V8.17: la lingua scelta veste la pagina prima di tutto
  const select = document.getElementById('provincia');
  PROVINCE.forEach(p => {
    const o = document.createElement('option');
    o.value = p; o.textContent = p;
    select.appendChild(o);
  });

// ===== LE PIETRE DI ACCESSO =====
// La parola d'accesso è una sequenza di elementi: quattro pietre, un elemento
// ciascuna (terra, aria, fuoco, acqua, come i cardinali del quadrante).
// Ogni anima compone la sua formula e la ricompone per rientrare. Al server
// parte la solita stringa (es. "terra-fuoco-fuoco-acqua"): pietra angolare
// intatta, mai posizioni.
const ELEMENTI = ['terra', 'aria', 'fuoco', 'acqua'];
// V8.29 — il sistema dei quattro colori: ogni elemento veste la sua tinta,
// sulla pietra e nella sequenza letta sotto (toni scuri: si legge sulla pergamena).
const COLORI_ELEMENTO = { terra:'#7a5a24', aria:'#2c5078', fuoco:'#a83c1c', acqua:'#1a6a4e' };
// V8.27: i simboli alchemici classici degli elementi. I triangoli che
// l'alchimia ha sempre usato: fuoco punta in alto, acqua in basso, aria e
// terra portano la linea che li distingue (aria in alto, terra in basso).
// V8.29: le pietre ora VESTONO il colore del loro elemento (CSS in index.html),
// quindi i glifi si incidono a inchiostro scuro, come su una gemma vera.
const GLIFI = {
  terra: '<svg viewBox="0 0 32 32" width="26" height="26" fill="none" stroke="#3a2c10" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7.5 24 L16 10 L24.5 24 Z"/><path d="M12 19.5 L20 19.5"/></svg>',
  aria: '<svg viewBox="0 0 32 32" width="26" height="26" fill="none" stroke="#1c3050" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7.5 10 L16 24 L24.5 10 Z"/><path d="M12 15.5 L20 15.5"/></svg>',
  fuoco: '<svg viewBox="0 0 32 32" width="26" height="26" fill="none" stroke="#4a1408" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7.5 24 L16 10 L24.5 24 Z"/></svg>',
  acqua: '<svg viewBox="0 0 32 32" width="26" height="26" fill="none" stroke="#0e3a2c" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7.5 10 L16 24 L24.5 10 Z"/></svg>',
  vuota: '<svg viewBox="0 0 32 32" width="14" height="14" fill="none" stroke="rgba(26,17,8,.8)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 9.5 C16.9 13 18 14.1 21.5 15 C18 15.9 16.9 17 16 20.5 C15.1 17 14 15.9 10.5 15 C14 14.1 15.1 13 16 9.5 Z"/></svg>'
};
let sequenzaAccesso = [null, null, null, null];

function aggiornaPietre() {
  document.querySelectorAll('.pietra-scrigno').forEach(btn => {
    const i = Number(btn.getAttribute('data-slot'));
    const el = sequenzaAccesso[i];
    btn.innerHTML = el ? GLIFI[el] : GLIFI.vuota;
    const posizione = ['prima', 'seconda', 'terza', 'quarta'][i] || 'pietra';
    btn.setAttribute('aria-label', el ? (posizione + ' pietra: ' + el) : (posizione + ' pietra, non ancora scelta'));
    if (el) btn.setAttribute('data-elemento', el); else btn.removeAttribute('data-elemento');
  });
  const letta = document.getElementById('sequenza-letta');
  if (letta) letta.innerHTML = sequenzaAccesso.every(el => el)
    ? sequenzaAccesso.map(el => '<span style="color:' + COLORI_ELEMENTO[el] + '">' + el + '</span>').join(' · ')
    : '· · · ·';
}

document.querySelectorAll('.pietra-scrigno').forEach(btn => {
  btn.addEventListener('click', () => {
    const i = Number(btn.getAttribute('data-slot'));
    const attuale = sequenzaAccesso[i];
    sequenzaAccesso[i] = ELEMENTI[(attuale ? ELEMENTI.indexOf(attuale) + 1 : 0) % 4];
    aggiornaPietre();
  });
});
aggiornaPietre();

  document.getElementById('btn-inizia').addEventListener('click', async function () {
    const nome = document.getElementById('nome').value.trim();
    const provincia = document.getElementById('provincia').value;

    if (!nome) return alert("Scegli un nome d'arte");
    if (!provincia) return alert('Scegli la provincia');
    if (sequenzaAccesso.some(el => !el)) return alert('La parola non è completa: tocca le quattro pietre, un elemento per ciascuna. La ricomporrai uguale per rientrare');
    const password = sequenzaAccesso.join('-');

    try {
      const resp = await fetch(API + '/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, provincia, password })
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

  // ===== V8.8 — tocca l\'ago per sapere chi punta =====
  document.querySelectorAll('.lancetta').forEach(l => {
    l.addEventListener('click', () => selezionaAgo(l.dataset.tipo));
  });
  document.querySelectorAll('.legenda-item').forEach(item => {
    item.addEventListener('click', () => selezionaAgo(item.dataset.tipo));
  });
  const btnSveglia = document.getElementById('btn-sveglia');
  if (btnSveglia) btnSveglia.addEventListener('click', svegliaAgo);
  const btnCarta = document.getElementById('btn-carta'); // V8.33: la carta risponde quando la chiami
  if (btnCarta) btnCarta.addEventListener('click', chiamaCarta);
  const btnTrova = document.getElementById('btn-trova'); // V8.34: la porta si trova da sola
  if (btnTrova) {
    if (!navigator.geolocation) btnTrova.hidden = true; // senza cielo, niente richiamo
    else btnTrova.addEventListener('click', localizzami);
  }

  // ===== il corvo =====

  // ===== il check-in e la collezione =====
  document.getElementById('btn-visita').addEventListener('click', checkIn);
  document.getElementById('btn-collezione').addEventListener('click', apriCollezione);
  document.getElementById('btn-chiudi-collezione').addEventListener('click', () => chiudiModale('modale-collezione'));
  document.getElementById('btn-piazza').addEventListener('click', apriPiazza);
  document.getElementById('btn-voce').addEventListener('click', inviaVoce);
  document.getElementById('btn-chiudi-piazza').addEventListener('click', () => chiudiModale('modale-piazza'));
  document.getElementById('btn-feedback').addEventListener('click', apriFeedback);
  document.getElementById('btn-feedback-invia').addEventListener('click', inviaFeedback);
  document.getElementById('btn-chiudi-feedback').addEventListener('click', () => chiudiModale('modale-feedback'));
  document.getElementById('btn-guida').addEventListener('click', apriGuida);
  document.getElementById('btn-guida-avanti').addEventListener('click', avantiGuida);
  document.getElementById('btn-chiudi-guida').addEventListener('click', () => {
    localStorage.setItem('pyxis-guida', 'vista');
    chiudiModale('modale-guida');
  });
  document.getElementById('btn-lingua').addEventListener('click', cambiaLingua);
  // V8.21 — il custode congeda l\'anima quando la parola è ricevuta
  document.getElementById('btn-custode-via').addEventListener('click', () => chiudiModale('modale-custode'));
});

function mostraBussola() {
  document.getElementById('schermata-iscrizione').classList.remove('attiva');
  document.getElementById('schermata-bussola').classList.add('attiva');
  document.getElementById('sottotitolo-utente').textContent =
    utente.nome + ' · ' + utente.provincia;
  avviaBussolaViva(); // gli aghi prendono vita appena lo scrigno si apre
  avviaCorvo();        // V8.24: e il corvo prende a passeggiare lungo la notte
  if (!localStorage.getItem('pyxis-guida')) apriGuida(); // V8.15: la prima volta, l\'anima viene accompagnata
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
  const btnVisita = document.getElementById('btn-visita');

  INFO_AGO.grande = null; INFO_AGO.media = null; INFO_AGO.piccola = null;

  // GRANDE: il luogo di potere (POI)
  if (l.grande) {
    // Bussola sveglia e posizione nota (SOLO sul telefono): la rotta è VERA,
    // da te al luogo. Altrimenti resta la rotta dal capoluogo, l\'approssimazione del server.
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
    if (BVERA.pos && l.grande.lat != null && l.grande.lon != null) {
      aggiornaDistanza(distanzaMetri(BVERA.pos.lat, BVERA.pos.lon, l.grande.lat, l.grande.lon));
    }
    if (btnVisita) btnVisita.disabled = false;
  } else {
    // Nessun luogo di potere puntato: niente stella da raccogliere
    itemG.style.display = 'none';
    poiCorrente = null;
    spegniLancetta('grande'); // l\'ago torna a cercare, e non trova
    const dlLuogo = document.getElementById('distanza-luogo');
    if (dlLuogo) dlLuogo.textContent = '';
    if (btnVisita) btnVisita.disabled = true;
  }

  // MEDIA: l\'anima più vicina (destinataria del corvo)
  if (l.media) {
    puntaLancetta('media', l.media.angolo);
    itemM.style.display = 'none';
    itemM.querySelector('.nome').textContent = l.media.nome;
    itemM.querySelector('.dett').textContent = 'anima più vicina';
    destinatario = { id: l.media.id, nome: l.media.nome };
    INFO_AGO.media = { nome: l.media.nome };
  } else {
    // Nessuna anima vicina: lancetta spenta, corvo senza meta
    itemM.style.display = 'none';
    destinatario = null;
    spegniLancetta('media');
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
  aggiornaBottoneCarta(); // V8.33: la carta si chiama solo se c\'è una stella da seguire

  const nota = document.querySelector('#schermata-bussola .nota');
  if (nota) nota.textContent = totale + t('notaAscolto');
}

// ===== TOCCA L\'AGO (V8.8): chi stai puntando? =====
// Tocchi un ago (o la sua riga in legenda): lui si presenta nella didascalia,
// gli altri due si abbassano. Lo tocchi ancora e tutto torna com\'era.
const INFO_AGO = { grande:null, media:null, piccola:null };
let agoSelezionato = null;
const COLORI_AGO = { grande:'#d98a6a', media:'#7cc9a2', piccola:'#8ab0e0' };
const DETTI_AGO  = { grande:'il luogo di potere', media:'l\'anima più vicina', piccola:'la seconda anima' };

function selezionaAgo(tipo) {
  if (tipo === 'media' || tipo === 'piccola') return; // anime vicine: in futuro
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
    // V8.19: sul telefono l\'ago che sogna lo DICE — il bottone sveglia non si può mancare
    if (!BVERA.attiva && window.matchMedia && window.matchMedia('(pointer:coarse)').matches) {
      cap.style.color = '#e8cd85';
      cap.textContent = t('captionSogna');
      return;
    }
    cap.style.color = '';
    cap.textContent = BVERA.attiva ? t('captionSveglia') : t('captionTocca');
    return;
  }
  cap.style.color = COLORI_AGO[agoSelezionato];
  const info = INFO_AGO[agoSelezionato];
  if (!info) {
    cap.textContent = '→ quest\'ago sta ancora cercando: non punta nessuno, per ora';
    return;
  }
  let testo = '→ ' + info.nome + ' · ' + t(DETTI_AGO[agoSelezionato]);
  if (agoSelezionato === 'grande' && BVERA.attiva) testo += t('portaCaption');
  cap.textContent = testo;
}

// ===== LA BUSSOLA VIVA: molle e attrito =====
// Un ago magnetico vero non sta mai fermo: cerca, sfora il bersaglio, torna,
// si assesta, e da fermo trema appena, come in ascolto. Qui non c\'è nessuna
// posizione dell\'utente: solo gli angoli che manda il server, vestiti di fisica.

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
      bersaglio: null,          // null: l\'ago cerca e non trova
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
  // il nord che vale: l\'ago magnetico corretto se c\'è, altrimenti dove stai camminando
  const nord = BVERA.heading != null ? BVERA.heading : BVERA.corso;
  const sveglia = BVERA.attiva && nord != null && A.bersaglio != null;
  if (sveglia) {
    // BUSSOLA SVEGLIA: angolo nel mondo meno dove sei rivolto tu = dove sta l\'ago
    // sul quadrante. Strada più corta: mai il giro completo quando passi da 359 a 0.
    bers = A.bersaglio - nord;
    while (bers - A.angolo > 180) bers -= 360;
    while (bers - A.angolo < -180) bers += 360;
  }
  if (bers == null) {
    // nessun segnale: l\'ago vaga piano, quasi addormentato
    if (t >= A.prossimoGiro) {
      A.deriva = Math.random() * 360 - 180;
      A.prossimoGiro = t + 14000 + Math.random() * 12000;
    }
    molla(A, A.deriva, 1.0, 3.0, dt);
  } else {
    // ogni tanto l\'ago perde il filo di qualche grado, poi lo ritrova
    if (t >= A.prossimoFiloperduto) {
      A.perdeIlFilo = (Math.random() < 0.5 ? -1 : 1) * (5 + Math.random() * 7);
      A.prossimoFiloperduto = t + 25000 + Math.random() * 35000;
    }
    A.perdeIlFilo *= Math.exp(-dt / 3.5); // il filo si ritrova piano
    // l\'ago del luogo, quando la bussola è sveglia, NON perde mai il filo: deve essere vero
    const filo = (sveglia && A.tipo === 'grande') ? 0 : A.perdeIlFilo;
    molla(A, bers + filo, 7, 2.8, dt);
  }
  // il tremito: un respiro di un grado, mai fermo del tutto
  const tremito = Math.sin(t / 1000 * A.freq * Math.PI * 2 + A.fase) * A.tremore;
  A.el.style.transform = 'rotate(' + (A.angolo + tremito).toFixed(2) + 'deg)';
}

function molla(A, bersaglio, k, c, dt) {
  // la molla tira verso il bersaglio, l\'attrito rallenta: insieme fanno lo sforo
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
  // niente strattoni d\'arrivo: lo sweep elegante lo fa la molla da sola
}

function spegniLancetta(tipo) {
  const A = VIVA.aghi[tipo];
  if (!A) return;
  A.bersaglio = null; // niente segnale: si torna a cercare, e non trovare
}

// ===== LA BUSSOLA SVEGLIA (V8.8): l\'ago che indica davvero =====
// Il telefono ha una bussola magnetica e sa dove sei. ENTRAMBE le cose restano
// sul telefono: qui si calcola l\'angolo vero verso il luogo, e non parte mai
// niente. Al server arrivano sempre e solo i luoghi pubblici.
// La declinazione magnetica in Italia è di ~4 gradi EST (WMM2025, 2026): l\'ago
// del telefono punta il nord magnetico, ma il nord VERO è 4 gradi più a ovest.
// Senza correzione la rotta sbaglia di ~70 metri ogni chilometro camminato.
// Stima nazionale: tra una provincia e l\'altra varia meno di 1 grado (≈17 m/km),
// ben dentro il raggio del check-in. Da rifinire coi test sul campo.
const DECLINAZIONE = 4.0;

const BVERA = { attiva:false, heading:null, pos:null, corso:null };

function rottaVera(lat1, lon1, lat2, lon2) {
  const rad = x => x * Math.PI / 180;
  const y = Math.sin(rad(lon2 - lon1)) * Math.cos(rad(lat2));
  const x = Math.cos(rad(lat1)) * Math.sin(rad(lat2)) -
            Math.sin(rad(lat1)) * Math.cos(rad(lat2)) * Math.cos(rad(lon2 - lon1));
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

// V8.12: quanto manca al luogo — calcolato sul telefono, mostrato sul telefono.
// Chi segue l\'ago deve sapere se il passo giusto è "ancora un po'" o "sei arrivato".
function aggiornaDistanza(d) {
  const el = document.getElementById('distanza-luogo');
  if (!el) return;
  if (d <= RAGGIO_M) {
    el.textContent = t('cerchio');
    el.classList.add('vicino');
    return;
  }
  el.classList.remove('vicino');
  el.textContent = d >= 1000
    ? '≈ ' + (d / 1000).toFixed(1).replace('.', ',') + t('kmLuogo')
    : '≈ ' + (Math.round(d / 10) * 10) + t('mLuogo');
}

function leggiNord(e) {
  // Safari/vecchi iPhone: webkitCompassHeading è il nord MAGNETICO (senso orario).
  // Nord vero = magnetico + declinazione: V8.12, o chi cammina sbaglia rotta.
  if (typeof e.webkitCompassHeading === 'number' && !isNaN(e.webkitCompassHeading)) {
    BVERA.heading = (e.webkitCompassHeading + DECLINAZIONE) % 360;
    return;
  }
  // Android assoluto: alpha conta in senso antiorario — si rigira. Anche questi
  // sensori in pratica si allineano al nord magnetico: stessa correzione.
  if (e.absolute && e.alpha != null) BVERA.heading = (360 - e.alpha + DECLINAZIONE) % 360;
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
        // La posizione vive SOLO qui: serve all\'ago per la rotta vera, non parte mai.
        BVERA.pos = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        // Il passo del pellegrino: mentre CAMMINI, il GPS sa verso dove vai
        // (course, già dal nord vero). Se il magnetometro tace o lo disturbano
        // cover e metallo, la direzione di marcia fa da guida.
        if (typeof pos.coords.heading === 'number' && !isNaN(pos.coords.heading) &&
            (pos.coords.speed == null || pos.coords.speed > 0.7)) {
          BVERA.corso = pos.coords.heading;
        }
        if (poiCorrente && poiCorrente.lat != null && VIVA.aghi.grande) {
          puntaLancetta('grande', rottaVera(BVERA.pos.lat, BVERA.pos.lon, poiCorrente.lat, poiCorrente.lon));
          aggiornaDistanza(distanzaMetri(BVERA.pos.lat, BVERA.pos.lon, poiCorrente.lat, poiCorrente.lon));
        }
      }, function () {
        // niente GPS: l\'ago userà la rotta dal capoluogo, resta comunque una bussola
      }, { enableHighAccuracy: true, timeout: 20000, maximumAge: 3000 });
    }
    BVERA.attiva = true;
    btn.classList.add('viva');
    btn.textContent = t('svegliaViva');
    aggiornaCaption();
    avviaSequenzaCarta(); // V8.28: la carte attende il suo momento: 5 secondi di ago, poi il sentiero
  } catch (e) {
    alert('Questo scrigno non ha l\'ago magnetico: ' + e.message);
  }
}

// ===== V8.28 — LA CARTA DEL PELLEGRINO =====
// Cinque secondi dopo la sveglia, dal quadrante spariscono gli aghi e si
// srotola una vecchia carta: il sentiero che resta, fino alla stella del
// luogo. Dieci secondi, poi la carta si ripiega e la bussola torna viva.
// E solo disegno su pergamena: la rotta è quella VERA, calcolata sul
// telefono (pietra angolare intatta, non parte niente), ruotata come
// l'ago la punterebbe. Toccarla la ripiega prima del tempo.

const CARTA = { srotolata:false, t1:null, t2:null, td:null, angolo:0, raf:0 };

// V8.33 — il bottone che richiama la carta: visibile solo quando c\'è
// un luogo di potere da seguire. La pietra angolare non cambia: il bottone
// non invia niente, srotola solo la pergamena col sentiero già calcolato.
function aggiornaBottoneCarta() {
  const btn = document.getElementById('btn-carta');
  if (btn) btn.hidden = !poiCorrente;
}

// il richiamo del pellegrino: apre la carta richiamata (che resta aperta
// finché non è lui a congedarla), o la ripiega se era già srotolata
function chiamaCarta() {
  if (CARTA.srotolata) ripiegaCarta();
  else srotolaCarta(true);
}

// di quanto girare il sentiero: rotta vera meno dove sei rivolto tu
function angoloDelSentiero() {
  const A = VIVA.aghi.grande;
  let rotta = (A && A.bersaglio != null) ? A.bersaglio : null;
  if (rotta == null && BVERA.pos && poiCorrente && poiCorrente.lat != null) {
    rotta = rottaVera(BVERA.pos.lat, BVERA.pos.lon, poiCorrente.lat, poiCorrente.lon);
  }
  if (rotta == null) return null;
  const nord = BVERA.heading != null ? BVERA.heading : BVERA.corso;
  return nord == null ? rotta : ((rotta - nord + 720) % 360);
}

function avviaSequenzaCarta() {
  if (CARTA.t1) return; // una sola carta per sveglia
  CARTA.t1 = setTimeout(function () {
    CARTA.t1 = null;
    if (!BVERA.attiva || !poiCorrente) return; // niente stella, niente sentiero
    srotolaCarta();
  }, 5000);
}

function srotolaCarta(manuale) {
  const el = document.getElementById('carta-rotta');
  if (!el || CARTA.srotolata) return;
  const bers = angoloDelSentiero();
  CARTA.angolo = bers != null ? bers : 0;
  CARTA.srotolata = true;
  el.innerHTML = disegnaCarta();
  el.classList.add('srotolata');
  el.addEventListener('click', chiudiCartaAlTocco); // V8.28: il tocco dell'anima la ripiega quando vuole
  const wrap = document.querySelector('.bussola-wrap');
  if (wrap) wrap.classList.add('modo-carta');
  const cap = document.getElementById('caption-bussola');
  if (cap) cap.textContent = t('cartaVai');
  aggiornaDistanzaCarta();
  CARTA.td = setInterval(aggiornaDistanzaCarta, 1000);
  // V8.33: la carta RICHIAMATA resta aperta finché il pellegrino non la
  // congeda lui — il sentiero lo segue mentre cammina. Solo quella che
  // arriva da sola dopo la sveglia si richiude dopo dieci secondi.
  if (!manuale) CARTA.t2 = setTimeout(ripiegaCarta, 10000);
  const btn = document.getElementById('btn-carta');
  if (btn) btn.textContent = t('cartaRipiega');
  if (!VIVA.ferma) CARTA.raf = requestAnimationFrame(respiraCarta);
}

// la carta respira col mondo: se ti giri, il sentiero ti segue
function respiraCarta() {
  if (!CARTA.srotolata) return;
  const bers = angoloDelSentiero();
  if (bers != null) {
    let d = ((bers - CARTA.angolo + 540) % 360) - 180;
    CARTA.angolo += d * 0.22;
    const filo = document.getElementById('carta-filo');
    if (filo) filo.setAttribute('transform', 'rotate(' + CARTA.angolo.toFixed(2) + ' 150 150)');
  }
  CARTA.raf = requestAnimationFrame(respiraCarta);
}

function aggiornaDistanzaCarta() {
  // la carta dice TRE cose: la distanza che resta (sul cartiglio E lungo il
  // sentiero, come le vecchie mappe scrivevano i migli sopra le strade), il
  // tempo del passo (4,5 km all'ora: il passo onesto del pellegrino), e la
  // sentenza che dice se e' una cosa da fare a piedi o gran camminata.
  const cart = document.getElementById('carta-distanza');
  const via = document.getElementById('carta-distanza-via');
  const sent = document.getElementById('carta-sentenza');
  if (!cart || !poiCorrente) return;
  let testo = '', viaT = '', sentenza = '';
  if (BVERA.pos && poiCorrente.lat != null) {
    const d = distanzaMetri(BVERA.pos.lat, BVERA.pos.lon, poiCorrente.lat, poiCorrente.lon);
    if (d <= RAGGIO_M) {
      testo = t('cerchio');
      sentenza = t('tempoPasseggiata');
    } else {
      const chilometri = d >= 1000;
      const distStr = chilometri
        ? '\u2248 ' + (d / 1000).toFixed(1).replace('.', ',') + t('kmLuogo')
        : '\u2248 ' + (Math.round(d / 10) * 10) + t('mLuogo');
      viaT = chilometri
        ? '\u2248 ' + (d / 1000).toFixed(d >= 10000 ? 0 : 1).replace('.', ',') + t('kmCorto')
        : '\u2248 ' + (Math.round(d / 10) * 10) + t('mCorto');
      const min = d / 75; // 4,5 km/h: il passo onesto di chi va a piedi
      let tempo;
      if (min < 60) tempo = '~' + (Math.round(min / 5) * 5) + t('minCammino');
      else {
        const h = Math.floor(min / 60);
        const m = Math.round((min - h * 60) / 5) * 5;
        tempo = '~' + h + t('hCammino') + (m ? ' ' + m + t('minCammino') : '');
      }
      sentenza = d <= 1500 ? t('tempoPasseggiata')
        : (d <= 5000 ? t('tempoCammino') : t('tempoPellegrinaggio'));
      testo = distStr + ' \u00b7 ' + tempo;
    }
  }
  cart.textContent = testo;
  if (via) via.textContent = viaT;
  if (sent) sent.textContent = sentenza;
}

function ripiegaCarta() {
  if (!CARTA.srotolata) return;
  CARTA.srotolata = false;
  clearTimeout(CARTA.t2); CARTA.t2 = null;
  clearInterval(CARTA.td); CARTA.td = null;
  cancelAnimationFrame(CARTA.raf); CARTA.raf = 0;
  const el = document.getElementById('carta-rotta');
  if (el) {
    el.classList.remove('srotolata');
    el.removeEventListener('click', chiudiCartaAlTocco);
  }
  const wrap = document.querySelector('.bussola-wrap');
  if (wrap) wrap.classList.remove('modo-carta');
  const btn = document.getElementById('btn-carta');
  if (btn) btn.textContent = t('cartaTorna'); // V8.33: il bottone torna a chiamare la carta
  aggiornaCaption(); // la bussola torna a dire le sue cose
}

// il tocco dell'anima congeda la carta quando vuole
function chiudiCartaAlTocco() {
  const el = document.getElementById('carta-rotta');
  if (el) el.removeEventListener('click', chiudiCartaAlTocco);
  ripiegaCarta();
}

// ===== V8.34 — LA PORTA SI TROVA DA SOLA =====
// Le sagome delle 107 province (stivale.js) sono dentro il telefono. Il GPS
// si legge QUI, il punto viene confrontato con le sagome QUI: della posizione
// non resta niente e non parte niente. Trovare la porta non è dichiararla:
// il nome viene solo presentato nella lista, l'utente conferma come sempre.
function dentroSagoma(flat, lat, lon) {
  let dentro = false;
  for (let i = 0; i + 3 < flat.length; i += 2) {
    const x1 = flat[i], y1 = flat[i + 1], x2 = flat[i + 2], y2 = flat[i + 3];
    if ((y1 > lat) !== (y2 > lat)) {
      const incrocia = x1 + (lat - y1) * (x2 - x1) / (y2 - y1);
      if (lon < incrocia) dentro = !dentro;
    }
  }
  return dentro;
}

function trovaProvincia(lat, lon) {
  if (typeof STIVALE === 'undefined' || !STIVALE) return null;
  for (const nome in STIVALE) {
    const sagome = STIVALE[nome], b = sagome[0];
    if (lon < b[0] || lon > b[2] || lat < b[1] || lat > b[3]) continue;
    for (let i = 1; i < sagome.length; i++) {
      if (dentroSagoma(sagome[i], lat, lon)) return nome;
    }
  }
  return null;
}

// l'unica cosa che ricorda il ritrovamento è il NOME della porta: mai coordinate
let ultimaPortaTrovata = null;

function aggiornaSussurro(stato, porta) {
  const s = document.getElementById('porta-sussurro');
  if (!s) return;
  if (stato === 'trovata') s.textContent = t('portaTrovata').replace('{p}', porta);
  else if (stato === 'muta') s.textContent = t('portaMuta');
  else s.textContent = '';
}

function localizzami() {
  const btn = document.getElementById('btn-trova');
  if (!btn) return;
  if (!navigator.geolocation) { btn.hidden = true; return; }
  btn.disabled = true;
  aggiornaSussurro('', null); // si riparte col pulito mentre il cielo ascolta
  navigator.geolocation.getCurrentPosition(function (pos) {
    // la posizione VIVE in questa funzione e muore qui: pietra angolare
    const porta = trovaProvincia(pos.coords.latitude, pos.coords.longitude);
    btn.disabled = false;
    if (!porta) { aggiornaSussurro('muta', null); return; }
    const sel = document.getElementById('provincia');
    if (sel) sel.value = porta;   // presente, non imposta: chi vuole un'altra porta la scegli
    ultimaPortaTrovata = porta;
    aggiornaSussurro('trovata', porta);
  }, function () {
    // niente cielo o permesso negato: si torna alla mano, come sempre
    btn.disabled = false;
    aggiornaSussurro('muta', null);
  }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 });
}

// la pergamena: tutta incisione, niente foto. Il sentiero sta nel gruppo
// #carta-filo (parte dritto verso l'alto e ruota verso la rotta vera);
// nome e distanza restano fissi, ben leggibili nel cartiglio in basso.
function disegnaCarta() {
  let nome = poiCorrente ? String(poiCorrente.nome).replace(/</g, '&lt;').replace(/>/g, '&gt;') : '';
  if (nome.length > 26) nome = nome.slice(0, 25) + '…';
  const a0 = CARTA.angolo.toFixed(1);
  const INK = '#55341c';
  const INK2 = '#6b4a2a';
  return '<svg class="carta" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%">'
    + '<defs>'
    + '<clipPath id="carta-clip"><circle cx="150" cy="150" r="126.3"/></clipPath>'
    + '<radialGradient id="carta-perga" cx="46%" cy="38%" r="78%">'
    + '<stop offset="0" stop-color="#f4e7c2"/><stop offset=".62" stop-color="#e9d5a8"/><stop offset="1" stop-color="#cbaa74"/>'
    + '</radialGradient>'
    + '</defs>'
    + '<g clip-path="url(#carta-clip)">'
    + '<rect x="0" y="0" width="300" height="300" fill="url(#carta-perga)"/>'
    // il-grano della pergamena: lievi macchie del tempo
    + '<ellipse cx="96" cy="216" rx="66" ry="44" fill="#5a3c1a" opacity=".06"/>'
    + '<ellipse cx="218" cy="84" rx="50" ry="36" fill="#6b4a20" opacity=".07"/>'
    + '<ellipse cx="240" cy="218" rx="38" ry="28" fill="#4a3014" opacity=".05"/>'
    + '<circle cx="150" cy="150" r="121" fill="none" stroke="#8a6a44" stroke-width="1" opacity=".5"/>'
    + '<circle cx="150" cy="150" r="117.5" fill="none" stroke="#8a6a44" stroke-width=".7" stroke-dasharray="1.5 4" opacity=".45"/>'
    // onde da cartografia antica, in basso
    + '<path d="M40 268 q 8 -5 16 0 t 16 0 t 16 0" fill="none" stroke="' + INK2 + '" stroke-width="1" opacity=".3"/>'
    + '<path d="M176 282 q 8 -5 16 0 t 16 0 t 16 0" fill="none" stroke="' + INK2 + '" stroke-width="1" opacity=".25"/>'
    + '<path d="M210 44 q 7 -4 14 0 t 14 0" fill="none" stroke="' + INK2 + '" stroke-width="1" opacity=".3"/>'
    // il volto del vento, che soffia dal bordo
    + '<g transform="translate(78,76)" opacity=".5">'
    + '<circle r="11" fill="none" stroke="' + INK2 + '" stroke-width="1.2"/>'
    + '<circle cx="-3.5" cy="-2.5" r="1.3" fill="' + INK2 + '"/>'
    + '<circle cx="3.5" cy="-2.5" r="1.3" fill="' + INK2 + '"/>'
    + '<path d="M-3.5 4 C -1 6.2, 1 6.2, 3.5 4" fill="none" stroke="' + INK2 + '" stroke-width="1.1"/>'
    + '<path d="M13 2 C 18 1, 20 -4, 16 -7 C 19 -6, 21 -1, 18 3 C 17 6, 13 7, 10.5 5.5" fill="none" stroke="' + INK2 + '" stroke-width="1" opacity=".8"/>'
    + '</g>'
    // ===== IL FILO: il sentiero, disegnato verso l'alto, ruotato sulla rotta vera =====
    + '<g id="carta-filo" transform="rotate(' + a0 + ' 150 150)">'
    // impronte del pellegrino al centro
    + '<circle cx="150" cy="161" r="13" fill="none" stroke="' + INK2 + '" stroke-width=".8" stroke-dasharray="1.5 3.5" opacity=".5"/>'
    + '<g transform="translate(142.5,156) rotate(22)"><ellipse rx="3.2" ry="5.6" fill="none" stroke="' + INK + '" stroke-width="1.3"/></g>'
    + '<g transform="translate(157,163) rotate(-16)"><ellipse rx="3.2" ry="5.6" fill="none" stroke="' + INK + '" stroke-width="1.3"/></g>'
    // il sentiero punteggiato, come sulle carte dei viandti
    + '<path d="M150 164 C 122 142, 186 118, 160 96 C 140 80, 118 78, 126 63 C 131 53, 143 51, 150 46" fill="none" stroke="' + INK + '" stroke-width="2" stroke-linecap="round" stroke-dasharray="0.5 6" opacity=".9"/>'
    // e accanto al sentiero, inclinato come un appunto del cartografo: la distanza
    + '<text id="carta-distanza-via" transform="translate(183,121) rotate(-37)" font-family="IM Fell English, Georgia, serif" font-size="10.5" font-style="italic" fill="' + INK2 + '" opacity=".85"> </text>'
    // la stella del luogo
    + '<path d="M150 27 L152.8 36.5 L162 40 L152.8 43.5 L150 53 L147.2 43.5 L138 40 L147.2 36.5 Z" fill="#c9962f" stroke="' + INK + '" stroke-width="1"/>'
    + '<path d="M150 21 L150 26 M171 40 L164 40 M129 40 L136 40 M158 31 L161 25 M142 31 L139 25" stroke="#b8862b" stroke-width="1" opacity=".55"/>'
    // alberi in stile xilografia
    + '<g transform="translate(101,124)" opacity=".8">'
    + '<path d="M0 9 L0 0" stroke="' + INK2 + '" stroke-width="1.6"/>'
    + '<circle cx="-5" cy="-5" r="5.5" fill="#8a6a34" stroke="' + INK2 + '" stroke-width="1" opacity=".5"/>'
    + '<circle cx="3" cy="-8" r="6.5" fill="#8a6a34" stroke="' + INK2 + '" stroke-width="1" opacity=".5"/>'
    + '<circle cx="1" cy="-1" r="6" fill="#8a6a34" stroke="' + INK2 + '" stroke-width="1" opacity=".5"/>'
    + '</g>'
    + '<g transform="translate(199,142)" opacity=".7">'
    + '<path d="M0 8 L0 0" stroke="' + INK2 + '" stroke-width="1.4"/>'
    + '<circle cx="-4" cy="-4" r="4.5" fill="#8a6a34" stroke="' + INK2 + '" stroke-width=".9" opacity=".5"/>'
    + '<circle cx="3" cy="-6" r="5" fill="#8a6a34" stroke="' + INK2 + '" stroke-width=".9" opacity=".5"/>'
    + '</g>'
    // un sasso lungo la via
    + '<path d="M198 106 L202 97 L209 95 L215 100 L214 106 Z" fill="#7d5a30" stroke="' + INK2 + '" stroke-width=".8" opacity=".55"/>'
    // il fiume col ponticello
    + '<path d="M56 197 C 76 192, 96 202, 116 197 C 136 192, 156 202, 176 197 C 196 192, 216 202, 236 197" fill="none" stroke="#5d6b4a" stroke-width="1.3" opacity=".55"/>'
    + '<path d="M56 202 C 76 197, 96 207, 116 202 C 136 197, 156 207, 176 202 C 196 197, 216 207, 236 202" fill="none" stroke="#5d6b4a" stroke-width="1" opacity=".4"/>'
    + '<path d="M106 204 L110 194 M118 204 L114 194 M105 197 L119 197" stroke="' + INK2 + '" stroke-width="1.2" opacity=".7"/>'
    // il serpentello degli abissi
    + '<g transform="translate(214,232)" opacity=".5">'
    + '<path d="M-10 2 C -6 -6, 6 -7, 7 0 C 8 6, 0 8, -2 4" fill="none" stroke="' + INK2 + '" stroke-width="1.6"/>'
    + '<circle cx="7.2" cy="-1" r="1.8" fill="' + INK2 + '"/>'
    + '<path d="M14 2 q 4 -3 8 0" fill="none" stroke="' + INK2 + '" stroke-width=".9" opacity=".6"/>'
    + '</g>'
    + '</g>'
    // ===== IL CARTIGLIO: nome del luogo, la distanza che resta, il tempo del passo =====
    + '<rect x="76" y="218" width="148" height="52" rx="9" fill="#f4e7c2" stroke="#8a6a44" stroke-width="1.2" opacity=".94"/>'
    + '<text id="carta-nome" x="150" y="233" text-anchor="middle" font-family="IM Fell English, Georgia, serif" font-size="12.5" fill="#3a2810" letter-spacing=".4">' + nome + '</text>'
    + '<path d="M116 238 C 131 241.5, 169 241.5, 184 238" stroke="#8a6a44" stroke-width="1" fill="none" opacity=".65"/>'
    + '<text id="carta-distanza" x="150" y="250" text-anchor="middle" font-family="IM Fell English, Georgia, serif" font-size="12" fill="#3a2810"> </text>'
    + '<text id="carta-sentenza" x="150" y="262" text-anchor="middle" font-family="IM Fell English, Georgia, serif" font-size="10.5" font-style="italic" fill="' + INK2 + '"> </text>'
    + '</g></svg>';
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
      alert('Il luogo di potere non ti sente ancora: sei lontano. Segui la lancetta.');
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
        // V8.21, secondo giro: chi torna non è zittito. Se il luogo è profondo
        // lo spirito parla di nuovo, con una parola nuova; se è muto, la vecchia
        // gentilezza della stella già posata.
        if (data.gia_visitato) {
          if (data.custode && data.custode.nome) { mostraCustode(data.custode, data.nome, poiCorrente.id); return; }
          alert('Avevi già lasciato la tua stella qui.');
          return;
        }
        mostraStella(data.nome, data.stelle, data.custode, poiCorrente.id);
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
  }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 15000 });
}

function mostraStella(nomePoi, stelle, custode, poiId) {
  const toast = document.createElement('div');
  toast.className = 'toast-veloce';
  toast.textContent = '⭐ Una stella si è posata: ' + nomePoi + ' — ' + stelle + (stelle === 1 ? ' stella in collezione' : ' stelle in collezione');
  document.querySelector('.screen').appendChild(toast);
  setTimeout(() => toast.classList.add('spegni'), 6000);
  setTimeout(() => toast.remove(), 6600);
  corvoReagisci('festa'); // V8.24: una stella si è posata — il corvo traversa festoso
  // V8.21 — IL CUSTODE: se il luogo è profondo, lo spirito del posto
  // aspetta che la stella sia posata, poi si presenta. Nessuna fretta: prima la
  // stella, poi la voce. La voce ruota: ogni ascolto, una parola diversa.
  if (custode && custode.nome) {
    setTimeout(() => mostraCustode(custode, nomePoi, poiId), 1200);
  }
}

// ===== V8.21 — IL CUSTODE DEL LUOGO =====
// Nei luoghi profondi (livello 2 nel DB), al check-in ti accoglie lo spirito
// del posto: narra la leggenda in prima persona. Testo statico che arriva col
// check-in dal server: nessuna posizione, nessun dato nuovo, solo la voce
// antica che ti sei guadagnato posando la stella.
function mostraCustode(custode, nomePoi, poiId) {
  document.getElementById('custode-nome').textContent = custode.nome;
  document.getElementById('custode-luogo').textContent = 'il custode di ' + nomePoi;
  document.getElementById('custode-racconto').textContent = custode.racconto || '';
  const m = document.getElementById('modale-custode');
  if (!m) return;
  // V8.21, secondo giro — LA FIAMMELLA RISPONDE: il custode è ricontattabile.
  // Se ha più di un racconto, l\'anima può chiedere ancora da qui, senza
  // rifare il giro del mondo: il bottone nasce al volo nella modale.
  const box = m.querySelector('.modale-box');
  let btnAncora = document.getElementById('custode-ancora');
  if (!btnAncora) {
    btnAncora = document.createElement('button');
    btnAncora.id = 'custode-ancora';
    btnAncora.className = 'btn-modale fantasma';
    btnAncora.textContent = '🕯️ Chiedi ancora alla fiammella';
    box.insertBefore(btnAncora, document.getElementById('btn-custode-via'));
  }
  btnAncora.style.display = (custode.totale && custode.totale > 1) ? '' : 'none';
  btnAncora.onclick = function () {
    btnAncora.disabled = true;
    fetch(API + '/api/custode?poi_id=' + encodeURIComponent(poiId) + '&utente_id=' + encodeURIComponent(utente.id))
      .then(r => r.json())
      .then(d => {
        btnAncora.disabled = false;
        if (d.ok && d.custode) { document.getElementById('custode-racconto').textContent = d.custode.racconto || ''; }
        else { alert(d.error || 'La fiammella esita: riprova.'); }
      })
      .catch(e => {
        btnAncora.disabled = false;
        alert('La fiammella non risponde: ' + e.message);
      });
  };
  m.classList.remove('nascosto');
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
      lista.innerHTML = '<div class="stella-raccolta"><div class="nome">Nessuna stella, per ora.</div><div class="quando">Segui la lancetta e raggiungi il luogo di potere.</div></div>';
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

function chiudiModale(id) {
  document.getElementById(id).classList.add('nascosto');
}



// ===== LA PIAZZA (V8.13): le voci di tutte le anime =====
async function apriPiazza() {
  if (!utente) return;
  document.getElementById('modale-piazza').classList.remove('nascosto');
  try {
    const resp = await fetch(API + '/api/voci');
    const data = await resp.json();
    disegnaVoci(data.voci || []);
  } catch (e) {
    document.getElementById('piazza-lista').innerHTML =
      '<div class="lettera-ricevuta"><div class="testo">La piazza è avvolta nella nebbia (server non raggiungibile).</div></div>';
  }
}

function disegnaVoci(voci) {
  const lista = document.getElementById('piazza-lista');
  lista.innerHTML = '';
