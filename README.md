# 🍹 Kuddel & Maren — Getränkekarte

Festliche, mobil-optimierte Getränkekarte zur großen Feier von **Knuth („Kuddel") & Maren**:
🎉 Kuddels 50. Geburtstag · 💍 16. Hochzeitstag · 💜 30 Jahre zusammen.

Statische Single-Page-Website im 80s/90s-Neon-Synthwave-Look. Gäste kommen per QR-Code auf die Seite.

**Live:** https://kuddel-maren.die-beaus.de

## Struktur

```
index.html         Single Page (Hero + Getränkekarte)
css/styles.css     Neon-Styling, mobile-first
js/data.js         Getränkedaten  ← hier Getränke bearbeiten
js/app.js          Rendering, Sticky-Nav, Konfetti
favicon.svg        Emoji-Favicon
qr/                QR-Code + druckbarer Aufsteller
Dockerfile         nginx:alpine (für Coolify)
nginx.conf         gzip + Cache-Header
```

## Getränke ändern

Alles steht in [`js/data.js`](js/data.js) — einfach Einträge in den `items`-Listen
anpassen, ergänzen oder löschen, committen, pushen. Coolify deployt automatisch.

## Lokal anschauen

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

Auf dem Handy testen: Browser-DevTools → Geräte-Emulation (iPhone/Android).

## QR-Code

Der QR-Code zeigt auf die Domain. Neu erzeugen (z. B. nach Domain-Änderung):

```bash
bash qr/generate-qr.sh      # benötigt: pip install --user segno  (oder brew install qrencode)
```

Druckbarer Aufsteller (A6): [`qr/qr-print.html`](qr/qr-print.html) im Browser öffnen →
Button „Drucken / als PDF speichern".

## Deployment (Coolify)

1. **GitHub:** Repo anlegen und pushen
   ```bash
   git init && git add -A && git commit -m "Initial: Getränkekarte"
   git branch -M main
   gh repo create kuddel-maren --private --source=. --remote=origin --push
   ```
2. **Coolify:** Neue Resource → *Public/Private Repository* → dieses Repo wählen.
   Build Pack = **Dockerfile**, Branch = `main`, *Auto-Deploy on push* aktivieren.
3. **Domain:** in Coolify `kuddel-maren.die-beaus.de` eintragen → SSL (Let's Encrypt) automatisch.
4. **DNS:** Subdomain `kuddel-maren` per A-/AAAA-Record (oder CNAME) auf den Coolify-Host zeigen lassen.

### Docker lokal testen (optional)

```bash
docker build -t kuddel .
docker run --rm -p 8080:80 kuddel
# → http://localhost:8080
```
