FROM nginx:alpine

COPY config/nginx/nginx.conf /etc/nginx/nginx.conf
COPY public/ /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/
COPY slides/ /usr/share/nginx/html/slides/

EXPOSE 80
