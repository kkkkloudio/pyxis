# 🚀 Istruzioni per pubblicare su GitHub

## Passo 1: Crea il repository su GitHub

1. Vai su [github.com/new](https://github.com/new)
2. Nome repository: `adytum`
3. Descrizione: `🌙 Un luogo dove le luci si incontrano — PWA installabile, niente GPS, niente nomi veri`
4. **Pubblico** (Public)
5. ❌ NON aggiungere README, .gitignore o LICENSE (li abbiamo già noi)
6. Clicca **"Create repository"**

## Passo 2: Collega e pusha

Copia i comandi che GitHub ti mostra, oppure usa questi:

```bash
cd C:/Users/Carlo/adytum

git remote add origin https://github.com/TUO-USERNAME/adytum.git
git push -u origin main
```

> Sostituisci `TUO-USERNAME` con il tuo username GitHub.

Se ti chiede username/password, usa:
- Username: il tuo username GitHub
- Password: un **Personal Access Token** (non la password del profilo!)
  - Crea uno qui: [github.com/settings/tokens](https://github.com/settings/tokens) → "Generate new token (classic)" → scope `repo`

## Passo 3: Abilita GitHub Pages

1. Vai su `Settings` → `Pages` (nel menu laterale del repo)
2. In **"Build and deployment"** → **Source**: seleziona **"GitHub Actions"**
3. Salva

Il workflow `.github/workflows/deploy.yml` partirà automaticamente e pubblicherà il sito.

## Passo 4: Il tuo sito è online! 🎉

L'URL sarà:

```
https://TUO-USERNAME.github.io/adytum/
```

## Passo 5: Verifica PWA

1. Apri l'URL dal telefono
2. Dovrebbe apparire il banner "Aggiungi Adytum alla schermata Home"
3. Su Android: tocca "Installa" → l'app appare come app nativa
4. Su iOS: Safari → Condividi 📤 → "Aggiungi a Home"

## 🔧 Dopo il primo deploy

Ogni volta che fai modifiche:

```bash
cd C:/Users/Carlo/adytum
git add .
git commit -m "Descrizione della modifica"
git push
```

Il sito si aggiorna automaticamente in ~1 minuto.

---

## ✅ Checklist pre-pubblicazione

- [ ] Repository creato su GitHub (pubblico, nome `adytum`)
- [ ] `git remote add origin` + `git push -u origin main` eseguito
- [ ] GitHub Pages abilitato (Settings → Pages → GitHub Actions)
- [ ] Sito online su `https://TUO-USERNAME.github.io/adytum/`
- [ ] Testato da telefono: banner di installazione appare
- [ ] Installato come app: icona sulla home, funziona offline
