
@echo off
REM This batch file runs both backend and frontend for Windows users

REM Start the backend
echo Starting backend...
start cmd /c "cd be && mvnw.cmd spring-boot:run"

REM Wait for backend to initialize
timeout /t 10

REM Start the frontend
echo Starting frontend...
start cmd /c "npm run dev"

echo Both services started.
echo Press any key to terminate all processes...
pause > nul

REM Kill all node and java processes (be careful if you have other node/java apps running)
taskkill /F /IM java.exe
taskkill /F /IM node.exe
