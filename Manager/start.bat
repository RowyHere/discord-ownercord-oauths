@echo off

pm2 start --time --namespace "oc-manage" --name "OwnerCord-Manager" ./OwnerCord-Manager.js
pm2 logs "OwnerCord-Manager"