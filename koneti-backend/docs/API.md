# Koneti Café API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Admin routes require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Reservations

#### Create Reservation
```http
POST /reservations
Content-Type: application/json

{
  "type": "biznis|koneti",
  "subType": "basic|premium|vip", // required if type is "koneti"
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+381601234567",
  "date": "2024-12-25",
  "time": "18:00",
  "guests": 4,
  "message": "Optional message"
}
```

#### Get Reservations
```http
GET /reservations?status=pending&page=1&limit=10
```

#### Update Reservation Status (Admin)
```http
PATCH /reservations/:id
Authorization: Bearer <token>

{
  "status": "approved|rejected"
}
```

### Drinks

#### Get All Drinks
```http
GET /drinks
```

#### Create Drink (Admin)
```http
POST /drinks
Authorization: Bearer <token>
Content-Type: multipart/form-data

name: "Espresso"
price: "200"
category: "categoryId"
description: "Strong coffee"
image: <file>
```

### Categories

#### Get All Categories
```http
GET /categories
```

#### Create Category (Admin)
```http
POST /categories
Authorization: Bearer <token>

{
  "name": "Coffee",
  "icon": "faCoffee",
  "description": "Hot coffee drinks"
}
```

### Admin

#### Login
```http
POST /admin/login

{
  "email": "admin@koneti.com",
  "password": "password"
}
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ] // optional validation errors
}
```

## Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error