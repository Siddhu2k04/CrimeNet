@echo off
title CrimNet AI Backend Server
cd /d "%~dp0backend"
echo ===================================================================
echo   Starting CrimNet AI Backend (FastAPI + Graph Analytics Engine)
echo ===================================================================
echo.
if exist ".\.venv\Scripts\python.exe" (
    .\.venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
) else (
    py -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload 2>nul || python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
)
pause
