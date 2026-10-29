// Province italiane (capoluoghi) — lista completa
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

// Popola il select province
document.addEventListener('DOMContentLoaded', function() {
  var select = document.getElementById('provincia');
  PROVINCE.forEach(function(p) {
    var opt = document.createElement('option');
    opt.value = p;
    opt.textContent = p;
    select.appendChild(opt);
  });

  // Selezione tipologia (una sola)
  var selezionata = null;
  document.querySelectorAll('.tipologia').forEach(function(t) {
    t.addEventListener('click', function() {
      document.querySelectorAll('.tipologia').forEach(function(x) { x.classList.remove('sel'); });
      this.classList.add('sel');
      selezionata = this.dataset.tipo;
    });
  });

  // Bottone "Apri la bussola"
  document.getElementById('btn-inizia').addEventListener('click', function() {
    var nome = document.getElementById('nome').value.trim();
    var provincia = document.getElementById('provincia').value;

    // Validazione minima
    if (!nome) { alert('Scegli un nome d\'arte'); return; }
    if (!selezionata) { alert('Scegli la tua via'); return; }
    if (!provincia) { alert('Scegli la provincia'); return; }

    // Salva in localStorage (demo: niente backend)
    localStorage.setItem('pyxis-utente', JSON.stringify({
      nome: nome,
      tipo: selezionata,
      provincia: provincia,
      quando: new Date().toISOString()
    }));

    // Mostra la bussola
    document.getElementById('schermata-iscrizione').classList.remove('attiva');
    document.getElementById('schermata-bussola').classList.add('attiva');
    document.getElementById('sottotitolo-utente').textContent =
      nome + ' · ' + provincia + ' · la bussola gira';
  });

  // Se già iscritto, vai diretto alla bussola
  var salvato = localStorage.getItem('pyxis-utente');
  if (salvato) {
    var u = JSON.parse(salvato);
    document.getElementById('schermata-iscrizione').classList.remove('attiva');
    document.getElementById('schermata-bussola').classList.add('attiva');
    document.getElementById('sottotitolo-utente').textContent =
      u.nome + ' · ' + u.provincia + ' · bentornato';
  }

  // Legenda cliccabile (seleziona lancetta)
  document.querySelectorAll('.legenda-item').forEach(function(item) {
    item.addEventListener('click', function() {
      document.querySelectorAll('.legenda-item').forEach(function(i) { i.classList.remove('sel'); });
      this.classList.add('sel');
      var tipo = this.dataset.tipo;
      document.querySelectorAll('.lancetta').forEach(function(l) { l.style.opacity = '0.15'; });
      var sel = document.querySelector('.lancetta.' + tipo);
      if (sel) sel.style.opacity = '1';
    });
  });
});
