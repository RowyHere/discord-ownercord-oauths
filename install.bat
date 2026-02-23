@echo off
set installPackages=API Client Manager
for %%f in (%installPackages%) do (
    cls
    echo Installing %%f
    cd %%f
    npm install
    cd ..
)