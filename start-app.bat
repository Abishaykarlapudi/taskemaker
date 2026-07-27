@echo off
title TaskMaker - Bloom's Taxonomy App (Port 4001)
echo ========================================================
echo   Starting TaskMaker Daily Task & Bloom Engine on Port 4001...
echo ========================================================
echo.
cd /d "%~dp0"
npm run dev -- --host 0.0.0.0 --port 4001
pause
