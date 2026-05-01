const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Health check endpoint
router.get('/', async (req, res) => {
  try {
    const healthCheck = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      services: {
        database: 'OK',
        redis: 'NOT_CONFIGURED'
      }
    };

    // Check MongoDB connection
    try {
      await mongoose.connection.db.admin().ping();
      healthCheck.services.database = 'OK';
    } catch (error) {
      healthCheck.services.database = 'ERROR';
      healthCheck.status = 'ERROR';
    }

    // Check Redis connection (if available and configured)
    if (process.env.REDIS_URL) {
      try {
        const redis = require('redis');
        const client = redis.createClient({
          url: process.env.REDIS_URL,
          socket: {
            reconnectStrategy: false
          }
        });
        
        await client.connect();
        await client.ping();
        await client.quit(true);
        healthCheck.services.redis = 'OK';
      } catch (error) {
        healthCheck.services.redis = 'ERROR';
        // Don't mark overall status as error for Redis issues if database is OK
        if (healthCheck.services.database === 'ERROR') {
          healthCheck.status = 'ERROR';
        }
      }
    }

    const statusCode = healthCheck.status === 'OK' ? 200 : 503;
    res.status(statusCode).json(healthCheck);
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

module.exports = router;



