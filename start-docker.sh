#!/bin/bash
# Docker startup script for Expert Service Platform

echo "🚀 Starting Expert Service Platform with Docker..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from .env.docker..."
    cp .env.docker .env
    echo "⚠️  Please update .env with your API keys and credentials"
fi

# Build images
echo "🔨 Building Docker images..."
docker-compose build

# Start services
echo "▶️  Starting services..."
docker-compose up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check MongoDB
echo "🔍 Checking MongoDB..."
docker-compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" &> /dev/null && echo "✅ MongoDB is running" || echo "❌ MongoDB failed to start"

# Check Redis
echo "🔍 Checking Redis..."
docker-compose exec -T redis redis-cli ping &> /dev/null && echo "✅ Redis is running" || echo "❌ Redis failed to start"

# Check Backend
echo "🔍 Checking Backend..."
curl -s http://localhost:5000/health &> /dev/null && echo "✅ Backend is running" || echo "⚠️  Backend is starting, check logs"

echo ""
echo "✨ Services are starting up!"
echo ""
echo "📊 Service URLs:"
echo "   Backend API: http://localhost:5000"
echo "   MongoDB: mongodb://admin:mongodb123@localhost:27017"
echo "   Redis: redis://localhost:6379"
echo ""
echo "📝 Logs:"
echo "   Backend: docker-compose logs -f backend"
echo "   MongoDB: docker-compose logs -f mongodb"
echo "   Redis: docker-compose logs -f redis"
echo ""
echo "🛑 To stop services: docker-compose down"
echo "🗑️  To stop and remove data: docker-compose down -v"
