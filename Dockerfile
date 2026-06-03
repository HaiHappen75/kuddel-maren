# Statische Getränkekarte, serviert von nginx.
FROM nginx:alpine

# eigene Server-Config (gzip + Cache-Header)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Website-Dateien
COPY index.html favicon.svg /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/  /usr/share/nginx/html/js/
COPY qr/  /usr/share/nginx/html/qr/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
