@echo off
echo Starting EcoFinds...
echo.

echo Starting backend server...
start "EcoFinds Backend" cmd /k "cd server && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting frontend server...
start "EcoFinds Frontend" cmd /k "cd client && npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause
