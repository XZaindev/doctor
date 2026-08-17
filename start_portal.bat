@echo off
title Anemia Research Portal - Ibn Sina Center
cd /d "%~dp0\web-app"
echo ========================================================
echo   IBN SINA CENTER - ANEMIA RESEARCH STUDY PORTAL
echo ========================================================
echo   Starting local web server on http://localhost:5173 ...
echo ========================================================
start "" "http://localhost:5173"
npm run dev
pause
