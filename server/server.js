// Pyxis — Backend reale (zero dipendenze, solo Node.js)
// - Database: node:sqlite (integrato)
// - Real-time: SSE (Server-Sent Events)
// - API: POST /api/register, GET /api/lancette, GET /api/events
//        POST /api/lettera (il corvo), GET /api/lettere (la posta)
//        POST /api/checkin (le stelle), GET /api/collezione
//        GET /api/poi, GET /api/utenti (debug)
// - V8.13: LA PIAZZA — le voci di tutte le anime: POST /api/voce, GET /api/voci
// - V8.14: FEEDBACK — parola ai costruttori: POST /api/feedback (si legge dal DB)
// - V5: lancette flip — grande=luogo di potere (POI), media=prima anima, piccola=seconda anima
// - V5: check-in — PIETRA ANGOLARE: mai trattenere, salvare o trasmettere la
//        posizione dell\'utente. Il confronto GPS avviene SOLO sul telefono:
//        al server arriva unicamente { utente_id, poi_id }. Nessuna coordinata
//        dell\'utente esiste nel DB. Le colonne lat/lon della tabella poi sono
//        coordinate di LUOGHI PUBBLICI, non di persone.
// - V6: direzione vera — le lancette puntano la ROTTA tra luoghi pubblici
//        (capoluoghi e POI), mai tra persone. Anime: le più vicine ovunque,
//        misurate tra capoluoghi. Stessa provincia = nessuna rotta possibile:
//        angolo d\'albergo, dolce e fisso per coppia.
// - V8.7: presenze vere (Opzione A) — una presenza conta solo se il suo
//        cuore batte da meno di 5 minuti. Nessuna anima "appesa" resta nella
//        legenda: tab chiusa male, telefono morto o riavvio del server non
//        lasciano più fantasmi. Se nessuno è davvero online, media e piccola
//        restano spente (il client le lascia vagare, come da canone VIVA).
// - V8.9: la mappa si riempie — due luoghi per provincia (15 POI totali).
//        Venezia finalmente in mappa (Bovolo + Poveglia). Coordinate stimate
//        da rifinire a mano. NOTA: l\'id 'poi-ve-ponte' (Ponte Scaligero) ha
//        il prefisso VE ma il luogo è a VERONA — non rinominarlo: con
//        INSERT OR IGNORE un id nuovo creerebbe una riga doppia nel DB.
// - V8.10: le porte d\'Italia — RIF_PROVINCIA copre tutte le 107 province:
//        le anime vicine puntano con la rotta vera da qualunque capoluogo.
// - V8.11: le stanze del Nord, prima ondata — 14 nuovi POI (Trentino,
//        Friuli-Venezia Giulia, Valle d\'Aosta): 29 luoghi in tutto.
// - V8.20: le stanze della Lombardia — 24 nuovi POI (12 province, 2 ciascuna):
//        53 luoghi in tutto. Seed idempotente: INSERT OR IGNORE.
// - V8.21: i custodi dei luoghi — colonne livello / custode_nome /
//        custode_racconto sulla tabella poi (migrazione automatica anche sui
//        DB esistenti). I luoghi PROFONDI (livello 2) hanno uno spirito che
//        accoglie l\'anima al check-in e narra la leggenda in prima persona.
//        Piloti: la Segnaressa (Rotonda), il Medico della Peste (Poveglia),
//        il Re Laurino (Catinaccio). /api/checkin restituisce il custode, se c\'è.
// - V8.21, secondo giro: il custode è RICONTATTABILE. Parla a OGNI check-in
//        sul luogo profondo (anche a chi è già passato), ogni volta con una
//        parola diversa: ogni custode ha più racconti, che ruotano col numero
//        di ascolti di quell\'anima su quel luogo (tabella ascolti). In più
//        GET /api/custode fa risentire la voce senza rifare il check-in:
//        la fiammella risponde dal luogo, quante volte l\'anima la chiede.
// - V8.22: le stanze del Piemonte — 16 nuovi POI (8 province, 2 ciascuna):
//        69 luoghi in tutto. E LA CHIAVE AL CANCELLO: GET /api/custode ora
//        risponde solo a chi ha già posato la stella su quel luogo.
// - V8.23: le stanze di Liguria e Emilia-Romagna — 26 nuovi POI (13 province,
//        2 ciascuna): 95 luoghi in tutto. Il Nord d\'Italia è completo. Il seed
//        resta idempotente: INSERT OR IGNORE, id mai toccati.

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

  CREATE TABLE IF NOT EXISTS voci (
    id TEXT PRIMARY KEY,
    utente_id TEXT NOT NULL,
    nome TEXT NOT NULL,
    testo TEXT NOT NULL,
    creata_il TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS feedback (
    id TEXT PRIMARY KEY,
    utente_id TEXT NOT NULL,
    nome TEXT NOT NULL,
    testo TEXT NOT NULL,
    creata_il TEXT NOT NULL
  );
`);

// Migrazione: se un DB già esistente non ha lat/lon sui POI, aggiungile
const colonnePoi = db.prepare('PRAGMA table_info(poi)').all().map(c => c.name);
if (!colonnePoi.includes('lat')) db.exec('ALTER TABLE poi ADD COLUMN lat REAL');
if (!colonnePoi.includes('lon')) db.exec('ALTER TABLE poi ADD COLUMN lon REAL');
if (!colonnePoi.includes('evidenza')) db.exec('ALTER TABLE poi ADD COLUMN evidenza INTEGER NOT NULL DEFAULT 0');
// V8.21 — I CUSTODI DEI LUOGHI: livello 1 = luogo comune (stella e via),
// livello 2 = luogo PROFONDO, con lo spirito che accoglie l\'anima.
if (!colonnePoi.includes('livello')) db.exec('ALTER TABLE poi ADD COLUMN livello INTEGER NOT NULL DEFAULT 1');
if (!colonnePoi.includes('custode_nome')) db.exec('ALTER TABLE poi ADD COLUMN custode_nome TEXT');
if (!colonnePoi.includes('custode_racconto')) db.exec('ALTER TABLE poi ADD COLUMN custode_racconto TEXT');

// La parola di accesso (23/11): le anime nate prima di lei non ce l'hanno.
// Migrazione dolce come tutte le altre: il DB esistente non si tocca mai.
const colonneUtenti = db.prepare('PRAGMA table_info(utenti)').all().map(c => c.name);
if (!colonneUtenti.includes('password')) db.exec('ALTER TABLE utenti ADD COLUMN password TEXT');

// POI reali d\'Italia (luoghi di potere/naturali con leggenda) — Veneto completo,
// + prima ondata del Nord (Trentino, Friuli, Valle d\'Aosta), + Lombardia completa (V8.20),
// + il Piemonte completo (V8.22). Si espande regione per regione.
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

  // V8.20 — le stanze della Lombardia (20/11/2026): 2 POI per provincia, 12 province.
  // Leggende verificate una per una via ricerca; coordinate = stime da cartografo pigro
  // (più incerte: Isolino Virginia, Bagni di Masino, Castel Masegra, Cornabusa).
  ['poi-mi-ossa', 'San Bernardino alle Ossa', 'Milano', 'La cappelletta ossario di Milano: pareti e volte ricamate di ossa e teschi. La leggenda li vuole caduti contro l\'eresia ariana, e il re del Portogallo amò tanto questo luogo da replicarlo a Évora', 45.4663, 9.1886, null],
  ['poi-mi-ambrogio', 'Colonna del Diavolo', 'Milano', 'Davanti alla basilica di Sant\'Ambrogio: la leggenda vuole che qui il diavolo lottò col santo e conficcò le corna nella pietra. I segni si vedono ancora', 45.4617, 9.1870, null],
  ['poi-mb-duomo', 'Duomo di Monza', 'Monza e della Brianza', 'Nell\'altare della Cappella di Teodolinda riposa la Corona Ferrea: sei piastre d\'oro e, secondo il mito, un ferro che sarebbe un chiodo della Vera Croce. È la corona con cui si incoronavano re e imperatori', 45.5845, 9.2755, null],
  ['poi-mb-castello', 'Castello di Monza', 'Monza e della Brianza', 'Il castello degli ultimi re d\'Italia: qui, la notte del 29 luglio 1900, il re Umberto I fu ucciso. Le mura ricordano ancora', 45.594, 9.271, null],
  ['poi-bg-cornabusa', 'Santuario della Cornabusa', 'Bergamo', 'Una chiesa ipogea ricavata in una grotta della Valle Imagna, con una sorgente che stilla dalla roccia: unico nel suo genere in Lombardia, fede e mistero sotto la pietra', 45.875, 9.560, null],
  ['poi-bg-serio', 'Cascate del Serio', 'Bergamo', 'I tre salti d\'acqua tra i più alti d\'Italia, 315 metri che cadono in un fiato: la leggenda racconta di una spada perduta e del lago del Barbellino che ancora la custodisce', 45.985, 9.874, null],
  ['poi-bs-naquane', 'Rupi di Naquane', 'Brescia', 'Le rose camune e gli oranti del Parco delle incisioni: a Capo di Ponte migliaia di anni di preghiere incise nella pietra, allineate ai tramonti e agli equinozi', 46.027, 10.345, null],
  ['poi-bs-ceriola', 'Santuario della Ceriola', 'Brescia', 'Sulla cima di Monte Isola, il santuario guarda tutto il lago d\'Iseo: un\'isola di pescatori che porta in vetta una corona', 45.723, 10.066, null],
  ['poi-co-comacina', 'Isola Comacina', 'Como', 'L\'isola maledetta del Lario: bruciata e distrutta nel 1169, da otto secoli nessuno ci abita più. Si guarda in silenzio dalla riva di Ossuccio', 45.889, 9.138, null],
  ['poi-co-faro', 'Faro Voltiano', 'Como', 'La torre di Brunate dedicata ad Alessandro Volta: di notte la sua luce tricolore attraversa il buio del lago per chilometri e chilometri', 45.826, 9.197, null],
  ['poi-cr-torrazzo', 'Torrazzo di Cremona', 'Cremona', 'La torre che misura il cielo: il suo orologio astronomico del 1583 disegna un quadrante di otto metri con lune, stelle e zodiaco', 45.133, 10.026, null],
  ['poi-cr-soncino', 'Rocca di Soncino', 'Cremona', 'La rocca viscontea con il fossato pieno d\'acqua: un fortilizio che ha visto passare eserciti e ora custodisce solo il vento sul borgo', 45.273, 9.862, null],
  ['poi-lc-grigna', 'Grigna Settentrionale', 'Lecco', 'La Regina del Lario: la leggenda racconta di una guerriera bellissima e temibile, e la montagna non l\'ha mai smentita', 45.895, 9.390, null],
  ['poi-lc-pescarenico', 'Borgo di Pescarenico', 'Lecco', 'Il borgo dei pescatori sulla sponda dell\'Adda: la terra di Renzo e Lucia, dove i Promessi Sposi attraversano il fiume della storia', 45.845, 9.372, null],
  ['poi-lo-incoronata', 'Tempio dell\'Incoronata', 'Lodi', 'Il capolavoro del Rinascimento lombardo, voluto dalla città intera nel 1488: un tempio civico coi voti dei lodigiani alle pareti', 45.314, 9.503, null],
  ['poi-lo-basilica', 'Basilica di Lodi Vecchio', 'Lodi', 'Sulla vecchia Laus Pompeia: tra le famiglie del luogo si tramanda un tunnel segreto che scendeva verso la nuova città. Storia o leggenda: il sottosuolo non dice', 45.298, 9.459, null],
  ['poi-mn-te', 'Palazzo Te', 'Mantova', 'La casa dei giganti di Giulio Romano: chi entra nella sala in cui tutto rovina addosso capisce perché «non si pensi alcuno di vedere mai opera di pennello più orribile e spaventosa»', 45.155, 10.798, null],
  ['poi-mn-sabbioneta', 'Sabbioneta', 'Mantova', 'La Città Ideale di Vespasiano Gonzaga: un sogno di pietra disegnato come una stella, patrimonio dell\'umanità', 45.093, 10.484, null],
  ['poi-pv-certosa', 'Certosa di Pavia', 'Pavia', 'Il monastero che i duchi vollero come portale del cielo: cinque secoli di silenzio, marmo e preghiera', 45.215, 9.140, null],
  ['poi-pv-ponte', 'Ponte Coperto', 'Pavia', 'Cinque arcate sul Ticino: si narra che qui San Bernardo vide il cielo aperto, e il suo compagno lo vide chiuso dal coppo del ponte', 45.1848, 9.1535, null],
  ['poi-so-masegra', 'Castel Masegra', 'Sondrio', 'L\'unico dei tre castelli di Sondrio scampato allo smantellamento del 1639: domina ancora l\'imbocco della Valmalenco', 46.169, 9.788, null],
  ['poi-so-masino', 'Bagni di Masino', 'Sondrio', 'Le antiche terme nella foresta della Val Masino: acque che rompono il gelo della montagna da secoli, tra pareti e cascate', 46.250, 9.640, null],
  ['poi-va-sacromonte', 'Sacro Monte di Varese', 'Varese', 'Quattordici cappelle dei misteri del Rosario salgono al santuario, dal 1604: un cammino disegnato che è patrimonio UNESCO', 45.824, 8.844, null],
  ['poi-va-isolino', 'Isolino Virginia', 'Varese', 'L\'isoletta del lago di Varese dove vive un villaggio di palafitte: la preistoria riemerge dall\'acqua a pochi metri dalla riva', 45.766, 8.806, null],

  // V8.22 — le stanze del Piemonte (20/11/2026): 2 POI per provincia, 8 province.
  // Leggende verificate una per una via ricerca; coordinate = stime da cartografo pigro
  // (più incerte: Macugnaga, Isola Bella, Rifreddo, Lago della Vecchia).
  ['poi-to-statuto', 'Piazza Statuto, la Porta dell\'Inferno', 'Torino', 'Il vertice oscuro di Torino, angolo italiano del triangolo di magia nera che la leggenda unisce a Londra e San Francisco. Qui i Romani giustiziavano i condannati: l\'antica Vallis Occisorum. E un tombino dei giardini, si mormora, copre la vera porta dell\'inferno', 45.0731, 7.6682, null],
  ['poi-to-mole', 'Mole Antonelliana', 'Torino', 'La torre che voleva toccare il cielo: nata come tempio, cresciuta per tutta la vita di Antonelli, consegnata alla città come una promessa di 167 metri. Torino se la porta in tasca', 45.0690, 7.6932, null],
  ['poi-vc-lucedio', 'Abbazia di Lucedio', 'Vercelli', 'L\'abbazia sorta tra le nebbie delle risaie: dicono che i monaci non se ne siano mai andati davvero. C\'è una colonna che piange, una cripta murata e un silenzio che non spiega niente', 45.2042, 8.2728, null],
  ['poi-vc-santandrea', 'Basilica di Sant\'Andrea', 'Vercelli', 'Sotto la basilica, narra la leggenda, si nasconde un lago sotterraneo. E in cima ai 65 metri del campanile veglia da secoli il gallo di ferro, a cui il popolo attribuisce più di una profezia', 45.3272, 8.4197, null],
  ['poi-no-sangiulio', 'Isola di San Giulio', 'Novara', 'L\'isola che fu un drago: la leggenda vuole che vivesse qui una sierpe immensa, e che San Giulio la incatenasse con la sola voce. Da allora il silenzio è legge, e l\'isola lo custodisce', 45.7979, 8.3950, null],
  ['poi-no-gaudenzio', 'Cupola di San Gaudenzio', 'Novara', 'La guglia che Antonelli spianò qui prima di sognare la Mole: 121 metri di struttura che sale a spirale, visibile dalle Alpi alle risaie. Novara la chiama il suo cuore', 45.4453, 8.6219, null],
  ['poi-cn-vicoforte', 'Santuario di Vicoforte', 'Cuneo', 'Nato da un pilone con una Madonna dipinta perché le fornaci cuocessero bene i mattoni, cresciuto fino alla cupola ellittica più grande del mondo. La Ra Madòna copre una valle intera di preghiere', 44.3658, 7.8495, null],
  ['poi-cn-rifreddo', 'Rifreddo, il borgo delle masche', 'Cuneo', 'Il paese ai piedi del Mombracco che ha fatto delle masche piemontesi la propria identità: streghe che sfidano il sale e la folgore, e notti in cui il borgo si accende di racconti', 44.5900, 7.4150, null],
  ['poi-at-consavia', 'San Pietro in Consavia', 'Asti', 'Il battistero ottagonale che ripete in mattoni il Santo Sepolcro di Gerusalemme: pietre cavaliere, e un battesimo che da nove secoli non finisce di stupire', 44.9026, 8.2133, null],
  ['poi-at-sansecondo', 'Collegiata di San Secondo', 'Asti', 'Il patrono soldato: convertito e martire nel 119 d.C., custodito sopra l\'altare da mille anni. Una volta l\'anno Asti lo porta in processione, e la città si reconoci tutta intorno', 44.8989, 8.2064, null],
  ['poi-al-cittadella', 'Cittadella di Alessandria', 'Alessandria', 'La stella di mattoni voluta dai Savoia nel 1732: una delle più grandi fortezze d\'Europa, mai battuta in battaglia. Napoleone ne ordinò il taglio, e la sua lenta agonia dura da allora', 44.9119, 8.6303, null],
  ['poi-al-bollente', 'La Bollente', 'Alessandria', 'La fonte che bolle in mezzo alla piazza di Acqui: 75 gradi portati in superficie da duemila anni. La leggenda vuole che i neonati vi fossero tuffati per un istante: per questo gli aquei si chiamano sgaientò, gli scottati', 44.7613, 8.4743, null],
  ['poi-bi-oropa', 'Sacro Monte di Oropa', 'Biella', 'La conca che protegge la Madonna Nera: un santuario a 1159 metri, dodici cappelle e la pace delle montagne che lo abbracciano. I pellegrini salgono da ottocento anni', 45.6538, 8.0286, null],
  ['poi-bi-lagovecchia', 'Lago della Vecchia', 'Biella', 'Il lago di alta quota in Valle Cervo: il nome è tutta una leggenda, di una vecchia che il destino lasciò quassù. Un fazzoletto d\'acqua a 2116 metri, specchio di vento', 45.6140, 7.9720, null],
  ['poi-vb-macugnaga', 'Macugnaga', 'Verbania', 'Il borgo walser ai piedi della parete regina del Monte Rosa: le leggende parlano di nani dai piedi rivoltati all\'indietro, e in Val Quarazza di un lago delle Fate che custodisce l\'oro strappato alla montagna', 45.9605, 7.9585, null],
  ['poi-vb-isolabella', 'Isola Bella', 'Verbania', 'Il vascello di pietra dei Borromeo: dieci terrazze a poppa di galeone, grotte artificiali di conchiglie e liocorni. Un palazzo partito per un viaggio che non è mai finito', 45.8872, 8.5310, null],

  // V8.23 — le stanze di Liguria e Emilia-Romagna (20/11/2026): 2 POI per
  // provincia, 4 liguri + 9 emiliano-romagnole. Con questa ondata il Nord
  // d\'Italia è completo. Leggende verificate una per una via ricerca;
  // coordinate = stime da cartografo pigro (più incerte: Tino, Bussana, Canossa).
  ['poi-ge-lanterna', 'Lanterna di Genova', 'Genova', 'Il faro simbolo della Superba, il più alto del Mediterraneo, accende i suoi fuochi da nove secoli. La tradizione racconta che il primo costruttore venne gettato nel vuoto dalla cima, perché non potesse replicare altrove un\'opera così perfetta. Dal 1543 veglia sul porto', 44.4135, 8.8825, null],
  ['poi-ge-sanlorenzo', 'Cattedrale di San Lorenzo', 'Genova', 'Nel tesoro del duomo riposa il Sacro Catino, il piatto di vetro verde che la leggenda identifica col Graal dell\'Ultima Cena. E nella navata destra è esposta la bomba della RAF del 1941: sfondò il tetto e non esplose. I genovesi la chiamano la grazia di San Lorenzo', 44.4077, 8.9302, null],
  ['poi-im-bussana', 'Bussana Vecchia', 'Imperia', 'Il borgo che il terremoto del 1887 colpì durante la messa: la volta della chiesa crollò sui fedeli, e i sopravvissuti fondarono Bussana Nuova. Per ottant\'anni rimase fantasma, poi gli artisti lo risvegliarono tra le rovine', 43.8559, 7.7817, null],
  ['poi-im-triora', 'Triora, il borgo delle streghe', 'Imperia', 'Il paese della caccia alle streghe più famosa d\'Italia: nella carestia del 1588 venti donne finirono nelle carceri di Ca\' de Baggiure, torturate e accusate di ogni male. Ogni agosto la festa Strigora riporta i loro nomi a tutta la valle', 43.9600, 7.7161, null],
  ['poi-sp-portovenere', 'Portovenere, Chiesa di San Pietro', 'La Spezia', 'Il promontorio che fu tempio di Venere, e dal suo nome nacque il nome del borgo. Sotto la chiesa a strisce bianche e nere si apre la grotta dove Lord Byron nuotava di notte, attraversando il golfo per arrivare a Lerici', 44.0643, 9.8440, null],
  ['poi-sp-tino', 'Isola del Tino, San Venerio', 'La Spezia', 'L\'eremita che nel 610 si ritirò su quest\'isola e accendeva fuochi sulla cima per guidare i naviganti nelle notti senza luna: il primo farista d\'Italia, patrono del golfo. La leggenda lo vuole anche domatore del drago di Capo Corvo, sprofondato nel mare', 44.0344, 9.8506, null],
  ['poi-sv-priamar', 'Fortezza del Priamar', 'Savona', 'Il promontorio dove sorgeva la Savona medievale, rasa al suolo dalla Repubblica di Genova dopo la resa: sopra le macerie della città sconfitta i vincitori innalzarono la fortezza. Camminandoci si cammina su una città sepolta', 44.3070, 8.4811, null],
  ['poi-sv-misericordia', 'Santuario della Misericordia', 'Savona', 'Il 18 marzo 1536 la Madonna apparve al contadino Antonio Botta nella valle del Letimbro, mentre Savona stava per soccombere a Genova: il messaggio fu «misericordia e non giustizia». Divenne patrona della città e di tutta la Repubblica', 44.2863, 8.4622, null],
  ['poi-bo-garisenda', 'Torre Garisenda', 'Bologna', 'La torre che pende come un gigante incerto, e che Dante scelse come paragone nel pozzo dei giganti dell\'Inferno: chi passa sotto la sua ombra cammina dentro un verso della Commedia', 44.4943, 11.3436, null],
  ['poi-bo-petronio', 'Basilica di San Petronio', 'Bologna', 'Sul pavimento della navata sinistra corre la linea del sole progettata da Cassini nel 1655: la meridiana più lunga del mondo, 66,8 metri che misurano ancora oggi il mezzogiorno dentro una chiesa mai finita', 44.4936, 11.3422, null],
  ['poi-fe-estense', 'Castello Estense', 'Ferrara', 'La rocca circondata dall\'acqua dove nel 1425 morirono la giovane Parisina e il suo figliastro Ugo, giustiziati entrambi per volere di Niccolò III. La leggenda vuole che lei ritorni ancora, di notte, a cercare il suo giovane amore perduto', 44.8375, 11.6200, null],
  ['poi-fe-schifanoia', 'Palazzo Schifanoia', 'Ferrara', 'Il Salone dei Mesi è un calendario di astrologia in affresco: dodici mesi, i segni dello zodiaco, i decani e gli dèi che governano i giorni, voluti da Borso d\'Este. Un orologio celeste dipinto nel cielo di una sala', 44.8397, 11.6186, null],
  ['poi-fc-malatestiana', 'Biblioteca Malatestiana', 'Forlì-Cesena', 'La prima biblioteca civica d\'Europa, voluta da Malatesta Novello nel 1452: i codici incatenati ai plutei dell\'Aula del Nuti, esattamente come cinque secoli fa. Patrimonio UNESCO: qui il Rinascimento non è mai finito', 44.1394, 12.2439, null],
  ['poi-fc-ravaldino', 'Rocca di Ravaldino', 'Forlì-Cesena', 'La rocca di Caterina Sforza, la tigre di Forlì: nel 1499 la difese armi in pugno contro l\'esercito di Cesare Borgia, mentre i notabili della città trattavano la resa. Cadde, ma la tigre entrò nella leggenda', 44.2217, 12.0430, null],
  ['poi-mo-ghirlandina', 'Torre Ghirlandina', 'Modena', 'La torre custodisce nella Sala della Secchia il ricordo della guerra più strana d\'Italia: nel 1325 modenesi e bolognesi si batterono a Zappolino per una secchia rubata da un pozzo. Il bottino di legno fece più rumore di duemila caduti', 44.6458, 10.9253, null],
  ['poi-mo-nonantola', 'Abbazia di Nonantola', 'Modena', 'L\'abbazia fondata da sant\'Anselmo nel 752, con la cripta a sessantaquattro colonne e l\'altare che custodisce le reliquie di papa San Silvestro. Tra le sue pergamene firmano anche Carlo Magno e Matilde di Canossa', 44.6792, 11.0018, null],
  ['poi-pr-battistero', 'Battistero di Parma', 'Parma', 'L\'ottagono rosa di Benedetto Antelami: dentro, quattordici statue raccontano i mesi e le stagioni, e lo zodiaco corre sotto la cupola dipinta. Un cielo di pietra che misura il tempo', 44.8017, 10.3274, null],
  ['poi-pr-torrechiara', 'Castello di Torrechiara', 'Parma', 'Il castello d\'amore: Pier Maria Rossi lo costruì per Bianca Pellegrini, e la Camera d\'Oro ne affresca la glorificazione. L\'unico ciclo medievale italiano interamente dedicato all\'amor cortese tra due persone vere', 44.4806, 10.2581, null],
  ['poi-pc-gropparello', 'Castello di Gropparello', 'Piacenza', 'La leggenda di Rosania: la castellana che cedette all\'antico amore Lancillotto mentre il marito era in guerra, e tornando lui la murò viva. La sua donna bianca vagherebbe ancora le stanze della rocca sulla gola della Val Chiavenna', 44.8172, 9.7059, null],
  ['poi-pc-pontegobbo', 'Ponte Gobbo di Bobbio', 'Piacenza', 'Il ponte gobbo sul Trebbia, undici archi disuguali come una colonna rotta: la leggenda vuole che sia stato il diavolo a innalzarlo in una notte, per un patto con san Colombano che il santo volle e poi raggirò. Undici arcate di signoria e di mistero', 44.8414, 9.3817, null],
  ['poi-ra-dante', 'Tomba di Dante', 'Ravenna', 'L\'ultimo rifugio del poeta esule. Le sue ossa sono scomparse e ricomparse per due secoli: nascoste dai frati nel 1810, ritrovate per caso in una parete nel 1865, nascoste ancora nel 1944 e restituite. Firenze chiede di riaverle: Ravenna non sente', 44.4183, 12.2016, null],
  ['poi-ra-gallaplacidia', 'Mausoleo di Galla Placidia', 'Ravenna', 'Lo scrigno dei mosaici più antichi dell\'Occidente: la volta è un cielo di stelle azzurre così profondo che si dice abbia ispirato la notte di Cole Porter. L\'imperatrice che volle questo cielo non ci riposa da nessuna parte', 44.4190, 12.2030, null],
  ['poi-re-canossa', 'Castello di Canossa', 'Reggio Emilia', 'La rocca di Matilde dove nel 1077 l\'imperatore Enrico IV attese tre giorni nella neve, scalzo e in cilizio, perché il papa gli sciogliesse la scomunica. Un re in ginocchio, e una contessa che decideva i destini d\'Europa', 44.5652, 10.4376, null],
  ['poi-re-ghiara', 'Tempio della Beata Vergine della Ghiara', 'Reggio Emilia', 'Il 29 aprile 1596 il giovane Marchino, muto e sordo dalla nascita, ritrovò parola e udito davanti all\'immagine dipinta sul cantone. La città rispose alzando un tempio, che ancora custodisce quell\'immagine', 44.6984, 10.6320, null],
  ['poi-ri-malatestiano', 'Tempio Malatestiano', 'Rimini', 'La chiesa-mausoleo di Sigismondo Malatesta e del suo amore Isotta: papa Pio II lo processò in contumacia e ne bruciò l\'immagine in piazza a Roma, come a un eretico. Il tempio non fu mai finito, e la sua ombra non si è mai inginocchiata', 44.0620, 12.5730, null],
  ['poi-ri-sanleo', 'Forte di San Leo', 'Rimini', 'La rocca sullo strapiombo dove morì nel 1795 il conte di Cagliostro, l\'alchimista più chiacchierato d\'Europa, rinchiuso in una cella scavata nella roccia e senza porta: si entrava solo dal pertugio sopra la testa. Da San Leo non si scappa, e lui non ne uscì', 43.8986, 12.3403, null],

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

// V8.21 — I CUSTODI DEI LUOGHI: i POI profondi (livello 2) accolgono chi si
// posa nel cerchio con la voce dello spirito del posto, che narra la leggenda
// in prima persona. Aggiornamento idempotente come il resto del seed (solo
// UPDATE sui POI esistenti: gli id non si toccano MAI). Le voci si aggiungono
// a ondate, come le stanze. Decisa da Carlo: non tutti i POI la meritano —
// solo i luoghi più profondi. Gli altri restano muti: stella e via.
// Secondo giro della stessa sera: il custode è ricontattabile. Ogni custode
// ha PIÙ racconti (custode_racconto = array JSON); a ogni ascolto la voce
// cambia, in rotazione. Chi torna non è mai zittito: lo spirito ha sempre
// una parola nuova per l\'anima che ritorna.
const custodiSeed = [
  ['poi-ro-rotonda', 'La Segnaressa', [
    "Ah. Un\'altra anima che arriva col fiatato del Po in gola. Quando qui non c\'era nessun tempio, questo prato era nostro: noi, il vento, i roghi d\'erba. Poi alzarono l\'ottagono, e le nostre feste impararono a farsi piccole, come le fiammelle di un altare. Ma ascolta: sotto il pavimento, la terra batte ancora il tempo. Vieni a notte fatta, con rispetto, e forse mi vedrai girare tra le colonne. E non dire a nessuno che ti ho parlato: alle segnaresse non piace essere citate.",
    "Torna, che qui si parla meglio la seconda volta. Conta le mie colonne un giorno: otto facce, come otto erano le erbe del nostro sabato, come otto i nodi della fune. I muratori hanno scelto l\'ottagono credendo di averlo inventato loro: glielo ha suggerito la terra, che ha la memoria lunga e non si smentisce mai. E quando il Po entra nel delta e si perde, io lo sento da qui: corre sui tetti come un gatto nero. Tu non lo sentiresti. Sei giovane di orecchio.",
    "In inverno questo prato è mio e di nessun altro. Le sorelle arrivano coi baroni nei piedi e la luna in bocca, e ci si scalda come si può: col rogo dell\'erba secca e con le parole. Tu me ne hai portate, di parole, anima di ritorno, e questo conta più della legna. Tieni la stella che ti sei guadagnata, e se ti chiedono del calore di stanotte di' pure che era il vento del Po. Il vento scusa tutto, da queste parti."
  ]],
  ['poi-ve-poveglia', 'Il Medico della Peste', [
    "Metti via quel sorriso, viandante: quest\'isola non accoglie, archivia. Io arrivai con la maschera piena d\'erbe e il campanello all\'ordine. La febbre non chiedeva i nomi, e io li scrivevo tutti, tutti, perché nessuno andasse perso. La laguna qui è fatta di cenere: l\'erba che calpesti è vite. Gira in barca, anima, e saluta: ci sono luoghi che si visitano solo raccontandoli. E ora qualcuno l\'ha fatto, grazie a te.",
    "Senti la campana? No, non la senti: sotto il mare di cenere dormono ancora le mie bordone. Io camminavo il perimetro col campanello alla cintura, e i vivi si facevano piccoli al passaggio. Non per paura di me: per pietà di sé stessi. Sai cosa si diceva allora? Meglio il lago che il lazzaretto. E invece furono tutti e due. Gira, anima. E quando passi sopra il punto dove il canale finisce, ringrazia piano: per ognuno dei numeri che non conterai mai, c\'è una riga scritta da me.",
    "Poi venne il secolo dei mattoni, e sopra le mie spalle alzarono l\'ospedale. Pazzi, li chiamavano, e li chiudevano qui perché la laguna dimentica in fretta. Io me ne stavo nelle fondamenta e ascoltavo le voci arrivare dai piani alti: sapevano tutte la stessa canzone, la canzone di chi è stato archiviato. Nel sessantotto chiusero anche quella porta. Da allora l\'isola ha smesso di mentire: è semplicemente ciò che era. Un archivio. E io ne sono l\'usciere."
  ]],
  ['poi-bz-laurino', 'Re Laurino', [
    "Ehilà, anima! Sei venuto per l\'enrosadira, vero? Il mio giardino di rose che brucia di rosa ogni sera, quando la luce non è più giorno e non è ancora notte. Lo piantai io, per amore. Poi gli uomini mi presero il regno, e il cielo mi volle beffare: «Che tu non possa essere visto né di giorno né di notte». Ecco perché il mio rosso dura soltanto in quell\'ora sospesa. Goditela. E sappi che dietro ogni rosa che ammiri c\'è un re che brontola ancora.",
    "Vuoi sapere quando vengo meglio? A sera, quando il sole si mette di lato e il cielo non sa più se coprirsi o scoprirsi. Capirai anche tu, allora, il valore degli spiragli: «Né di giorno né di notte», mi dissero. Un re sepolto sotto il prato le sentenze le capisce al volo. Per questo l\'enrosadira non è la mia vendetta: è la mia fuga. Di' a chi sale il Catinaccio che ogni rosa è la pietra di una notte scappata. Ma dillo piano: il cielo ha l\'udito fine.",
    "Ti ho mai raccontato perché proprio rose? Erano l\'unica cosa che i miei nani non riuscivano a forgiare nell\'oro. Le portai su dalla valle più in basso e le piantai tra i monti, perché la roccia imparasse la tenerezza. Poi vennero a prendermi in tanti, per una fanciulla che non voleva essere mia. Persi il giardino, persi il regno: il tempo si tenne tutto. E la tenerezza color fragola che vedi ogni sera è l\'unica moneta che il tempo mi rende indietro."
  ]],
];
// custode_racconto contiene l\'ARRAY dei racconti in JSON: idempotente come
// tutto il seed (un solo UPDATE per riga, gli id non si toccano MAI).
const insCustode = db.prepare('UPDATE poi SET livello = 2, custode_nome = ?, custode_racconto = ? WHERE id = ?');
for (const c of custodiSeed) {
  insCustode.run(c[1], JSON.stringify(c[2]), c[0]);
}

// ---- La voce che ruota (V8.21, secondo giro) ----
// Quante volte QUESTA anima ha ascoltato QUESTO custode: serve a dare ogni
// volta un racconto diverso. Solo un contatore: nome, luogo e numero. Nessuna
// posizione, nessun testo dell\'utente. Coerente con la pietra angolare.
db.exec(`CREATE TABLE IF NOT EXISTS ascolti (
  utente_id TEXT NOT NULL,
  poi_id TEXT NOT NULL,
  volte INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (utente_id, poi_id)
);`);
const insAscolto = db.prepare('INSERT INTO ascolti (utente_id, poi_id, volte) VALUES (?, ?, 1) ON CONFLICT(utente_id, poi_id) DO UPDATE SET volte = volte + 1');
const leggiAscolti = db.prepare('SELECT volte FROM ascolti WHERE utente_id = ? AND poi_id = ?');

// custode_racconto come array: se arriva da un DB vecchio con testo semplice,
// vale come racconto unico e funziona lo stesso.
function raccontiDi(p) {
  if (!p.custode_racconto) return [];
  try {
    const v = JSON.parse(p.custode_racconto);
    if (Array.isArray(v)) return v.filter(x => typeof x === 'string' && x.trim());
    return [String(v)];
  } catch (e) { return [p.custode_racconto]; }
}

// Il custode PARLA: incrementa gli ascolti e restituisce il racconto in
// rotazione (primo ascolto = primo racconto, poi il secondo, il terzo, e di
// nuovo il primo). Se il luogo non è profondo o è muto, restituisce null.
function parlaCustode(p, utenteId) {
  if (!p || (p.livello || 1) < 2 || !p.custode_nome) return null;
  const racconti = raccontiDi(p);
  if (!racconti.length) return null;
  insAscolto.run(utenteId, p.id);
  const volte = leggiAscolti.get(utenteId, p.id).volte;
  return { nome: p.custode_nome, racconto: racconti[(volte - 1) % racconti.length], totale: racconti.length };
}

// ============ LA DIREZIONE VERA ============
// Capoluoghi: punti di riferimento PUBBLICI per le rotte della bussola.
// Precisione da cartografo pigro (~km): per un ago è più che sufficiente.
// Le 107 porte d\'Italia (V8.10): tutte le province, tutte le rotte.
// I luoghi di potere arrivano dopo, regione per regione: dove non sono ancora
// mappati, l\'ago grande vaga e le anime puntano comunque con la rotta vera.
const RIF_PROVINCIA = {
  // Valle d\'Aosta
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

// Angolo d\'albergo per chi è vicinissimo: piccolo scarto fisso per coppia (±25°),
// deterministico — due anime vicine non si sovrappongono mai, e ogni giorno è uguale.
function scartoStabile(idA, idB) {
  const h = crypto.createHash('md5').update(String(idA) + ':' + String(idB)).digest('hex');
  return (parseInt(h.slice(0, 2), 16) / 255) * 50 - 25;
}

// ============ LA PAROLA DI ACCESSO ============
// Il login del 23/11: il nome è l'identità, la parola la custode della collezione.
// Non vive MAI in chiaro nel DB: solo sale + hash scrypt (node:crypto, zero
// dipendenze, come tutto il backend). Nessuna posizione resta coinvolta:
// arriva un nome e una parola, torna lo stesso utente di sempre.
function hashPassword(pw) {
  const sale = crypto.randomBytes(16).toString('hex');
  const h = crypto.scryptSync(pw, sale, 32).toString('hex');
  return sale + ':' + h;
}
function verificaPassword(pw, conservata) {
  if (!conservata || conservata.indexOf(':') === -1) return false;
  const [sale, h] = conservata.split(':');
  return crypto.scryptSync(pw, sale, 32).toString('hex') === h;
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
// (es. 2026-11-14T15:57:19.945Z): la soglia va confrontare per ORDINE
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

// Spazzata all\'avvio (ripulisce i fantasmi del passato) e poi ogni minuto.
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

// V8.13 — LA PIAZZA: il cerchio delle voci è di TUTTE le province, non di una sola
let ultimoMessaggioCorvo = null; // {testo, alle} — l'ultimo avviso del corvo
function broadcastTutti(event, data) {
  if (event === 'corvo-messaggio') ultimoMessaggioCorvo = data;
  const msg = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const c of clients) {
    try { c.res.write(msg); } catch (e) { clients.delete(c); }
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

  // ---- POST /api/register ---- (iscrizione O rientro)
  // Il nome è l'identità dell'anima; la parola d'accesso protegge lei e la
  // sua collezione di stelle: chi rientra da qualunque telefono ritrova tutto.
  // Prima anima a presentarsi: nasce con la parola. Anima già esistente con
  // la parola giusta: rientro. Anima esistente nata PRIMA della parola: il
  // primo che rientra la rivendica (utenti vecchi: seed e conti di test).
  // Pietra angolare intatta: qui non passa e non si salva nessuna posizione.
  if (path === '/api/register' && req.method === 'POST') {
    try {
      const body = await readBody(req);
      const nome = String(body.nome || '').trim();
      const provincia = String(body.provincia || '');
      const password = typeof body.password === 'string' ? body.password : '';

      if (!nome || nome.length < 2 || nome.length > 20) return json(res, 400, { error: 'Nome non valido (2-20 caratteri)' });
      if (!provincia) return json(res, 400, { error: 'Provincia mancante' });
      if (password.length < 4 || password.length > 64) return json(res, 400, { error: 'La parola d\'accesso vuole da 4 a 64 caratteri' });

      const now = new Date().toISOString();
      const esiste = db.prepare('SELECT id, nome, tipo, provincia, password FROM utenti WHERE nome = ?').get(nome);

      if (esiste) {
        if (!esiste.password) {
          db.prepare('UPDATE utenti SET password = ?, ultimo_accesso = ? WHERE id = ?')
            .run(hashPassword(password), now, esiste.id);
        } else if (!verificaPassword(password, esiste.password)) {
          return json(res, 403, { error: 'Questo nome appartiene a un\'altra anima: la parola non è quella giusta' });
        } else {
          db.prepare('UPDATE utenti SET ultimo_accesso = ? WHERE id = ?').run(now, esiste.id);
        }
        db.prepare('INSERT OR REPLACE INTO presenze (utente_id, provincia, online_da) VALUES (?, ?, ?)')
          .run(esiste.id, esiste.provincia, now);
        return json(res, 200, { ok: true, rientro: true, utente: { id: esiste.id, nome: esiste.nome, tipo: esiste.tipo, provincia: esiste.provincia } });
      }

      const id = crypto.randomUUID();
      db.prepare('INSERT INTO utenti (id, nome, tipo, provincia, password, creato_il, ultimo_accesso) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .run(id, nome, 'utente', provincia, hashPassword(password), now, now);
      db.prepare('INSERT OR REPLACE INTO presenze (utente_id, provincia, online_da) VALUES (?, ?, ?)')
        .run(id, provincia, now);
      broadcast(provincia, 'nuovo-utente', { nome, tipo: 'utente', provincia });
      return json(res, 201, { ok: true, utente: { id, nome, tipo: 'utente', provincia } });
    } catch (e) {
      return json(res, 500, { error: e.message });
    }
  }

  // ---- POST /api/lettera ---- (il corvo: lettera al vicino)
  if (path === '/api/lettera' && req.method === 'POST') {
    try {
      const body = await readBody(req);
      const { mittente_id, destinatario_id, testo } = body;

      if (!mittente_id || !destinatario_id) return json(res, 400, { error: 'Mittente o destinatario mancanti' });
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

  // ---- POST /api/voce ---- (LA PIAZZA: un pensiero lasciato nel cerchio, per tutte le anime)
  if (path === '/api/voce' && req.method === 'POST') {
    try {
      const body = await readBody(req);
      const { utente_id, testo } = body;
      if (!utente_id) return json(res, 400, { error: 'Anima mancante' });
      if (!testo || !testo.trim()) return json(res, 400, { error: 'La voce è vuota' });
      if (testo.trim().length > 280) return json(res, 400, { error: 'La voce è troppo lunga (max 280 caratteri)' });

      const u = db.prepare('SELECT nome FROM utenti WHERE id = ?').get(utente_id);
      if (!u) return json(res, 404, { error: 'Anima sconosciuta' });

      // la piazza respira: un pensiero al minuto per anima, niente tempeste
      const ultima = db.prepare('SELECT creata_il FROM voci WHERE utente_id = ? ORDER BY creata_il DESC LIMIT 1').get(utente_id);
      if (ultima && (Date.now() - new Date(ultima.creata_il).getTime()) < 60000) {
        return json(res, 429, { error: 'La piazza respira: un pensiero ogni minuto' });
      }

      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      db.prepare('INSERT INTO voci (id, utente_id, nome, testo, creata_il) VALUES (?, ?, ?, ?, ?)')
        .run(id, utente_id, u.nome, testo.trim(), now);

      broadcastTutti('voce', { da: u.nome, testo: testo.trim() });
      return json(res, 201, { ok: true });
    } catch (e) {
      return json(res, 500, { error: e.message });
    }
  }

  // ---- GET /api/voci ---- (LA PIAZZA: le ultime 30 voci, di tutte le province)
  if (path === '/api/voci' && req.method === 'GET') {
    const voci = db.prepare('SELECT nome, testo, creata_il FROM voci ORDER BY creata_il DESC LIMIT 30').all();
    return json(res, 200, { voci });
  }

  // ---- POST /api/feedback ---- (parola ai costruttori: Carlo e Hermes la leggono dal DB)
  if (path === '/api/feedback' && req.method === 'POST') {
    try {
      const body = await readBody(req);
      const { utente_id, testo } = body;
      if (!utente_id) return json(res, 400, { error: 'Anima mancante' });
      if (!testo || !testo.trim()) return json(res, 400, { error: 'Il messaggio è vuoto' });
      if (testo.trim().length > 1000) return json(res, 400, { error: 'Il messaggio è troppo lungo (max 1000 caratteri)' });

      const u = db.prepare('SELECT nome FROM utenti WHERE id = ?').get(utente_id);
      if (!u) return json(res, 404, { error: 'Anima sconosciuta' });

      const id = crypto.randomUUID();
      db.prepare('INSERT INTO feedback (id, utente_id, nome, testo, creata_il) VALUES (?, ?, ?, ?, ?)')
        .run(id, utente_id, u.nome, testo.trim(), new Date().toISOString());
      return json(res, 201, { ok: true });
    } catch (e) {
      return json(res, 500, { error: e.message });
    }
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
    // del check-in: sono coordinate di luoghi pubblici, non la posizione dell\'utente.
    const poi = db.prepare('SELECT id, nome, descrizione, provincia, lat, lon FROM poi WHERE provincia = ? ORDER BY evidenza DESC, id LIMIT 1').get(provincia);

    // La rotta della lancetta grande: dal capoluogo della mia provincia
    // verso il luogo di potere. Luoghi pubblici, zero posizioni di persone.
    const mioRif = RIF_PROVINCIA[provincia] || null;
    const angoloLuogo = (poi && mioRif && poi.lat != null && poi.lon != null)
      ? rotta(mioRif[0], mioRif[1], poi.lat, poi.lon)
      : 0; // geografia non ancora mappata: il luogo batte a nord

    // Le anime: le più vicine ovunque (distanza tra capoluoghi, non tra persone).
    // Stessa provincia = distanza zero = nessuna rotta possibile: angolo d\'albergo.
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
  // Nessuna coordinata dell\'utente viene mai accettata, salvata o loggata:
  // la verifica della vicinanza avviene interamente sul telefono del client.
  if (path === '/api/checkin' && req.method === 'POST') {
    try {
      const body = await readBody(req);
      const { utente_id, poi_id } = body;

      if (!utente_id || !poi_id) return json(res, 400, { error: 'utente o luogo mancanti' });

      const u = db.prepare('SELECT id, nome, provincia FROM utenti WHERE id = ?').get(utente_id);
      if (!u) return json(res, 404, { error: 'Anima sconosciuta' });
      // V8.21: si legge anche il custode, se il luogo è profondo
      const p = db.prepare('SELECT id, nome, livello, custode_nome, custode_racconto FROM poi WHERE id = ?').get(poi_id);
      if (!p) return json(res, 404, { error: 'Luogo sconosciuto' });

      const gia = db.prepare('SELECT 1 FROM visite WHERE utente_id = ? AND poi_id = ?').get(utente_id, poi_id);
      // V8.21, secondo giro: chi torna NON è più zittito. La stella è una
      // volta sola, ma la voce del custode torna sempre, e sempre diversa.
      if (gia) return json(res, 200, { ok: true, gia_visitato: true, nome: p.nome, custode: parlaCustode(p, utente_id) });

      db.prepare('INSERT INTO visite (utente_id, poi_id, visitato_il) VALUES (?, ?, ?)')
        .run(utente_id, poi_id, new Date().toISOString());

      const stelle = db.prepare('SELECT COUNT(*) AS n FROM visite WHERE utente_id = ?').get(utente_id).n;

      broadcast(u.provincia, 'poi-visitato', { da: u.nome, poi: p.nome });

      // V8.21: se il luogo è profondo e ha un custode, l\'anima lo incontra.
      // Secondo giro: la voce ruota, parlaCustode sceglie il racconto giusto.
      const custode = parlaCustode(p, utente_id);

      return json(res, 201, { ok: true, gia_visitato: false, nome: p.nome, stelle, custode });
    } catch (e) {
      return json(res, 500, { error: e.message });
    }
  }

  // ---- GET /api/custode?poi_id=X&utente_id=Y ---- (V8.21, secondo giro:
  // risentire la voce senza rifare il check-in. La fiammella risponde dal
  // luogo, quante volte l\'anima la chiede. Solo contatore di ascolti: zero
  // posizioni, come sempre.)
  if (path === '/api/custode' && req.method === 'GET') {
    const poiId = url.searchParams.get('poi_id');
    const utenteId = url.searchParams.get('utente_id');
    if (!poiId || !utenteId) return json(res, 400, { error: 'utente o luogo mancanti' });

    const u = db.prepare('SELECT id FROM utenti WHERE id = ?').get(utenteId);
    if (!u) return json(res, 404, { error: 'Anima sconosciuta' });
    const p = db.prepare('SELECT id, nome, livello, custode_nome, custode_racconto FROM poi WHERE id = ?').get(poiId);
    if (!p) return json(res, 404, { error: 'Luogo sconosciuto' });

    // V8.22 — LA CHIAVE AL CANCELLO: la fiammella parla solo a chi ha già
    // posato la stella in questo luogo. Il bottone client appare comunque
    // solo dopo un check-in, ma ora è l\'API stessa a fare la guardia.
    const visitato = db.prepare('SELECT 1 FROM visite WHERE utente_id = ? AND poi_id = ?').get(utenteId, poiId);
    if (!visitato) return json(res, 403, { error: 'La fiammella parla solo a chi ha già posato la stella in questo luogo' });

    const custode = parlaCustode(p, utenteId);
    if (!custode) return json(res, 404, { error: 'Il custode di questo luogo non parla' });

    return json(res, 200, { ok: true, nome: p.nome, custode });
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

  // ---- POST /api/corvo-messaggio ---- (admin: il corvo porta le notizie a tutti)
  if (path === '/api/corvo-messaggio' && req.method === 'POST') {
    const auth = (req.headers['authorization'] || '').replace('Bearer ', '');
    const token = process.env.CORVO_ADMIN_TOKEN || '';
    if (!token || auth !== token) return json(res, 401, { error: 'non autorizzato' });
    try {
      const body = await readBody(req);
      const testo = String(body.testo || '').trim().slice(0, 300);
      if (!testo) return json(res, 400, { error: 'testo mancante' });
      broadcastTutti('corvo-messaggio', { testo, alle: new Date().toISOString() });
      return json(res, 200, { ok: true, utenti: clients.size });
    } catch (e) {
      return json(res, 500, { error: e.message });
    }
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
    if (ultimoMessaggioCorvo) {  // replay sempre finché esiste un messaggio
      res.write(`event: corvo-messaggio\ndata: ${JSON.stringify(ultimoMessaggioCorvo)}\n\n`);
    }

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
