# 🚀 ExpertService Deployment Guide

This guide covers multiple deployment options for the ExpertService platform.

## 📋 Prerequisites

- Docker and Docker Compose installed
- Domain name (for production)
- SSL certificates (for production)
- API keys for external services

## 🐳 Docker Deployment (Recommended)

### Quick Start

1. **Clone and navigate to the project**
   ```bash
   git clone <repository-url>
   cd expert-service
   ```

2. **Run the deployment script**
   ```bash
   ./deploy.sh
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Manual Docker Deployment

1. **Set up environment variables**
   ```bash
   cp backend/env.example backend/.env
   # Edit backend/.env with your configuration
   ```

2. **Generate SSL certificates**
   ```bash
   mkdir -p nginx/ssl
   openssl req -x509 -newkey rsa:4096 -keyout nginx/ssl/key.pem -out nginx/ssl/cert.pem -days 365 -nodes -subj "/C=IN/ST=State/L=City/O=ExpertService/CN=localhost"
   ```

3. **Build and start services**
   ```bash
   docker-compose up -d --build
   ```

4. **Check service status**
   ```bash
   docker-compose ps
   docker-compose logs -f
   ```

## ☁️ Cloud Deployment Options

### AWS Deployment

#### Using AWS ECS with Fargate

1. **Create ECS Cluster**
   ```bash
   aws ecs create-cluster --cluster-name expert-service
   ```

2. **Build and push Docker images**
   ```bash
   # Build images
   docker build -t expert-service-backend ./backend
   docker build -t expert-service-frontend ./frontend
   
   # Tag for ECR
   docker tag expert-service-backend:latest <account>.dkr.ecr.<region>.amazonaws.com/expert-service-backend:latest
   docker tag expert-service-frontend:latest <account>.dkr.ecr.<region>.amazonaws.com/expert-service-frontend:latest
   
   # Push to ECR
   docker push <account>.dkr.ecr.<region>.amazonaws.com/expert-service-backend:latest
   docker push <account>.dkr.ecr.<region>.amazonaws.com/expert-service-frontend:latest
   ```

3. **Set up RDS for MongoDB**
   ```bash
   aws rds create-db-instance \
     --db-instance-identifier expert-service-mongo \
     --db-instance-class db.t3.micro \
     --engine docdb \
     --master-username admin \
     --master-user-password <password> \
     --allocated-storage 20
   ```

4. **Set up ElastiCache for Redis**
   ```bash
   aws elasticache create-cache-cluster \
     --cache-cluster-id expert-service-redis \
     --cache-node-type cache.t3.micro \
     --engine redis \
     --num-cache-nodes 1
   ```

#### Using AWS App Runner

1. **Create apprunner.yaml**
   ```yaml
   version: 1.0
   runtime: docker
   build:
     commands:
       build:
         - echo "Building ExpertService"
   run:
     runtime-version: latest
     command: npm start
     network:
       port: 5000
       env: PORT
     env:
       - name: NODE_ENV
         value: production
       - name: MONGODB_URI
         value: <your-mongodb-uri>
   ```

### Google Cloud Platform (GCP)

#### Using Cloud Run

1. **Build and deploy backend**
   ```bash
   gcloud builds submit --tag gcr.io/<project-id>/expert-service-backend ./backend
   gcloud run deploy expert-service-backend \
     --image gcr.io/<project-id>/expert-service-backend \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

2. **Build and deploy frontend**
   ```bash
   gcloud builds submit --tag gcr.io/<project-id>/expert-service-frontend ./frontend
   gcloud run deploy expert-service-frontend \
     --image gcr.io/<project-id>/expert-service-frontend \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

3. **Set up Cloud SQL for MongoDB**
   ```bash
   gcloud sql instances create expert-service-db \
     --database-version=POSTGRES_13 \
     --tier=db-f1-micro \
     --region=us-central1
   ```

### DigitalOcean

#### Using App Platform

1. **Create app.yaml**
   ```yaml
   name: expert-service
   services:
   - name: backend
     source_dir: /backend
     github:
       repo: <your-repo>
       branch: main
     run_command: npm start
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
     envs:
     - key: NODE_ENV
       value: production
     - key: MONGODB_URI
       value: <your-mongodb-uri>
   
   - name: frontend
     source_dir: /frontend
     github:
       repo: <your-repo>
       branch: main
     run_command: npm start
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
   ```

2. **Deploy**
   ```bash
   doctl apps create --spec app.yaml
   ```

## 🔧 Environment Configuration

### Required Environment Variables

```env
# Database
MONGODB_URI=mongodb://localhost:27017/expert-service
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Twilio (SMS/Voice)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number

# Stripe (Payments)
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Agora (Video/AR)
AGORA_APP_ID=your-agora-app-id
AGORA_APP_CERTIFICATE=your-agora-app-certificate

# Google Maps
GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Server
PORT=5000
NODE_ENV=production
```

## 🔒 SSL Configuration

### Let's Encrypt (Production)

1. **Install Certbot**
   ```bash
   sudo apt-get update
   sudo apt-get install certbot python3-certbot-nginx
   ```

2. **Generate certificates**
   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

3. **Auto-renewal**
   ```bash
   sudo crontab -e
   # Add: 0 12 * * * /usr/bin/certbot renew --quiet
   ```

## 📊 Monitoring and Logging

### Health Checks

The application includes health check endpoints:

- Backend: `GET /api/health`
- Frontend: `GET /health`

### Logging

Logs are stored in:
- Backend: `./backend/logs/`
- Docker: `docker-compose logs -f`

### Monitoring with Prometheus

1. **Add Prometheus to docker-compose.yml**
   ```yaml
   prometheus:
     image: prom/prometheus
     ports:
       - "9090:9090"
     volumes:
       - ./prometheus.yml:/etc/prometheus/prometheus.yml
   ```

2. **Create prometheus.yml**
   ```yaml
   global:
     scrape_interval: 15s
   
   scrape_configs:
     - job_name: 'expert-service'
       static_configs:
         - targets: ['backend:5000']
   ```

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy ExpertService

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to production
        run: |
          docker-compose -f docker-compose.prod.yml up -d --build
          
      - name: Run health checks
        run: |
          sleep 30
          curl -f http://yourdomain.com/api/health
```

## 🚨 Troubleshooting

### Common Issues

1. **Port conflicts**
   ```bash
   # Check what's using the port
   sudo netstat -tulpn | grep :5000
   # Kill the process
   sudo kill -9 <PID>
   ```

2. **Docker build failures**
   ```bash
   # Clean Docker cache
   docker system prune -a
   # Rebuild without cache
   docker-compose build --no-cache
   ```

3. **Database connection issues**
   ```bash
   # Check MongoDB logs
   docker-compose logs mongo
   # Test connection
   docker-compose exec mongo mongosh
   ```

4. **SSL certificate issues**
   ```bash
   # Check certificate validity
   openssl x509 -in nginx/ssl/cert.pem -text -noout
   # Regenerate if needed
   rm nginx/ssl/*.pem
   ./deploy.sh
   ```

### Performance Optimization

1. **Enable gzip compression**
2. **Set up CDN for static assets**
3. **Configure Redis caching**
4. **Optimize database queries**
5. **Use connection pooling**

## 📈 Scaling

### Horizontal Scaling

1. **Load balancer configuration**
2. **Database replication**
3. **Redis clustering**
4. **CDN setup**

### Vertical Scaling

1. **Increase container resources**
2. **Optimize application code**
3. **Database indexing**
4. **Caching strategies**

## 🔐 Security Checklist

- [ ] SSL certificates configured
- [ ] Environment variables secured
- [ ] Database access restricted
- [ ] API rate limiting enabled
- [ ] CORS properly configured
- [ ] Input validation implemented
- [ ] Authentication tokens secured
- [ ] Regular security updates
- [ ] Backup strategies in place
- [ ] Monitoring and alerting set up

## 📞 Support

For deployment issues:
- Check logs: `docker-compose logs -f`
- Health check: `curl http://localhost:5000/api/health`
- Contact: support@expertservice.com

---

**Happy Deploying! 🚀**



