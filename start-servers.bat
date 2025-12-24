@echo off
echo ========================================
echo   Iniciando Backend e Frontend
echo ========================================

REM Iniciar Backend em uma nova janela
echo [1/2] Iniciando Backend (porta 3001)...
start "Backend - Node.js" cmd /k "cd backend && node server.js"

REM Aguardar 3 segundos para o backend iniciar
timeout /t 3 /nobreak >nul

REM Iniciar Frontend em uma nova janela
echo [2/2] Iniciando Frontend (porta 4200)...
start "Frontend - Angular" cmd /k "npm start"

echo.
echo ========================================
echo   Servidores iniciados!
echo ========================================
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:4200/cadastro
echo.
echo Pressione qualquer tecla para sair...
pause >nul
