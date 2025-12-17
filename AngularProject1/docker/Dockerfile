
# Étape finale: juste Nginx servant le build Angular
FROM nginx:alpine

# Copier la config Nginx
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copier le contenu du dist
COPY dist/AngularProject1/browser /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Healthcheck simple (optionnel)
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -qO- http://localhost/ || exit 1
