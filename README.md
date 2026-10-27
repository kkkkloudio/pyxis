# 🌙 Il Crocevia

> *Un luogo dove le luci si incontrano. Niente GPS, niente nomi veri: il cielo non misura le distanze.*

[![License: MIT](https://img.shields.io/badge/License-MIT-gold.svg)](LICENSE)
[![PWA](https://img.shields.io/badge/PWA-ready-purple.svg)]()
[![Deploy](https://img.shields.io/badge/deploy-GitHub%20Pages-blue.svg)](.github/workflows/deploy.yml)

Una Progressive Web App (PWA) in italiano, pensata per essere **installabile** come app nativa su telefono, con tema notturno, SVG animati e un'esperienza mobile-first.

## ✨ Caratteristiche

- 📱 **PWA completa**: installabile su iOS e Android, funziona offline
- 🌌 **Tema notturno/stellato**: sfondo animato con stelle e nebulosa
- 🔮 **Interfaccia SVG interattiva**: clicca sulle "luci" nel cielo per scoprire chi sono
- 🎭 **4 archetipi**: Strega, Stregone, Sciamano, o "Nessuna via" (punto anonimo)
- 🕯️ **Segnali rituali**: candele, fumo, fiamme — un linguaggio simbolico non verbale
- 🔔 **Lettere della comunità**: annunci rituali (es. Samhain)
- 🛡️ **Privacy by design**: niente GPS, niente nomi veri, niente tracciamento
- 🌐 **Italiano**: interfaccia e contenuti in italiano

## 🚀 Demo

Apri l'app: **[https://TUO-USERNAME.github.io/il-crocevia](https://TUO-USERNAME.github.io/il-crocevia)**

*(Sostituisci `TUO-USERNAME` con il tuo username GitHub dopo il deploy.)*

## 📲 Installazione come app

### Android (Chrome)
1. Apri il sito
2. Tocca il banner "Aggiungi Il Crocevia alla schermata Home" oppure menu ⋮ → "Installa app"

### iOS (Safari)
1. Apri il sito in Safari
2. Tocca il pulsante **Condividi** 📤
3. Scorri e tocca **"Aggiungi a Home"**
4. Tocca "Aggiungi"

## 🛠️ Sviluppo locale

```bash
# Clona il repository
git clone https://github.com/TUO-USERNAME/il-crocevia.git
cd il-crocevia

# Servi con qualsiasi server statico, es:
python -m http.server 8000
# oppure
npx serve .
```

Poi apri `http://localhost:8000`

> **Nota**: il Service Worker (e quindi la modalità offline) funziona solo su `https://` o `localhost`. Su GitHub Pages è già HTTPS, nessun problema.

## 📁 Struttura del progetto

```
il-crocevia/
├── index.html          # App principale (tutto in un file)
├── manifest.json       # Configurazione PWA
├── sw.js               # Service Worker (offline, push, sync)
├── icons/              # Icone PWA (tutte le dimensioni)
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── ...
│   ├── icon-512x512.png
│   ├── icon-maskable-512x512.png
│   ├── apple-touch-icon.png
│   └── favicon-*.png
├── .github/
│   └── workflows/
│       └── deploy.yml  # Deploy automatico su GitHub Pages
├── LICENSE             # Licenza MIT
└── README.md           # Questo file
```

## 🔧 Personalizzazione

### Cambiare i contenuti
Modifica direttamente `index.html`:
- **Testi delle "lettere"**: cerca `<div class="letter">`
- **Presenze nel cielo (souls)**: modifica l'oggetto `souls` nello `<script>` e i `<g class="soul">` nell'SVG
- **Fase lunare**: cambia il testo in `.moonchip`
- **Colori**: modifica le variabili CSS in `:root` o direttamente nel body

### Aggiungere una nuova "luce" (soul)
```html
<!-- Nell'SVG field, aggiungi: -->
<g class="soul" data-id="nomeunico">
  <circle class="starglow" cx="X" cy="Y" r="13" fill="#8f7dd8" opacity=".27"/>
  <use href="#i-strega" x="X-12" y="Y-12" width="24" height="24"/>
</g>

<!-- Nel JavaScript, aggiungi: -->
souls.nomeunico = {
  name: "Nome · archetipo",
  sub: "Descrizione...",
  act: "Azione da mostrare"
};
```

### Cambiare le icone
Sostituisci i file in `icons/`. Le dimensioni minime richieste per una PWA: **192x192** e **512x512**.

## 🚢 Deploy su GitHub Pages

1. **Crea un repository** su GitHub (pubblico, nome: `il-crocevia`)
2. **Push del codice**:
   ```bash
   git init
   git add .
   git commit -m "🌙 Primo commit: Il Crocevia v1.0"
   git branch -M main
   git remote add origin https://github.com/TUO-USERNAME/il-crocevia.git
   git push -u origin main
   ```
3. **Abilita GitHub Pages**: Settings → Pages → Source: "GitHub Actions"
4. Il workflow `.github/workflows/deploy.yml` deploya automaticamente ad ogni push su `main`

## 🤝 Contribuire

1. Fai un fork del repository
2. Crea un branch (`git checkout -b feature/nuova-funzione`)
3. Committa le modifiche (`git commit -m 'Aggiungi nuova funzione'`)
4. Push (`git push origin feature/nuova-funzione`)
5. Apri una Pull Request

## 📜 Licenza

[MIT License](LICENSE) — fai quello che vuoi, basta che lasci il copyright.

## 🙏 Ringraziamenti

- I font di sistema (Georgia, Palatino) per l'atmosfera
- La tradizione dell'Almanacco Veneto per i contenuti rituali
- Tutti coloro che accendono una candela da soli, a casa propria

---

<p align="center">
  <i>niente GPS · niente nomi veri · il cielo non misura le distanze</i>
</p>
