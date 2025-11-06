# Base image nginx for webserver
FROM docker.io/library/nginx:alpine
# Copy the html and js files to the proper place
COPY index.html /usr/share/nginx/html/index.html
COPY dashboard.js /usr/share/nginx/html/dashboard.js
# run nginx as non-root (nginx alpine uses nginx user)