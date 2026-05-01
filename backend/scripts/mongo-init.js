// MongoDB initialization script
db = db.getSiblingDB('expert-service');

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'email', 'phone', 'password'],
      properties: {
        name: {
          bsonType: 'string',
          description: 'Name must be a string and is required'
        },
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
          description: 'Email must be a valid email address'
        },
        phone: {
          bsonType: 'string',
          pattern: '^[6-9]\\d{9}$',
          description: 'Phone must be a valid 10-digit Indian mobile number'
        }
      }
    }
  }
});

db.createCollection('experts', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['user', 'services', 'pricing'],
      properties: {
        user: {
          bsonType: 'objectId',
          description: 'User reference must be an ObjectId'
        },
        services: {
          bsonType: 'array',
          description: 'Services must be an array'
        }
      }
    }
  }
});

db.createCollection('bookings', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['user', 'expert', 'service', 'location', 'scheduling'],
      properties: {
        user: {
          bsonType: 'objectId',
          description: 'User reference must be an ObjectId'
        },
        expert: {
          bsonType: 'objectId',
          description: 'Expert reference must be an ObjectId'
        }
      }
    }
  }
});

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ phone: 1 }, { unique: true });
db.users.createIndex({ 'address.coordinates': '2dsphere' });

db.experts.createIndex({ user: 1 }, { unique: true });
db.experts.createIndex({ 'location.current': '2dsphere' });
db.experts.createIndex({ 'services.category': 1 });
db.experts.createIndex({ 'rating.average': -1 });
db.experts.createIndex({ isVerified: 1, isActive: 1 });

db.bookings.createIndex({ user: 1 });
db.bookings.createIndex({ expert: 1 });
db.bookings.createIndex({ status: 1 });
db.bookings.createIndex({ createdAt: -1 });
db.bookings.createIndex({ 'location.coordinates': '2dsphere' });

// Create admin user
db.users.insertOne({
  name: 'Admin User',
  email: 'admin@expertservice.com',
  phone: '9999999999',
  password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8K5K5K.', // password: admin123
  isVerified: true,
  isActive: true,
  role: 'admin',
  createdAt: new Date(),
  updatedAt: new Date()
});

print('Database initialized successfully!');



