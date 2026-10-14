# Static site served by nginx. Cloud Run sets $PORT; the nginx image fills it into the template.
FROM nginx:1.27-alpine
ENV PORT=8080
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY index.html /usr/share/nginx/html/index.html
COPY css /usr/share/nginx/html/css
COPY js /usr/share/nginx/html/js
COPY assets /usr/share/nginx/html/assets
# make sure nginx can read everything, whatever the file permissions were on the build machine
RUN chmod -R a+rX /usr/share/nginx/html
EXPOSE 8080
