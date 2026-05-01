# Docker Deployment Guide

## Prerequisites

- Docker Desktop (includes Docker and Docker Compose)
  - Windows: https://docs.docker.com/docker-for-windows/install/
  - Mac: https://docs.docker.com/docker-for-mac/install/
  - Linux: https://docs.docker.com/engine/install/

## Quick Start

### Linux/Mac
```bash
chmod +x start-docker.sh
./start-docker.sh
```

### Windows
```cmd
start-docker.bat
```

Or manually:
```bash
docker-compose up -d
```

## Services

### 1. MongoDB (Port 27017)
- Image: `mongo:7.0`
- Credentials: `admin / mongodb123`
- Database: `expert-service`
- Volume: `mongodb_data:/data/db`
- Persistence: Enabled

### 2. Redis (Port 6379)
- Image: `redis:7-alpine`
- Credentials: `redis123`
- Volume: `redis_data:/data`
- Persistence: AOF (Append Only File)

### 3. Backend (Port 5000)
- Node.js 18 Alpine
- Runs `server.js`
- Hot reload enabled with volume mounting
- Health checks enabled

## Configuration

### Using Environment Variables

Edit `.env` before starting:

```bash
# Database
MONGODB_URI=mongodb://admin:mongodb123@mongodb:27017/expert-service?authSource=admin
REDIS_URL=redis://:redis123@redis:6379

# API Keys
OPENAI_API_KEY=your-key
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
# ... add other API keys
```

### Environment Variable Priority

1. `.env` file (highest priority)
2. `.env.docker` file (default Docker values)
3. docker-compose.yml environment section

## Common Commands

### Start Services
```bash
docker-compose up -d
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f mongodb
docker-compose logs -f redis
```

### Stop Services
```bash
# Pause services (data persists)
docker-compose stop

# Stop and remove containers (data persists in volumes)
docker-compose down

# Stop and remove everything including volumes
docker-compose down -v
```

### Restart Services
```bash
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Build Images
```bash
# Build from scratch
docker-compose build

# Build without cache
docker-compose build --no-cache

# Build specific service
docker-compose build backend
```

### Access Services

#### MongoDB
```bash
# Using Docker
docker-compose exec mongodb mongosh -u admin -p mongodb123 admin

# Using MongoDB Compass
# Connection: mongodb://admin:mongodb123@localhost:27017
```

#### Redis
```bash
# Using Docker
docker-compose exec redis redis-cli -a redis123

# Using RedisInsight
# Connection: redis://localhost:6379
# Password: redis123
```

#### Backend
```bash
# Check health
curl http://localhost:5000/health

# Access API
curl http://localhost:5000/api/health
```

## Troubleshooting

### Port Already in Use
```bash
# Find process using port
# Linux/Mac: lsof -i :5000
# Windows: netstat -ano | findstr :5000

# Stop specific service
docker-compose down
docker ps  # List running containers
docker stop <container-id>
```

### Services Won't Start
```bash
# View detailed logs
docker-compose logs backend

# Rebuild images
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Database Connection Issues
```bash
# Check MongoDB is running
docker-compose ps

# Verify MongoDB credentials
docker-compose exec mongodb mongosh -u admin -p mongodb123 admin --eval "db.adminCommand('ping')"

# Check network
docker network inspect expert-service-network
```

### Memory Issues
```bash
# Increase Docker Desktop memory (Settings → Resources → Memory)
# Or limit service resources in docker-compose.yml:
# services:
#   backend:
#     deploy:
#       resources:
#         limits:
#           memory: 512M
```

## Production Considerations

1. **Change Credentials**
   - Update MongoDB and Redis passwords in `.env`
   - Generate a strong JWT_SECRET
   - Use environment-specific configuration

2. **Volumes**
   - Use named volumes (already configured)
   - Consider external storage for MongoDB backups
   - Implement backup strategy

3. **Networking**
   - Use private networks (already configured)
   - Implement reverse proxy for multiple domains
   - Add SSL/TLS certificates

4. **Security**
   - Don't expose sensitive ports directly
   - Use private container registry
   - Implement authentication/authorization
   - Regular security updates

5. **Monitoring**
   - Add health checks (already configured)
   - Implement logging aggregation
   - Monitor resource usage
   - Set up alerts

## Docker Registry

### Build for Registry
```bash
# Tag image
docker tag expert-service-backend myregistry/expert-service-backend:latest

# Push to registry
docker push myregistry/expert-service-backend:latest
```

### Pull from Registry
Update `docker-compose.yml`:
```yaml
services:
  backend:
    image: myregistry/expert-service-backend:latest
    # Remove build section
```

## Development Workflow

1. **Local Changes**
   - Edit files in `backend/` directory
   - Changes automatically reflected (volume mount)
   - Restart backend if needed: `docker-compose restart backend`

2. **Install Dependencies**
   ```bash
   docker-compose exec backend npm install package-name
   ```

3. **Run Database Migrations**
   ```bash
   docker-compose exec backend node scripts/mongo-init.js
   ```

4. **Database Cleanup**
   ```bash
   docker-compose exec mongodb mongosh -u admin -p mongodb123 admin --eval "db.dropDatabase()"
   ```

## Performance Optimization

### Multi-stage Build
Already implemented in Dockerfile for smaller image size

### Resource Limits
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

## Support

For issues:
1. Check logs: `docker-compose logs -f backend`
2. Verify services: `docker-compose ps`
3. Test connectivity: `docker-compose exec backend curl http://localhost:5000/health`
4. Check environment: `docker-compose config`
