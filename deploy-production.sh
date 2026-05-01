#!/bin/bash

# ExpertService Production Deployment Script
echo "🚀 Starting ExpertService production deployment..."

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

# Check if .env file exists
if [ ! -f .env ]; then
    print_error ".env file not found. Please copy env.production to .env and update with your values."
    exit 1
fi

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
mkdir -p monitoring/grafana/dashboards
mkdir -p monitoring/grafana/datasources

# Generate SSL certificates (replace with Let's Encrypt for production)
print_status "Setting up SSL certificates..."
if [ ! -f nginx/ssl/cert.pem ]; then
    print_warning "SSL certificates not found. Generating self-signed certificates..."
    print_warning "For production, replace these with Let's Encrypt certificates."
    openssl req -x509 -newkey rsa:4096 -keyout nginx/ssl/key.pem -out nginx/ssl/cert.pem -days 365 -nodes -subj "/C=IN/ST=State/L=City/O=ExpertService/CN=localhost"
    print_success "SSL certificates generated"
else
    print_success "SSL certificates already exist"
fi

# Pull latest images
print_status "Pulling latest Docker images..."
docker-compose -f docker-compose.prod.yml pull

# Build and start services
print_status "Building and starting production services..."
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be ready
print_status "Waiting for services to start..."
sleep 60

# Check service health
print_status "Checking service health..."

# Check MongoDB
if docker-compose -f docker-compose.prod.yml exec -T mongo mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    print_success "MongoDB is running"
else
    print_error "MongoDB is not responding"
fi

# Check Redis
if docker-compose -f docker-compose.prod.yml exec -T redis redis-cli ping > /dev/null 2>&1; then
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

# Check Prometheus
if curl -f http://localhost:9090 > /dev/null 2>&1; then
    print_success "Prometheus is running"
else
    print_warning "Prometheus is not responding"
fi

# Check Grafana
if curl -f http://localhost:3001 > /dev/null 2>&1; then
    print_success "Grafana is running"
else
    print_warning "Grafana is not responding"
fi

# Display service URLs
echo ""
print_success "🎉 Production deployment completed!"
echo ""
echo "📱 Service URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000"
echo "   Prometheus: http://localhost:9090"
echo "   Grafana: http://localhost:3001"
echo "   MongoDB: mongodb://localhost:27017"
echo "   Redis: redis://localhost:6379"
echo ""
echo "🔧 Management Commands:"
echo "   View logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "   Stop services: docker-compose -f docker-compose.prod.yml down"
echo "   Restart services: docker-compose -f docker-compose.prod.yml restart"
echo "   Update services: docker-compose -f docker-compose.prod.yml pull && docker-compose -f docker-compose.prod.yml up -d"
echo ""
echo "📊 Monitoring:"
echo "   Prometheus: http://localhost:9090"
echo "   Grafana: http://localhost:3001 (admin/your-grafana-password)"
echo ""
echo "⚠️  Production Checklist:"
echo "   1. ✅ Update .env with production values"
echo "   2. ⚠️  Replace self-signed SSL certificates with Let's Encrypt"
echo "   3. ⚠️  Configure your domain and DNS"
echo "   4. ⚠️  Set up proper firewall rules"
echo "   5. ⚠️  Configure backup strategies"
echo "   6. ⚠️  Set up monitoring alerts"
echo "   7. ⚠️  Configure log rotation"
echo "   8. ⚠️  Set up CI/CD pipeline"
echo ""
print_success "ExpertService is now running in production! 🔥"



