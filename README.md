# 🧭 Pyxis

> *Lo scrigno antico che punta. La bussola delle anime: tre lancette, nessuna posizione salvata, niente nomi veri.*

Una web app minimale: **una sola bussola antica** con **tre lancette**.

- **Lancetta grande** → il luogo di potere (POI) più vicino
- **Lancetta media** → l'anima più vicina a te
- **Lancetta piccola dorata** → la seconda anima più vicina

Niente mappe, niente distanze in km. Solo la direzione relativa.

## ✨ Il check-in — «Il luogo è raggiunto»

Quando arrivi sul luogo di potere, premi il bottone: il telefono legge il GPS **una volta sola, nel browser**, calcola la distanza dal POI (raggio ~500 m) **sul dispositivo** e poi al server arriva **solo "visitato: true"**. La stella entra nella tua collezione.

Pietra angolare del progetto:

> **Mai trattenere, salvare o trasmettere la posizione dell'utente.**

Nessuna coordinata dell'utente entra nel server o nel DB. Le coordinate dei POI sono di luoghi pubblici.

## 🚀 Demo

**https://kkkkloudio.github.io/pyxis** (frontend) · backend sul mini PC via tunnel HTTPS

## 📁 Struttura

```
pyxis/
├── index.html          # Tutta l'app (bussola + 3 lancette + modali)
├── app.js              # Logica frontend (bussola, corvo, check-in, collezione)
├── manifest.json       # PWA
├── assets/             # Texture pergamena, bussola, lancette
├── icons/              # Icone bussola (tutte le dimensioni)
└── server/
    └── server.js       # Backend zero-dipendenze (node:sqlite + SSE)
```

## 🛠️ Sviluppo locale

```bash
node server/server.js   # Node 22+ (usa node:sqlite), poi apri http://localhost:3000
```

## 📜 Licenza

MIT
