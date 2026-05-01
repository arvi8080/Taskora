@echo off
REM Docker startup script for Expert Service Platform (Windows)

echo 🚀 Starting Expert Service Platform with Docker...

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed. Please install Docker Desktop for Windows.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose is not installed. Please install Docker Desktop with Compose support.
    pause
    exit /b 1
)

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo 📝 Creating .env file from .env.docker...
    copy .env.docker .env
    echo ⚠️  Please update .env with your API keys and credentials
)

REM Build images
echo 🔨 Building Docker images...
docker-compose build

REM Start services
echo ▶️  Starting services...
docker-compose up -d

REM Wait for services
echo ⏳ Waiting for services to be healthy (10 seconds)...
timeout /t 10 /nobreak

echo.
echo ✨ Services are starting up!
echo.
echo 📊 Service URLs:
echo    Backend API: http://localhost:5000
echo    MongoDB: mongodb://admin:mongodb123@localhost:27017
echo    Redis: redis://localhost:6379
echo.
echo 📝 Commands:
echo    View logs: docker-compose logs -f backend
echo    Stop services: docker-compose down
echo    Stop and remove data: docker-compose down -v
echo.
pause
