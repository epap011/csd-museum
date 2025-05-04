FROM nginx:alpine

COPY . /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf
COPY ./certs /etc/nginx/certs

EXPOSE 80
EXPOSE 443
