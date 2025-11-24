@echo off
REM Quick start script for Journey app

echo ========================================
echo   Journey - Personal Journaling App
echo ========================================
echo.

REM Check if MongoDB is running
echo Checking MongoDB connection...
mongosh --eval "db.version()" >nul 2>&1
if errorlevel 1 (
    echo WARNING: MongoDB doesn't appear to be running!
    echo Please start MongoDB first:
    echo   1. Windows: net start MongoDB
    echo   2. Or check MongoDB is installed from https://www.mongodb.com
    echo.
    pause
) else (
    echo ✓ MongoDB is running
)
echo.
echo Starting server on http://localhost:5000
echo.
echo Press Ctrl+C to stop the server
echo.
REM Start the server
npm start
pause