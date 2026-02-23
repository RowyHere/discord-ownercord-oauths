@echo off

pm2 start --time --namespace "oc-api" --name "OwnerCord-API" ./index.js
pm2 start --time --namespace "oc-checker" --name "OwnerCord-Checker API" ./checker.js

pm2 logs "OwnerCord-API"