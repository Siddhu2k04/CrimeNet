@echo off
title CrimNet AI - Dependency Installer
cd /d "%~dp0"
echo ===================================================================
echo   Installing CrimNet AI Dependencies (Backend & Frontend)
echo ===================================================================
echo.
echo [1/2] Installing Backend Dependencies...
cd /d "%~dp0backend"
if not exist ".venv" (
    py -m venv .venv 2>nul || python -m venv .venv
)
.\.venv\Scripts\python.exe -m pip install --upgrade pip
.\.venv\Scripts\pip.exe install -r requirements.txt

echo.
echo [2/2] Installing Frontend Dependencies...
cd /d "%~dp0frontend"
call npm install

echo.
echo ===================================================================
echo   Setup Complete! You can now launch using run.bat
echo ===================================================================
pause
