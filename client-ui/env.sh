#!/bin/sh

##--------------------------------mode prod------------------------------------
echo 's/____VITE_API_URL____/"$VITE_API_URL"/g'
sed -i "s/____VITE_API_URL____/"${VITE_API_URL//\//\\/}"/g" /usr/share/nginx/html/**/*.js
sed -i "s/____VITE_SITE_URL____/"${VITE_SITE_URL//\//\\/}"/g" /usr/share/nginx/html/**/*.js
##--------------------------------prod------------------------------------
