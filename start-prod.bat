@echo off
echo ===================================================
echo   SOELTAN MEDSOS - STARTING PRODUCTION MODE
echo ===================================================

echo.
echo [1/3] Building Frontend for Production...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo Frontend build failed!
    pause
    exit /b %errorlevel%
)

echo.
echo [2/3] Preparing Backend...
cd ../backend
set NODE_ENV=production

echo.
echo [3/3] Starting Backend Server...
echo Server will run on port 3001.
echo Frontend build is ready in /frontend/dist
echo.
echo To serve frontend in production locally, you can use:
echo "cd frontend && npm run preview" in a separate terminal.
echo.
echo Starting Backend now...
call npm start

pause
