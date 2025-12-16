
# Étape finale: juste Nginx servant le build Angular
FROM nginx:alpine

# Copier la config Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier le contenu du dist
COPY ../dist/AngularProject1 /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Healthcheck simple (optionnel)
HE
