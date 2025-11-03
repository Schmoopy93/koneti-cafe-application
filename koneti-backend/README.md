# Koneti Café Backend

Modern Node.js backend for Koneti Café management system.

## Features

- 🔐 JWT Authentication
- 📝 Input Validation
- 🛡️ Security Middleware (Helmet, Rate Limiting)
- 📊 Structured Logging
- 🗄️ MongoDB with Mongoose
- ☁️ Cloudinary Image Upload
- 📚 API Documentation
- 🧪 Jest Testing
- 🚀 Performance Optimizations

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB
- Cloudinary account

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your values
# MONGO_URI=mongodb://localhost:27017/koneti
# JWT_SECRET=your-secret-key
# CLOUDINARY_CLOUD_NAME=your-cloud-name
# CLOUDINARY_API_KEY=your-api-key
# CLOUDINARY_API_SECRET=your-api-secret

# Create admin user
npm run seed

# Start development server
npm run dev
```

### Scripts

```bash
npm start          # Production server
npm run dev        # Development server with nodemon
npm test           # Run tests
npm run test:watch # Run tests in watch mode
npm run seed       # Create admin user
```

## Project Structure

```
koneti-backend/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/          # Mongoose models
├── routes/          # API routes
├── utils/           # Utility functions
├── tests/           # Test files
├── docs/            # Documentation
├── logs/            # Log files
└── uploads/         # File uploads
```

## API Endpoints

See [API Documentation](./docs/API.md) for detailed endpoint information.

### Base Routes
- `GET /` - Health check
- `GET /health` - Detailed health status
- `POST /api/admin/login` - Admin authentication
- `GET /api/reservations` - Get reservations
- `POST /api/reservations` - Create reservation
- `GET /api/drinks` - Get drinks
- `GET /api/categories` - Get categories

## Environment Variables

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/koneti
JWT_SECRET=your-jwt-secret
LOG_LEVEL=info

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Security Features

- **Helmet**: Security headers
- **Rate Limiting**: Prevents abuse
- **Input Validation**: Express-validator
- **JWT Authentication**: Secure admin routes
- **Error Handling**: Centralized error management
- **Logging**: Winston structured logging

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- reservation.test.js
```

## Deployment

### Production Checklist
- [ ] Set NODE_ENV=production
- [ ] Configure production MongoDB
- [ ] Set secure JWT_SECRET
- [ ] Configure Cloudinary
- [ ] Set up process manager (PM2)
- [ ] Configure reverse proxy (Nginx)
- [ ] Set up SSL certificate
- [ ] Configure monitoring

### PM2 Deployment
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License.