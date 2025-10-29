@echo off
echo Starting Smart Waste Segregation System...

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Starting with Python server...
    cd src\main\webapp
    echo Open browser: http://localhost:8000
    python -m http.server 8000
) else (
    echo Python not found. Opening files directly...
    start src\main\webapp\index.html
)