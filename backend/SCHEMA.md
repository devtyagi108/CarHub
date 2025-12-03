# CarHub MongoDB Schema Documentation

This document describes the MongoDB database schema for the CarHub application.

## Database: `carhub`

## Collections

### 1. Users Collection (`users`)

Stores user account information including authentication details.

**Schema:**
```javascript
{
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    // Hashed with bcrypt before saving
  },
  role: {
    type: String,
    enum: ['seller', 'buyer'],
    default: 'buyer'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes:**
- `email` (unique)

**Example Document:**
```json
{
  "_id": ObjectId("..."),
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2a$10$hashedpassword...",
  "role": "seller",
  "createdAt": ISODate("2024-01-01T00:00:00.000Z"),
  "updatedAt": ISODate("2024-01-01T00:00:00.000Z")
}
```

---

### 2. Cars Collection (`cars`)

Stores car listing information posted by sellers.

**Schema:**
```javascript
{
  title: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  model: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    required: true,
    min: 1900,
    max: currentYear + 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  images: {
    type: [String],
    default: []
    // Array of image file paths/URLs
  },
  sellerId: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'sold', 'pending'],
    default: 'available'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes:**
- `sellerId`
- `brand`
- `year`
- `price`
- `status`
- `createdAt` (descending)
- Text index on `title`, `brand`, `model`, `description`

**Example Document:**
```json
{
  "_id": ObjectId("..."),
  "title": "2023 Tesla Model 3",
  "brand": "Tesla",
  "model": "Model 3",
  "year": 2023,
  "price": 45000,
  "description": "Excellent condition, low mileage",
  "images": ["/uploads/car-1234567890.jpg"],
  "sellerId": ObjectId("..."),
  "status": "available",
  "createdAt": ISODate("2024-01-01T00:00:00.000Z"),
  "updatedAt": ISODate("2024-01-01T00:00:00.000Z")
}
```

---

### 3. Offers Collection (`offers`)

Stores purchase offers made by buyers for cars.

**Schema:**
```javascript
{
  carId: {
    type: ObjectId,
    ref: 'Car',
    required: true
  },
  buyerId: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  message: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes:**
- `carId`
- `buyerId`
- `status`
- `createdAt` (descending)

**Example Document:**
```json
{
  "_id": ObjectId("..."),
  "carId": ObjectId("..."),
  "buyerId": ObjectId("..."),
  "amount": 43000,
  "message": "I am interested in this car",
  "status": "pending",
  "createdAt": ISODate("2024-01-01T00:00:00.000Z"),
  "updatedAt": ISODate("2024-01-01T00:00:00.000Z")
}
```

---

## Relationships

1. **User → Car**: One-to-Many
   - A user (seller) can have multiple cars
   - Reference: `Car.sellerId` → `User._id`

2. **User → Offer**: One-to-Many
   - A user (buyer) can make multiple offers
   - Reference: `Offer.buyerId` → `User._id`

3. **Car → Offer**: One-to-Many
   - A car can receive multiple offers
   - Reference: `Offer.carId` → `Car._id`

---

## Setup Instructions

### 1. Create Schema and Indexes

Run the schema creation script to set up indexes:

```bash
npm run schema
```

This will:
- Connect to MongoDB
- Create all necessary indexes
- Display schema information

### 2. Seed Sample Data (Optional)

To populate the database with sample data:

```bash
npm run seed
```

This creates:
- 1 seller user
- 2 buyer users
- 4 sample cars
- 3 sample offers

**Test Credentials:**
- Seller: `seller@carhub.com` / `seller123`
- Buyer: `buyer@carhub.com` / `buyer123`

---

## MongoDB Connection

The application connects to MongoDB Atlas using:

```
mongodb+srv://carhub:carhub@carhub.rsuhda5.mongodb.net/carhub?appName=carhub
```

Database Name: `carhub`

---

## Validation Rules

### User Validation
- Email must be unique
- Password minimum length: 6 characters
- Password is automatically hashed with bcrypt
- Role must be either 'seller' or 'buyer'

### Car Validation
- Year must be between 1900 and current year + 1
- Price must be positive (>= 0)
- Status must be one of: 'available', 'sold', 'pending'

### Offer Validation
- Amount must be positive (>= 0)
- Status must be one of: 'pending', 'accepted', 'rejected'

---

## Query Examples

### Find all available cars
```javascript
Car.find({ status: 'available' })
  .populate('sellerId', 'name email')
  .sort({ createdAt: -1 })
```

### Find cars by seller
```javascript
Car.find({ sellerId: userId })
  .sort({ createdAt: -1 })
```

### Find offers for a car
```javascript
Offer.find({ carId: carId })
  .populate('buyerId', 'name email')
  .sort({ createdAt: -1 })
```

### Find user's offers
```javascript
Offer.find({ buyerId: userId })
  .populate('carId')
  .sort({ createdAt: -1 })
```

---

## Notes

- All timestamps are automatically managed by Mongoose (`timestamps: true`)
- Passwords are hashed before saving using bcrypt
- Text search is available on car title, brand, model, and description
- Indexes improve query performance for common operations

