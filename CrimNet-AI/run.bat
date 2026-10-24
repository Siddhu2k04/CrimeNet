@echo off
title CrimNet AI - Master System Launcher
cd /d "%~dp0"
echo ===================================================================
echo     CRIMNET AI - Criminal Intelligence Knowledge Graph System
echo ===================================================================
echo.
echo Starting Backend and Frontend services...
echo.

start "CrimNet AI Backend" start_backend.bat
timeout /t 2 /nobreak >nul

start "CrimNet AI Frontend" start_frontend.bat
timeout /t 3 /nobreak >nul

start http://localhost:5173

echo.
echo [OK] System successfully initialized!
echo  - Dashboard: http://localhost:5173
echo  - API Docs:  http://localhost:8000/docs
echo.
pause
