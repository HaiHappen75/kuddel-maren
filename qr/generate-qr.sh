#!/usr/bin/env bash
# Erzeugt den QR-Code (SVG) für die Party-Website.
# Reihenfolge der Tools: segno (Python) -> qrencode -> Hinweis.
set -euo pipefail

URL="https://kuddel-maren.die-beaus.de"
OUT_DIR="$(cd "$(dirname "$0")" && pwd)"
OUT_SVG="$OUT_DIR/kuddel-qr.svg"

# Dunkle Module auf hellem Grund = beste Scan-Sicherheit.
DARK="#190933"
LIGHT="#ffffff"

if python3 -c "import segno" 2>/dev/null; then
  echo "→ erzeuge mit segno: $OUT_SVG"
  python3 - "$URL" "$OUT_SVG" "$DARK" "$LIGHT" <<'PY'
import sys, segno
url, out, dark, light = sys.argv[1:5]
qr = segno.make(url, error="h")  # hohe Fehlerkorrektur (~30%)
qr.save(out, kind="svg", scale=12, border=4, dark=dark, light=light)
print("ok")
PY
elif command -v qrencode >/dev/null 2>&1; then
  echo "→ erzeuge mit qrencode: $OUT_SVG"
  qrencode -t SVG -o "$OUT_SVG" -l H -s 12 -m 4 --foreground="${DARK#\#}" --background="${LIGHT#\#}" "$URL"
else
  echo "Kein QR-Tool gefunden. Installiere eins:"
  echo "   python3 -m pip install --user segno"
  echo "   oder: brew install qrencode"
  exit 1
fi

echo "Fertig: $OUT_SVG  ($URL)"
