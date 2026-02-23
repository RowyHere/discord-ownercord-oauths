@echo off
set args1=%1
set args2=%2
set args3=%3

pm2 start --time --namespace "oc-auth" --name "OwnerCord-%args1%" ../../OwnerCord_AuthV3/Client/OwnerManager_Auth.js -- "%args2%" "%args3%" false
pm2 logs "OC-%args1%"