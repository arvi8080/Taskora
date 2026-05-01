#!/bin/bash

# ExpertService Deployment Script
echo "🚀 Starting ExpertService deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create necessary directories
print_status "Creating necessary directories..."
mkdir -p nginx/ssl
mkdir -p backend/logs
mkdir -p data/mongo
mkdir -p data/redis

# Generate SSL certificates (self-signed for development)
print_status "Generating SSL certificates..."
if [ ! -f nginx/ssl/cert.pem ]; then
    openssl req -x509 -newkey rsa:4096 -keyout nginx/ssl/key.pem -out nginx/ssl/cert.pem -days 365 -nodes -subj "/C=IN/ST=State/L=City/O=ExpertService/CN=localhost"
    print_success "SSL certificates generated"
else
    print_warning "SSL certificates already exist"
fi

# Set environment variables
print_status "Setting up environment variables..."
if [ ! -f backend/.env ]; then
    cp backend/env.example backend/.env
    print_warning "Please update backend/.env with your actual API keys and configuration"
    print_warning "Required: MongoDB URI, Redis URL, JWT Secret, OpenAI API Key, etc."
fi

# Build and start services
print_status "Building and starting services..."
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Wait for services to be ready
print_status "Waiting for services to start..."
sleep 30

# Check service health
print_status "Checking service health..."

# Check MongoDB
if docker-compose exec -T mongo mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    print_success "MongoDB is running"
else
    print_error "MongoDB is not responding"
fi

# Check Redis
if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
    print_success "Redis is running"
else
    print_error "Redis is not responding"
fi

# Check Backend
if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    print_success "Backend API is running"
else
    print_warning "Backend API is not responding (this might be normal if health endpoint is not implemented)"
fi

# Check Frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    print_success "Frontend is running"
else
    print_error "Frontend is not responding"
fi

# Display service URLs
echo ""
print_success "🎉 Deployment completed!"
echo ""
echo "📱 Service URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000"
echo "   MongoDB: mongodb://localhost:27017"
echo "   Redis: redis://localhost:6379"
echo ""
echo "🔧 Management Commands:"
echo "   View logs: docker-compose logs -f"
echo "   Stop services: docker-compose down"
echo "   Restart services: docker-compose restart"
echo "   Update services: docker-compose pull && docker-compose up -d"
echo ""
echo "⚠️  Important Notes:"
echo "   1. Update backend/.env with your actual API keys"
echo "   2. Configure your domain and SSL certificates for production"
echo "   3. Set up proper firewall rules"
echo "   4. Configure backup strategies for MongoDB and Redis"
echo ""
print_success "ExpertService is now running! 🔥"



