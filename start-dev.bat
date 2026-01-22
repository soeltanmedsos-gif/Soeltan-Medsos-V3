@echo off
title Soeltan Medsos - Dev Server
echo ========================================
echo   Starting Soeltan Medsos Dev Servers
echo ========================================
echo.
echo [INFO] Logs are being saved to:
echo   - Backend: logs\backend.log
echo   - Frontend: logs\frontend.log
echo.
echo [INFO] To stop servers:
echo   - Run stop-dev.bat
echo   - Or press Ctrl+C here
echo ========================================
echo.

REM Create logs directory if not exists
if not exist logs mkdir logs

REM Clear previous logs
echo Starting Backend... > logs\backend.log
echo Starting Frontend... > logs\frontend.log

REM Start Backend with logging
cd backend
start "Backend Server" /min cmd /c "npm run dev >> ..\logs\backend.log 2>&1"
cd ..

REM Wait for backend to start
timeout /t 3 /nobreak >nul

REM Start Frontend with logging
cd frontend
start "Frontend Server" /min cmd /c "npm run dev >> ..\logs\frontend.log 2>&1"
cd ..

echo.
echo ========================================
echo   Servers Started!
echo ========================================
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:3001
echo ========================================
echo.
echo Logs: Check logs\backend.log and logs\frontend.log
echo Stop:  Run stop-dev.bat or Ctrl+C
echo.
pause
