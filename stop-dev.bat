@echo off
echo ========================================
echo   Stopping Soeltan Medsos Dev Servers
echo ========================================
echo.

echo [1/2] Stopping Backend (Port 3001)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3001" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
    if not errorlevel 1 (
        echo [OK] Backend stopped
    )
)

echo [2/2] Stopping Frontend (Port 5173)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
    if not errorlevel 1 (
        echo [OK] Frontend stopped
    )
)

echo.
echo ========================================
echo   All Servers Stopped!
echo ========================================
pause
