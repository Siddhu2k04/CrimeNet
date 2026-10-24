@echo off
title CrimNet AI Frontend Dashboard
cd /d "%~dp0frontend"
echo ===================================================================
echo   Starting CrimNet AI Tactical React Knowledge Graph Dashboard
echo ===================================================================
echo.
call npm run dev
pause
