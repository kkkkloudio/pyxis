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
// V8.37 — LA PORTA TI SEGUE: secondo giorno in esterna, Carlo e ad Altedo
// e la bussola lo vede ancora a Rovigo. Chi viaggia non deve ricordarsi la
// porta: se il telefono capisce in quale provincia si trova, la porta si
// aggiorna da sola (posizione solo sul telefono, come sempre). La parola
// d'accesso ora resta nello scrigno anche dopo il riavvio (pyxis-seq),
// altrimenti il rientro silenzioso non riconosceva l'anima.


// V8.38 — IL CIELO INCERTO: secondo giorno di test bocciato, la lezione più
// importante: Carlo a casa sua (Rovigo) e il telefono che giura "Pare che tu
// sia a Bologna". Lo stivale era innocente (verificato punto per punto: San
// Pio e tutti i dintorni dicono Rovigo, e per dire Bologna il telefono deve
// riportare una posizione a oltre 30 km da casa sua): era il GPS che, in casa,
// risponde col Wi-Fi e sbaglia di decine di km. Da ora la bussola diffida:
// se il telefono stesso dichiara un'incertezza oltre 10 km, la porta non si
// propone e non si cambia, e il sussurro lo dice chiaro. L'incertezza è
// coords.accuracy, vive solo sul telefono come tutto il resto.
// V8.39 — UNA LANCETTA SOLA: il titolo della legenda diceva "Le tre
// lancette" e nella home se ne vede una sola da quando le anime vicine
// sono nascoste: il titolo mentiva alla vista. Ora dice solo "La lancetta"
// ("The needle" in inglese), coerente col canone di V8.36: la lancetta
// è una. (Segnalazione di Carlo, 25/11 sera.)

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
    legendaTitolo: "La lancetta",
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
    cieloIncerto: "il cielo è troppo incerto (±{km} km): scegli la porta a mano",
    tempoPasseggiata: "una passeggiata",
    tempoCammino: "un bel cammino",
    tempoPellegrinaggio: "pellegrinaggio: gran camminata",
    minCammino: " min",
    hCammino: " h",
    kmCorto: " km",
    mCorto: " m",
    oltreLembo: "il sentiero esce dalla pergamena: oltre il lembo, comanda la lancetta",
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
    // LA COLLANA SUL QUADRANTE: il titolo dell'anima cresce con le pietre raccolte
    livelloNuovaAnima: "nuova anima",
    livelloCercatrice: "cercatrice di luoghi",
    livelloPellegrina: "pellegrina",
    livelloViandante: "viandante dei sentieri",
    livelloCustode: "custode dei sentieri",
    contaPietra: "pietra sulla cornice",
    contaPietre: "pietre sulla cornice",
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
    legendaTitolo: "The needle",
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
    cieloIncerto: "the sky is too unsure (±{km} km): pick the gate by hand",
    tempoPasseggiata: "a stroll",
    tempoCammino: "a fair walk",
    tempoPellegrinaggio: "a pilgrimage: a grand walk",
    minCammino: " min",
    hCammino: " h",
    kmCorto: " km",
    mCorto: " m",
    oltreLembo: "the trail leaves the parchment: past the edge, the needle commands",
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
    // THE NECKLACE ON THE DIAL: the soul's title grows with the gathered stones
    livelloNuovaAnima: "a new soul",
    livelloCercatrice: "a seeker of places",
    livelloPellegrina: "a pilgrim",
    livelloViandante: "a wanderer of paths",
    livelloCustode: "keeper of the paths",
    contaPietra: "stone on the rim",
    contaPietre: "stones on the rim",
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
  if (typeof aggiornaLivelloCollana === 'function') aggiornaLivelloCollana();
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
      localStorage.setItem('pyxis-seq', JSON.stringify(sequenzaAccesso)); // V8.37: la parola resta nello scrigno, per chi rientra
      mostraBussola();
      avviaSSE();
      caricaLancette();
      caricaCollana();
    } catch (e) {
      alert('Backend non raggiungibile: ' + e.message);
    }
  });

  if (utente) {
    mostraBussola();
    avviaSSE();
    caricaLancette();
    caricaCollana();
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
  autoPorta(); // V8.37: chi viaggia ritrova la porta, senza chiedere
}

// ===== V8.37 — LA PORTA TI SEGUE =====
// Idea nata sul campo con Hermes (versione sperimentale sul mini PC, poi
// sistemata qui): quando l'anima e dentro e il telefono capisce di essere
// in un'altra provincia, la porta si aggiorna da sola via /api/register.
// Il buco della versione sperimentale: la parola veniva ricomposta dalle
// pietre in memoria, che dopo il riavvio della pagina sono vuote
// (null-null-null-null): il server rifiutava in silenzio e l'anima restava
// alla porta vecchia. Qui la parola viene dallo scrigno (pyxis-seq), e senza
// parola valida non si tocca niente. Pietra angolare intatta: la posizione
// vive solo nel telefono e muore qui; al server parte solo il NOME della porta.
function autoPorta() {
  if (!navigator.geolocation || !utente) return;
  let seq = null;
  try { seq = JSON.parse(localStorage.getItem('pyxis-seq') || 'null'); } catch (e) { seq = null; }
  if (window.__seqAccesso && window.__seqAccesso.every(function (el) { return el; })) seq = window.__seqAccesso;
  if (!seq || !Array.isArray(seq) || seq.length !== 4 || seq.some(function (el) { return !el; })) return; // senza parola non si cambia porta
  const password = seq.join('-');
  navigator.geolocation.getCurrentPosition(function (pos) {
    // V8.38: stessa diffidenza dello scrigno: il cielo incerto non cambia porte.
    const acc = (pos.coords && typeof pos.coords.accuracy === 'number' && !isNaN(pos.coords.accuracy)) ? pos.coords.accuracy : null;
    if (acc === null || acc > 10000) return;
    const porta = trovaProvincia(pos.coords.latitude, pos.coords.longitude);
    if (!porta || porta === utente.provincia) return;
    fetch(API + '/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: utente.nome, provincia: porta, password: password })
    }).then(function (r) { return r.json(); }).then(function (data) {
      if (!data || !data.utente) return; // il server ha detto no: si resta alla porta attuale, in silenzio
      utente = data.utente;
      localStorage.setItem('pyxis-utente', JSON.stringify(utente));
      const sotto = document.getElementById('sottotitolo-utente');
      if (sotto) sotto.textContent = utente.nome + ' · ' + utente.provincia;
      if (evtSource) { evtSource.close(); evtSource = null; } // il cerchio d'ascolto segue la porta nuova
      avviaSSE();
      caricaLancette();
    }).catch(function () {});
  }, function () {}, { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 });
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
  // tempo del passo (4,5 km/h: il passo onesto del pellegrino), e la
  // sentenza che dice se e' una cosa da fare a piedi o gran camminata.
  // V8.40: dice pure QUARTA cosa: oltre il lembo della pergamena, il sentiero
  // esce e comanda la lancetta (lo dice il cartiglio, poi guida la lancetta).
  let cart = document.getElementById("carta-distanza");
  let via = document.getElementById("carta-distanza-via");
  let sent = document.getElementById("carta-sentenza");
  if (!cart || !poiCorrente) return;
  let testo = "", viaT = "", sentenza = "";
  if (BVERA.pos && poiCorrente.lat != null) {
    const d = distanzaMetri(BVERA.pos.lat, BVERA.pos.lon, poiCorrente.lat, poiCorrente.lon);
    // V8.40: il sentiero e' disegnato in SCALA REALE: se il passo cambia il
    // mondo di un quarto (o l'anima entra nel cerchio del luogo), la pergamena
    // RIDISEGNA il cammino al volo, perche' la carta dica sempre il vero.
    const ridisegna = (CARTA.dDis == null) ||
      ((d <= RAGGIO_M) !== (CARTA.dDis <= RAGGIO_M)) ||
      Math.abs(d - CARTA.dDis) > Math.max(40, CARTA.dDis * 0.25);
    if (ridisegna) {
      const lembo = document.getElementById("carta-rotta");
      if (lembo) {
        lembo.innerHTML = disegnaCarta();
        cart = document.getElementById("carta-distanza");
        via = document.getElementById("carta-distanza-via");
        sent = document.getElementById("carta-sentenza");
      }
    }
    if (d <= RAGGIO_M) {
      testo = t("cerchio");
      sentenza = t("tempoPasseggiata");
    } else {
      const chilometri = d >= 1000;
      const distStr = chilometri
        ? "≈ " + (d / 1000).toFixed(1).replace(".", ",") + t("kmLuogo")
        : "≈ " + (Math.round(d / 10) * 10) + t("mLuogo");
      viaT = chilometri
        ? "≈ " + (d / 1000).toFixed(d >= 10000 ? 0 : 1).replace(".", ",") + t("kmCorto")
        : "≈ " + (Math.round(d / 10) * 10) + t("mCorto");
      const min = d / 75; // 4,5 km/h: il passo onesto di chi va a piedi
      let tempo;
      if (min < 60) tempo = "~" + (Math.round(min / 5) * 5) + t("minCammino");
      else {
        const h = Math.floor(min / 60);
        const m = Math.round((min - h * 60) / 5) * 5;
        tempo = "~" + h + t("hCammino") + (m ? " " + m + t("minCammino") : "");
      }
      sentenza = d <= 1500 ? t("tempoPasseggiata")
        : (d <= 5000 ? t("tempoCammino") : t("tempoPellegrinaggio"));
      // V8.40: oltre il paio di chilometri che la pergamena sa mostrare, il
      // sentiero esce dal lembo: lo dice il cartiglio, poi comanda la lancetta
      testo = distStr + " · " + tempo + (d > VEDI_M ? " · " + t("oltreLembo") : "");
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
  else if (stato === 'incerto') s.textContent = t('cieloIncerto').replace('{km}', porta);
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
    // V8.38: il telefono dice anche QUANTO è incerto (accuracy, in metri).
    // Se l'incertezza supera i 10 km, il cielo non vale niente: in casa il
    // GPS spesso risponde col Wi-Fi e sbaglia di decine di km (Carlo a
    // Rovigo si è visto proporre Bologna). Meglio il silenzio che la bugia.
    const acc = (pos.coords && typeof pos.coords.accuracy === 'number' && !isNaN(pos.coords.accuracy)) ? pos.coords.accuracy : null;
    btn.disabled = false;
    if (acc === null || acc > 10000) {
      ultimaPortaTrovata = null;
      aggiornaSussurro('incerto', acc === null ? '?' : Math.round(acc / 1000));
      return;
    }
    const porta = trovaProvincia(pos.coords.latitude, pos.coords.longitude);
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

// ===== V8.40 — LA CARTA DICE IL VERO (idea di Carlo, 25/11) =====
// Il sentiero non e' piu' la scenografia uguale per tutti: ora rappresenta
// il cammino VERO, semplificato all'osso. Lunghezza in SCALA REALE dal
// passo alla stella, serpeggi lievi che cambiano per ogni luogo (la FORMA
// del cammino, non la mappa delle strade: le strade vere costerebbero la
// posizione a un motore di routing, e la pietra angolare non si tocca), e i
// punti di riferimento VERI del luogo incisi accanto alla stella, perche'
// chi cammina sappia orientarsi. La pergamena mostra al piu' un paio di
// chilometri (VEDI_M): oltre il lembo, il cartiglio lo dice e comanda la
// lancetta. Sei nel cerchio? Il viandante e' gia' accanto alla stella:
// sei giunto. Tutto calcolato sul telefono: la posizione non parte mai.

// il paio di chilometri che la pergamena mostra prima che il sentiero
// esca dal lembo; oltre, parla la lancetta
const VEDI_M = 2000;
// la scala della pergamena: quanto sentiero per metro di mondo
const PX_M = 110 / VEDI_M;

// i segni VERI dei luoghi: dati PUBBLICI del luogo (un fiume, un parco),
// tenuti qui da chi costruisce, MAI dell'anima che cammina. ang = gradi
// dal nord (0 sopra la stella), m = metri dalla stella, in scala. Chi ne
// aggiunge, prima verifica sul posto o sulle mappe: il canone lo impone.
const SEGNALI = {
  "poi-ro-rotonda": [ { tipo: "acqua", nome: "l'Adigetto", ang: 250, m: 250 } ],
  "poi-ve-poveglia": [ { tipo: "acqua", nome: "la laguna", ang: 135, m: 600 } ],
  "poi-to-mole": [ { tipo: "acqua", nome: "il Po", ang: 100, m: 800 } ]
};

// ogni luogo serpeggia a modo suo: un'impronta fissa, che non cambia mai
function improntaDelLuogo(id) {
  let h = 0;
  const s = String(id || "luogo");
  for (let i = 0; i < s.length; i++) { h = ((h * 31) + s.charCodeAt(i)) >>> 0; }
  return h;
}

// la pergamena: tutta incisione, niente foto. Il sentiero sta nel gruppo
// #carta-filo (parte dritto verso l'alto e ruota verso la rotta vera);
// nome e distanza restano fissi, ben leggibili nel cartiglio in basso.
// V8.40: il sentiero ha la LUNGHEZZA VERA del cammino che resta.
function disegnaCarta() {
  let nome = poiCorrente ? String(poiCorrente.nome).replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";
  if (nome.length > 26) nome = nome.slice(0, 25) + "…";
  const a0 = CARTA.angolo.toFixed(1);
  const INK = "#55341c";
  const INK2 = "#6b4a2a";

  // il mondo, letto solo qui nel telefono (pietra angolare: non parte mai)
  let dM = null;
  if (BVERA.pos && poiCorrente && poiCorrente.lat != null && poiCorrente.lon != null) {
    dM = distanzaMetri(BVERA.pos.lat, BVERA.pos.lon, poiCorrente.lat, poiCorrente.lon);
  }
  CARTA.dDis = dM; // l'ultima distanza che ha disegnato il sentiero
  const giunto = dM != null && dM <= RAGGIO_M;

  // quanto sentiero: SCALA REALE dal passo alla stella
  let L2;
  if (dM == null) L2 = 108;   // cielo muto: sentiero pieno, muto di numeri
  else if (giunto) L2 = 26;   // sei giunto: la stella sta accanto al passo
  else L2 = Math.max(18, Math.min(dM, VEDI_M) * PX_M);
  const Sy = 158 - L2; // dove sta la stella nel filo

  // il serpeggio del cammino: cambia per ogni luogo, finisce alla stella
  const h = improntaDelLuogo(poiCorrente ? poiCorrente.id : null);
  const amp = (0.06 + (h % 13) / 100) * L2;
  const fasi = 2 + (h % 3);
  const sfas = (h % 7) * 0.8;
  let sentiero = "M150 158";
  for (let k = 1; k <= 12; k++) {
    const tt = k / 12;
    const x = 150 + amp * Math.sin(tt * Math.PI * fasi + sfas) * Math.sin(Math.PI * tt);
    sentiero += " L" + x.toFixed(1) + " " + (158 - L2 * tt).toFixed(1);
  }

  // i segni veri del luogo, incisi intorno alla stella (in scala)
  let segni = "";
  if (poiCorrente && SEGNALI[poiCorrente.id]) {
    SEGNALI[poiCorrente.id].forEach(function (s) {
      const rad = s.ang * Math.PI / 180;
      const sx = 150 + Math.sin(rad) * s.m * PX_M;
      const sy = Sy - Math.cos(rad) * s.m * PX_M;
      if (Math.hypot(sx - 150, sy - 150) > 106) return; // oltre il lembo non si incide
      const nomeSegno = String(s.nome || "").replace(/</g, "&lt;");
      let glifo = "";
      if (s.tipo === "acqua") {
        glifo = '<path d="M-21 0 q 7 -4 14 0 t 14 0" fill="none" stroke="#5d6b4a" stroke-width="1.3"/>'
          + '<path d="M-19 5 q 7 -4 14 0 t 12 0" fill="none" stroke="#5d6b4a" stroke-width="1" opacity=".6"/>'
          + '<text x="2" y="-8" text-anchor="middle" font-family="IM Fell English, Georgia, serif" font-size="9.5" font-style="italic" fill="' + INK2 + '">' + nomeSegno + '</text>';
      } else if (s.tipo === "parco") {
        glifo = '<path d="M-4 8 L-4 0" stroke="' + INK2 + '" stroke-width="1.4"/>'
          + '<circle cx="-6" cy="-4" r="4.6" fill="#8a6a34" stroke="' + INK2 + '" stroke-width="1" opacity=".5"/>'
          + '<circle cx="1" cy="-7" r="5.4" fill="#8a6a34" stroke="' + INK2 + '" stroke-width="1" opacity=".5"/>'
          + '<path d="M7 7 L7 0" stroke="' + INK2 + '" stroke-width="1.4"/>'
          + '<circle cx="5" cy="-3" r="4.2" fill="#8a6a34" stroke="' + INK2 + '" stroke-width=".9" opacity=".5"/>'
          + '<text x="2" y="-14" text-anchor="middle" font-family="IM Fell English, Georgia, serif" font-size="9.5" font-style="italic" fill="' + INK2 + '">' + nomeSegno + '</text>';
      } else return;
      segni += '<g transform="translate(' + sx.toFixed(1) + ',' + sy.toFixed(1) + ')" opacity=".7">' + glifo + '</g>';
    });
  }

  // le impronte: al varco, o gia' accanto alla stella di chi e' giunto
  const impronte = giunto
    ? '<g transform="translate(171,' + (Sy + 9).toFixed(1) + ')">'
      + '<circle r="12" fill="none" stroke="' + INK2 + '" stroke-width=".8" stroke-dasharray="1.5 3.5" opacity=".5"/>'
      + '<g transform="translate(-6.5,-4) rotate(20)"><ellipse rx="3" ry="5.2" fill="none" stroke="' + INK + '" stroke-width="1.2"/></g>'
      + '</g>'
    : '<g transform="translate(150,158)">'
      + '<circle r="13" fill="none" stroke="' + INK2 + '" stroke-width=".8" stroke-dasharray="1.5 3.5" opacity=".5"/>'
      + '<g transform="translate(-7.5,-2) rotate(22)"><ellipse rx="3.2" ry="5.6" fill="none" stroke="' + INK + '" stroke-width="1.3"/></g>'
      + '<g transform="translate(7,5) rotate(-16)"><ellipse rx="3.2" ry="5.6" fill="none" stroke="' + INK + '" stroke-width="1.3"/></g>'
      + '</g>';

  // l'appunto del cartografo accanto al sentiero: la distanza che resta
  const viaPos = (dM == null || giunto)
    ? "translate(150,140) rotate(-37)"
    : "translate(" + (150 + 26 + amp).toFixed(1) + "," + (158 - L2 * 0.55).toFixed(1) + ") rotate(-37)";

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
    // onde da cartografia antica ai lembi del mondo conosciuto
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
    // ===== IL FILO: il cammino VERO in scala, che ruota col mondo =====
    + '<g id="carta-filo" transform="rotate(' + a0 + ' 150 150)">'
    + impronte
    // il sentiero della lunghezza vera: serpeggi del luogo, fino alla stella
    + '<path d="' + sentiero + '" fill="none" stroke="' + INK + '" stroke-width="2" stroke-linecap="round" stroke-dasharray="0.5 6" opacity=".9"/>'
    // e accanto al sentiero, inclinato come un appunto del cartografo: la distanza
    + '<text id="carta-distanza-via" transform="' + viaPos + '" font-family="IM Fell English, Georgia, serif" font-size="10.5" font-style="italic" fill="' + INK2 + '" opacity=".85"> </text>'
    // la stella del luogo, in fondo al cammino vero
    + '<g transform="translate(0,' + (Sy - 27).toFixed(1) + ')">'
    + '<path d="M150 27 L152.8 36.5 L162 40 L152.8 43.5 L150 53 L147.2 43.5 L138 40 L147.2 36.5 Z" fill="#c9962f" stroke="' + INK + '" stroke-width="1"/>'
    + '<path d="M150 21 L150 26 M171 40 L164 40 M129 40 L136 40 M158 31 L161 25 M142 31 L139 25" stroke="#b8862b" stroke-width="1" opacity=".55"/>'
    + '</g>'
    // i segni veri del luogo: fiumi, parchi, quel che c'e' davvero
    + segni
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
        caricaCollana(poiCorrente.id); // la pietra si incastona ora
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

// ===== LA COLLANA SUL QUADRANTE (idea di Carlo, 25/11) =====
// Ogni luogo raggiunto incastona una pietra nella cornice della bussola:
// una gemma per luogo, colore fisso e deterministico (improntaDelLuogo),
// sempre lo stesso per tutti: la gemma di un luogo e' la sua, non nostra.
// Il giro delle pietre parte dal nord e procede per ordine di raccolta.
// Il titolo dell'anima cresce col numero di pietre. In un secondo tempo le
// pietre si spenderanno (Carlo): parcheggiato, prima nasce la vetrina.
// Pietra angolare intatta: si disegnano solo i luoghi gia' visitati,
// nessuna posizione entra o esce dal telefono.
const COLLANA = { gemme: [] };

function titoloCollana(n) {
  if (n >= 20) return t('livelloCustode');
  if (n >= 10) return t('livelloViandante');
  if (n >= 5) return t('livelloPellegrina');
  if (n >= 1) return t('livelloCercatrice');
  return t('livelloNuovaAnima');
}

// il colore della pietra di un luogo: deterministico, dall'id del POI
function colorePietra(poiId) {
  const h = improntaDelLuogo(poiId);
  return 'hsl(' + (h % 360) + ', 62%, ' + (42 + (h % 15)) + '%)';
}

async function caricaCollana(nuovaPietra) {
  if (!utente) return;
  try {
    const resp = await fetch(API + '/api/collezione?id=' + encodeURIComponent(utente.id));
    const data = await resp.json();
    COLLANA.gemme = (data.stelle || []).slice().sort(function (a, b) {
      return String(a.visitato_il || '').localeCompare(String(b.visitato_il || ''));
    });
    disegnaCollana(nuovaPietra);
  } catch (e) {
    console.error('Errore collana:', e);
  }
}

function disegnaCollana(nuovaPietra) {
  const svg = document.querySelector('.bussola-wrap svg.quadrante');
  if (!svg) return;
  let g = document.getElementById('collana-gemme');
  if (!g) {
    g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('id', 'collana-gemme');
    svg.appendChild(g);
  }
  g.innerHTML = '';
  const N = COLLANA.gemme.length;
  for (let i = 0; i < N; i++) {
    const S = COLLANA.gemme[i];
    const ang = (-90 + i * 360 / N) * Math.PI / 180;
    const x = 150 + Math.cos(ang) * 138.2;
    const y = 150 + Math.sin(ang) * 138.2;
    const glu = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    glu.setAttribute('transform', 'translate(' + x.toFixed(1) + ',' + y.toFixed(1) + ')');
    if (S.poi_id === nuovaPietra) glu.setAttribute('class', 'nasce');
    glu.innerHTML = '<circle r="4.4" fill="' + colorePietra(S.poi_id || S.nome) + '" stroke="#241708" stroke-width="1.1" />' +
                    '<circle r="1.5" cx="-1.1" cy="-1.3" fill="rgba(255,246,220,.6)" />';
    g.appendChild(glu);
  }
  aggiornaLivelloCollana();
}

// il titolo dell'anima sotto la legenda: cresce col numero di pietre
function aggiornaLivelloCollana() {
  const el = document.getElementById('collana-livello');
  if (!el) return;
  const n = COLLANA.gemme.length;
  const conteggio = n === 1 ? t('contaPietra') : t('contaPietre');
  el.textContent = titoloCollana(n) + ' · ' + n + ' ' + conteggio;
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
  if (!voci.length) {
    lista.innerHTML = '<div class="lettera-ricevuta"><div class="testo">Nessuna voce, per ora. La piazza attende la prima.</div></div>';
    return;
  }
  for (const v of voci) {
    const el = document.createElement('div');
    el.className = 'lettera-ricevuta';
    el.innerHTML = '<div class="da">📣 ' + escapeHtml(v.nome) + '</div>' +
                   '<div class="testo">' + escapeHtml(v.testo) + '</div>';
    lista.appendChild(el);
  }
}

async function inviaVoce() {
  const area = document.getElementById('piazza-testo');
  const testo = area.value.trim();
  if (!testo) return;
  try {
    const resp = await fetch(API + '/api/voce', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ utente_id: utente.id, testo })
    });
    if (!resp.ok) {
      const d = await resp.json().catch(() => ({}));
      alert(d.error || 'La voce si è persa nel vento');
      return;
    }
    area.value = '';
    apriPiazza(); // la piazza si rinnova davanti agli occhi
  } catch (e) {
    alert('La piazza non risponde (server non raggiungibile): ' + e.message);
  }
}

// ===== FEEDBACK (V8.14): parola ai costruttori =====
function apriFeedback() {
  document.getElementById('feedback-testo').value = '';
  document.getElementById('modale-feedback').classList.remove('nascosto');
}

async function inviaFeedback() {
  const area = document.getElementById('feedback-testo');
  const testo = area.value.trim();
  if (!testo) return;
  try {
    const resp = await fetch(API + '/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ utente_id: utente.id, testo })
    });
    if (!resp.ok) {
      const d = await resp.json().catch(() => ({}));
      alert(d.error || 'Il corvo non è riuscito a partire');
      return;
    }
    area.value = '';
    chiudiModale('modale-feedback');
    corvoReagisci('partenza'); // V8.24: verso i costruttori, col becco pieno
    const toast = document.createElement('div');
    toast.className = 'toast-veloce';
    toast.textContent = '🐦‍⬛ Il corvo ha preso il tuo messaggio. Grazie, anima.';
    document.querySelector('.screen').appendChild(toast);
    setTimeout(() => toast.classList.add('spegni'), 4500);
    setTimeout(() => toast.remove(), 5100);
  } catch (e) {
    alert('Il corvo non trova la via (server non raggiungibile): ' + e.message);
  }
}

// ===== LA GUIDA (V8.15): i primi passi =====
const GUIDA_STEP_IT = [
  { titolo: 'Benvenuta, anima', testo: 'Questa è la bussola. L\'ago grande punta il luogo più vicino a te. Toccalo: ti dice chi punta e dove.' },
  { titolo: 'Sveglia l\'ago', testo: 'Con il bottone 🧭 l\'ago si sveglia e punta la direzione VERA nel mondo: girati finché la punta rossa entra nella porta in alto. Quella punta rossa è un granato: la gemma della lancetta, la sola che ti guida. Poi cammina: sotto vedi quanto manca.' },
  { titolo: 'La stella', testo: 'Quando sei vicino al luogo, il bottone ✨ si accende: tocca e raccogli la stella. La tua posizione resta sul telefono, non esce mai.' },
  { titolo: 'Il corvo', testo: 'In basso cammina un corvo: toccalo e ti parla. A volte porta messaggi da chi sta dietro a questo progetto. Ora il viaggio è tuo.' }
];
let guidaIndice = 0;

function apriGuida() {
  guidaIndice = 0;
  disegnaGuida();
  document.getElementById('modale-guida').classList.remove('nascosto');
}

function disegnaGuida() {
  const passi = GUIDA_STEP();
  const s = passi[guidaIndice];
  document.getElementById('guida-titolo').textContent = (guidaIndice + 1) + ' · ' + s.titolo;
  document.getElementById('guida-testo').textContent = s.testo;
  document.getElementById('btn-guida-avanti').textContent = guidaIndice === passi.length - 1 ? t('entraCerchio') : t('avanti');
  const punti = document.getElementById('guida-punti');
  punti.innerHTML = '';
  passi.forEach((_, i) => {
    const p = document.createElement('span');
    p.className = 'punto' + (i === guidaIndice ? ' acceso' : '');
    punti.appendChild(p);
  });
}

const GUIDA_STEP_EN = [
  { titolo: 'Welcome, soul', testo: 'This is the compass. The big needle points to the nearest place. Tap it: it tells you what it points at and where.' },
  { titolo: 'Wake the needle', testo: 'With the 🧭 button the needle wakes and points the REAL direction in the world: turn until the red tip enters the door at the top. That red tip is a garnet: the gem of the needle, the only one that guides you. Then walk: below you see how far is left.' },
  { titolo: 'The star', testo: 'When you are near the place, the ✨ button lights up: tap and collect the star. Your location stays on the phone, it never leaves.' },
  { titolo: 'The raven', testo: 'At the bottom a raven walks: tap it and it talks to you. Sometimes it brings messages from who is behind this project. Now the journey is yours.' }
];
function GUIDA_STEP() { return LINGUA.corrente === 'en' ? GUIDA_STEP_EN : GUIDA_STEP_IT; }

function avantiGuida() {
  // V8.19: bug della guida — GUIDA_STEP è una funzione da V8.17: .length era 0
  // e la guida si chiudeva al primo "Avanti", senza mai mostrare i passi 2-5.
  if (guidaIndice < GUIDA_STEP().length - 1) {
    guidaIndice++;
    disegnaGuida();
  } else {
    localStorage.setItem('pyxis-guida', 'vista');
    chiudiModale('modale-guida');
  }
}

function escapeHtml(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

// ===== V8.24 — IL CORVO DI PYXIS: l’abitante della notte =====
// Non è un’animazione: è un inquilino. Cammina lungo il bordo basso della notte,
// becca, saltella, ogni tanto traversa lo schermo in volo. Quando una lettera
// parte è lui a portarla via; quando ne arriva una, plana. Toccalo: risponde
// a modo suo. Chi ha chiesto meno movimento al telefono lo trova appollaiato
// e fermo — ma parla comunque, con garbo. Nessun dato, nessuna posizione:
// solo piume, inchiostro e un filo di lore.

const CORVO_SVG = '<svg viewBox="0 0 120 84" class="corvo-svg" aria-hidden="true">'
  + '<defs><radialGradient id="corvo-aura" cx="50%" cy="45%" r="60%"><stop offset="0%" stop-color="#e8cd85" stop-opacity=".28"/><stop offset="55%" stop-color="#8a6a3a" stop-opacity=".10"/><stop offset="100%" stop-color="#000" stop-opacity="0"/></radialGradient></defs>'
  + '<ellipse class="corvo-aura" cx="60" cy="40" rx="56" ry="40" fill="url(#corvo-aura)"/>'
  + '<g class="zampe"><path d="M56 62 L56 76 M56 76 L50 81 M56 76 L61 81 M65 62 L65 76 M65 76 L60 81 M65 76 L70 81" stroke="#8a7248" stroke-width="2.2" fill="none" stroke-linecap="round"/></g>'
  + '<g class="corvo-corpo">'
  + '<g class="corvo-testa">'
  + '<path class="corvo-sagoma" d="M88 20 C83 10, 69 6, 58 11 C51 14, 50 21, 51 25 L18 39 C12 41.5, 12 45, 18 47 L51 53 C50 60, 57 66, 68 65.5 C81 65, 86 53, 88 39 C89.5 28, 90 24, 88 20 Z" fill="#14100d" stroke="#000" stroke-width="1.4"/>'
  + '<path d="M51 26 L26 37 M51 33 L28 42 M52 40 L32 46 M54 47 L38 51" stroke="#2b241b" stroke-width="1.1" fill="none" stroke-linecap="round"/>'
  + '<path d="M54 30 C60 34, 64 40, 65 47 M50 24 C58 28, 63 35, 64 43" stroke="#1d1812" stroke-width="1" fill="none"/>'
  + '<path class="corvo-becco" d="M87 19 C94 20, 101 24, 106 30 C100 31.5, 91 30, 85 26 Z" fill="#c9a45c" stroke="#6a5535" stroke-width="1"/>'
  + '<path d="M87 19 C94 20, 101 24, 106 30" stroke="#e8cd85" stroke-width=".8" fill="none" opacity=".7"/>'
  + '<circle class="corvo-occhio" cx="76" cy="21" r="3.2" fill="#e8cd85"/>'
  + '<circle cx="77" cy="20" r="1.2" fill="#fff"/>'
  + '<circle cx="76" cy="21" r="5.2" fill="none" stroke="#e8cd85" stroke-width=".6" opacity=".35"/>'
  + '</g>'
  + '<path class="ala ala-l" d="M58 26 C44 30, 37 44, 42 53 C54 50, 62 39, 63 29 Z" fill="#1f1913" stroke="#000" stroke-width="1"/>'
  + '<path d="M46 36 C51 39, 56 44, 59 50 M43 42 C48 45, 53 49, 57 53" stroke="#14100d" stroke-width="1" fill="none" stroke-linecap="round"/>'
  + '<path class="ala ala-r" d="M60 24 C70 18, 80 18, 87 24 C80 26, 70 28, 62 29 Z" fill="#241d15" stroke="#000" stroke-width=".8"/>'
  + '</g></svg>';

const CORVO = {
  el:null, svg:null,
  x:24, dir:1, dirVista:0, alt:0,
  stato:'fermo', durata:0, inStatoDa:0,   // fermo | cammina | becca | salto | volo | partito | posa
  tPrec:null, prossimaMossa:2,
  voloDa:0, voloA:0, voloDur:1.6,
  frasiViste:0, attivo:false
};

function avviaCorvo() {
  if (CORVO.attivo) return;
  const screen = document.querySelector('.screen');
  if (!screen || !utente) return;
  CORVO.attivo = true;
  CORVO.el = document.createElement('div');
  CORVO.el.className = 'corvo-pet';
  CORVO.el.id = 'corvo-pet';
  CORVO.el.title = 'Muninn, il corvo di Pyxis';
  CORVO.el.setAttribute('role', 'button');
  CORVO.el.setAttribute('aria-label', 'Muninn, il corvo di Pyxis');
  CORVO.el.tabIndex = 0;
  CORVO.el.innerHTML = CORVO_SVG;
  screen.appendChild(CORVO.el);
  CORVO.svg = CORVO.el.querySelector('.corvo-svg');
  CORVO.el.addEventListener('click', toccoCorvo);
  CORVO.el.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toccoCorvo(); }
  });
  CORVO.x = 24 + Math.random() * 120;
  const calma = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (calma) {
    CORVO.stato = 'posa';   // chi ha chiesto calma: appollaiato accanto alla firma
    CORVO.el.style.left = 'auto';
    CORVO.el.style.right = '14px';
    CORVO.el.style.bottom = '30px';
    return;
  }
  CORVO.stato = 'cammina';
  CORVO.el.classList.add('cammina');
  CORVO.prossimaMossa = performance.now() / 1000 + 2 + Math.random() * 2;
  requestAnimationFrame(loopCorvo);
}

function limitiCorvo() {
  const w = CORVO.el.parentElement.clientWidth;
  return { min: 6, max: Math.max(60, w - 46) };
}

function entraStato(stato, durata) {
  CORVO.stato = stato;
  CORVO.durata = durata || 0;
  CORVO.inStatoDa = 0;
  const el = CORVO.el;
  el.classList.remove('cammina', 'becca');
  el.classList.toggle('vola', stato === 'volo' || stato === 'partito');
  if (stato === 'cammina') el.classList.add('cammina');
  if (stato === 'becca') el.classList.add('becca');
  if (stato === 'volo') {
    const lim = limitiCorvo();
    CORVO.voloDa = CORVO.x;
    CORVO.dir = -CORVO.dir;                 // traversata: si cambia sponda
    CORVO.voloA = CORVO.dir === 1 ? lim.max - 8 : lim.min + 8;
    if (Math.abs(CORVO.voloA - CORVO.voloDa) < 100) CORVO.voloA = CORVO.dir === 1 ? lim.min + 8 : lim.max - 8;
    CORVO.voloDur = 1.3 + Math.random() * 0.9;
  }
}

function loopCorvo(nowMs) {
  const t = nowMs / 1000;
  const dt = Math.min((t - (CORVO.tPrec ?? t)) || 0.016, 0.05);
  CORVO.tPrec = t;
  CORVO.inStatoDa += dt;

  if (CORVO.stato === 'cammina') {
    CORVO.x += CORVO.dir * 24 * dt;
    const lim = limitiCorvo();
    if (CORVO.x >= lim.max) { CORVO.dir = -1; }
    if (CORVO.x <= lim.min) { CORVO.dir = 1; }
    if (t >= CORVO.prossimaMossa) {
      const dadi = Math.random();
      if (dadi < 0.32) entraStato('fermo', 1.5 + Math.random() * 3);
      else if (dadi < 0.58) entraStato('becca', 0.9);
      else if (dadi < 0.72) entraStato('salto', 0.46);
      else if (dadi < 0.86) entraStato('volo', 0);
      else CORVO.prossimaMossa = t + 2 + Math.random() * 4;
    }
  } else if (CORVO.stato === 'fermo' || CORVO.stato === 'becca' || CORVO.stato === 'salto') {
    if (CORVO.inStatoDa >= CORVO.durata) {
      entraStato('cammina', 0);
      CORVO.prossimaMossa = t + 2 + Math.random() * 5;
    }
  } else if (CORVO.stato === 'volo') {
    const q = Math.min(CORVO.inStatoDa / CORVO.voloDur, 1);
    CORVO.x = CORVO.voloDa + (CORVO.voloA - CORVO.voloDa) * q;
    CORVO.alt = Math.sin(q * Math.PI) * -70;   // l’arco pigro di chi plana
    if (q >= 1) { CORVO.alt = 0; entraStato('fermo', 1 + Math.random() * 2); }
  }
  // partito e posa: nessun passo — le transizioni CSS fanno il viaggio

  if (CORVO.stato !== 'partito') {
    CORVO.el.style.transform = 'translate(' + CORVO.x.toFixed(1) + 'px,' + CORVO.alt.toFixed(1) + 'px)';
  }
  if (CORVO.dir !== CORVO.dirVista) {
    CORVO.dirVista = CORVO.dir;
    CORVO.svg.style.transform = 'scaleX(' + CORVO.dir + ')';
  }
  requestAnimationFrame(loopCorvo);
}

function corvoParte() {
  const el = CORVO.el;
  entraStato('partito', 0);
  CORVO.dir = 1;
  CORVO.dirVista = 0;    // si gira verso il cielo prima di salire
  el.style.transition = 'transform 1.2s ease-in, opacity 1.2s ease-in';
  el.style.opacity = '0';
  el.style.transform = 'translate(' + Math.min(CORVO.x + 150, 999) + 'px,-320px)';
  setTimeout(corvoTorna, 3400);
}

function corvoTorna() {
  const el = CORVO.el;
  if (!CORVO.attivo || CORVO.stato !== 'partito') return;
  const lim = limitiCorvo();
  CORVO.x = lim.min + 4;
  el.style.transition = 'none';
  el.style.transform = 'translate(' + CORVO.x + 'px,-320px)';
  void el.offsetWidth;   // respiro: il volo di ritorno parte da fermo, ma da lassù
  el.style.transition = 'transform 1.5s ease-out, opacity .6s ease-out';
  el.style.opacity = '1';
  el.style.transform = 'translate(' + CORVO.x + 'px,0px)';
  setTimeout(function () {
    el.style.transition = '';
    CORVO.alt = 0;
    entraStato('cammina', 0);
    CORVO.prossimaMossa = performance.now() / 1000 + 3 + Math.random() * 4;
  }, 1600);
}

// gli eventi parlano al corvo: cosa fa quando il mondo si muove
function corvoReagisci(cosa) {
  if (!CORVO.attivo) return;
  if (CORVO.stato === 'posa' || CORVO.stato === 'partito') return; // appollaiato o già in viaggio
  if (cosa === 'partenza') { corvoParte(); return; }
  if ((cosa === 'arrivo' || cosa === 'festa') && CORVO.stato !== 'volo') { entraStato('volo', 0); return; }
  if (cosa === 'occhiata') {
    CORVO.el.classList.add('becca');
    setTimeout(function () { if (CORVO.el) CORVO.el.classList.remove('becca'); }, 650);
    return;
  }
}

function toccoCorvo() {
  if (CORVO.stato === 'partito') return;   // è in cielo: non si disturbano i voli di servizio
  const frasi = [t('corvoFrase1'), t('corvoFrase2'), t('corvoFrase3'), t('corvoFrase4')];
  const frase = frasi[CORVO.frasiViste % frasi.length];
  CORVO.frasiViste++;
  const vecchia = CORVO.el.querySelector('.corvo-bolla');
  if (vecchia) vecchia.remove();
  const bolla = document.createElement('div');
  bolla.className = 'corvo-bolla';
  bolla.textContent = frase;
  CORVO.el.appendChild(bolla);
  setTimeout(function () { if (bolla.parentNode) bolla.remove(); }, 7000);
  if (CORVO.stato === 'cammina' || CORVO.stato === 'fermo') {
    CORVO.el.classList.add('salta');
    setTimeout(function () { if (CORVO.el) CORVO.el.classList.remove('salta'); }, 450);
  }
}

// ===== SSE (real-time) =====
// toast: chiudi al click (delegato, vale per tutti i toast-corvo)
document.addEventListener('click', (e) => {
  const t = e.target.closest && e.target.closest('.toast-corvo');
  if (t && !t.classList.contains('spegni')) {
    t.classList.add('spegni');
    setTimeout(() => t.remove(), 450);
  }
});

function avviaSSE() {
  if (!utente) return;
  if (evtSource) evtSource.close();

  evtSource = new EventSource(API + '/api/events?provincia=' + encodeURIComponent(utente.provincia) + '&id=' + utente.id);

  evtSource.addEventListener('connesso', e => {
    console.log('SSE connesso:', JSON.parse(e.data));
  });

  // V8.25: il corvo porta le notizie di chi gestisce Pyxis a TUTTI gli utenti
  evtSource.addEventListener('corvo-messaggio', e => {
    const d = JSON.parse(e.data);
    if (typeof corvoParte === 'function') corvoParte();   // il corvo spicca il volo
    // bolla con la notizia quando torna
    setTimeout(() => {
      if (!CORVO.el) return;
      const vecchia = CORVO.el.querySelector('.corvo-bolla');
      if (vecchia) vecchia.remove();
      const bolla = document.createElement('div');
      bolla.className = 'corvo-bolla';
      bolla.textContent = '🐦‍⬛ ' + d.testo;
      CORVO.el.appendChild(bolla);
      setTimeout(() => { if (bolla.parentNode) bolla.remove(); }, 7000);
    }, 3600);
    // messaggio del corvo: resta finché non lo tocchi (niente auto-chiusura)
    document.querySelectorAll('.toast-corvo[data-msg="1"]').forEach(t => t.remove());
    const toast = document.createElement('div');
    toast.className = 'toast-corvo';
    toast.setAttribute('data-msg', '1');
    toast.innerHTML = '<div class="toast-corpo">🐦‍⬛ ' + d.testo.replace(/</g, '&lt;') + '<small>tocca per la bussola</small></div>';
    toast.addEventListener('click', () => { toast.classList.add('spegni'); setTimeout(() => toast.remove(), 380); });
    document.body.appendChild(toast);
  });

  evtSource.addEventListener('nuovo-utente', e => {
    const d = JSON.parse(e.data);
    console.log('Nuovo utente:', d);
    caricaLancette();
  });

  // una stella si è posata: qualcuno in provincia ha raggiunto un luogo
  evtSource.addEventListener('poi-visitato', e => {
    const d = JSON.parse(e.data);
    if (d.da === utente.nome) return; // la mia stella l\'ho già vista
    const toast = document.createElement('div');
    toast.className = 'toast-veloce';
    toast.textContent = '⭐ ' + d.da + ' ha raccolto una stella: ' + d.poi;
    corvoReagisci('occhiata'); // V8.24: una stella altrove — il corvo annusa l\'aria
    document.querySelector('.screen').appendChild(toast);
    setTimeout(() => toast.classList.add('spegni'), 5000);
    setTimeout(() => toast.remove(), 5600);
  });

  // un corvo è planato: lettera in arrivo
  evtSource.addEventListener('lettera', e => {
    const d = JSON.parse(e.data);
    if (d.destinatario_id !== utente.id) return;
    corvoReagisci('arrivo'); // V8.24: il corvo traversa rapido — qualcosa è giunto
    const toast = document.createElement('div');
    toast.className = 'toast-veloce';
    toast.textContent = '🐦‍⬛ Un corvo è planato: lettera da ' + d.da;
    toast.addEventListener('click', () => toast.remove());
    document.querySelector('.screen').appendChild(toast);
    setTimeout(() => toast.classList.add('spegni'), 5000);
    setTimeout(() => toast.remove(), 5600);
  });

  // una voce nuova è arrivata in piazza (da qualunque provincia)
  evtSource.addEventListener('voce', e => {
    corvoReagisci('occhiata'); // V8.24: una voce nuova — il corvo drizza il becco
    const modale = document.getElementById('modale-piazza');
    if (modale && !modale.classList.contains('nascosto')) apriPiazza();
  });

  evtSource.onerror = () => {
    console.log('SSE disconnesso, riconnetto...');
  };
}
