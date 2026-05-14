FROM nginx:latest

# Remove a configuração padrão que vem no Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia o nosso arquivo default.conf para dentro da pasta do Nginx no container
COPY default.conf /etc/nginx/conf.d/