# CarHub - Full-Stack MERN Car Marketplace

A modern car buying and selling platform built with MongoDB, Express, React, and Node.js. Features JWT authentication, role-based access (Seller/Buyer), CRUD operations, and smooth animations with Framer Motion.

## Features

- ✅ **JWT Authentication** - Secure login/signup with role selection
- ✅ **Seller Dashboard** - Create, edit, delete car listings + view buyer requests
- ✅ **Buyer Dashboard** - Browse cars, make offers, track offer status
- ✅ **Advanced Search** - Filter by brand, year, price range
- ✅ **Sorting & Pagination** - Sort by price/year, paginated results
- ✅ **Image Upload** - Multiple images per car listing
- ✅ **Modern UI** - Black theme with smooth animations
- ✅ **Responsive Design** - Works on all devices

## Tech Stack

### Backend
- Node.js & Express
- MongoDB Atlas
- JWT Authentication
- Bcrypt password hashing
- Multer for file uploads

### Frontend
- React 18
- React Router
- Framer Motion (animations)
- Axios for API calls
- Plain CSS (no Tailwind)

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (connection string provided)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. The `.env` file is already configured with MongoDB Atlas connection:
```
MONGODB_URI=mongodb+srv://carhub:carhub@carhub.rsuhda5.mongodb.net/?appName=carhub
PORT=5001
JWT_SECRET=carhub_super_secret_jwt_key_2024_production
```

4. Create uploads directory:
```bash
mkdir uploads
```

5. Set up database schema and indexes:
```bash
npm run schema
```

6. (Optional) Seed sample data for testing:
```bash
npm run seed
```

7. Start the backend server:
```bash
npm run dev
```

Backend runs on `http://localhost:5001`

**Note:** The `schema` script creates all necessary indexes for optimal performance. Run it once after setting up the project.

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## Project Structure

```
CarHub/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── carController.js
│   │   └── offerController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Car.js
│   │   └── Offer.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── carRoutes.js
│   │   └── offerRoutes.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── CarCard.jsx
    │   │   ├── SearchFilters.jsx
    │   │   ├── Pagination.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── CarDetailsPage.jsx
    │   │   ├── SellerDashboard.jsx
    │   │   ├── BuyerDashboard.jsx
    │   │   └── AuthPage.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    └── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register (with role: buyer/seller)
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (protected)

### Cars
- `GET /api/cars` - Get all cars (search, filter, sort, pagination)
- `GET /api/cars/:id` - Get car by ID
- `POST /api/cars` - Create car (seller only)
- `PUT /api/cars/:id` - Update car (seller, owner only)
- `DELETE /api/cars/:id` - Delete car (seller, owner only)
- `GET /api/cars/my-cars` - Get seller's cars

### Offers
- `POST /api/offers` - Create offer (buyer only)
- `GET /api/offers/my-offers` - Get buyer's offers
- `GET /api/offers/seller-requests` - Get requests for seller's cars
- `GET /api/offers/car/:carId` - Get offers for a car
- `PUT /api/offers/:id/status` - Update offer status (seller only)

## Database Schema

The MongoDB database uses three main collections:

1. **Users** - User accounts (sellers and buyers)
2. **Cars** - Car listings posted by sellers
3. **Offers** - Purchase offers made by buyers

See `backend/SCHEMA.md` for detailed schema documentation.

### Setup Schema

Run the schema creation script to set up indexes:
```bash
cd backend
npm run schema
```

### Seed Sample Data

To populate with test data:
```bash
npm run seed
```

Test credentials:
- Seller: `seller@carhub.com` / `seller123`
- Buyer: `buyer@carhub.com` / `buyer123`

## Usage

1. **Sign Up**: Create account as Buyer or Seller
2. **Login**: Access your dashboard
3. **Sellers**: 
   - Add car listings with images
   - Edit/delete your listings
   - View buyer requests/offers
4. **Buyers**: 
   - Browse available cars
   - Search, filter, and sort
   - Make offers on cars
   - Track offer status

## Design Features

- **Black Theme**: Modern dark UI with accent colors
- **Smooth Animations**: Framer Motion for page transitions
- **Hover Effects**: Interactive elements throughout
- **Staggering Effects**: Sequential animations for lists
- **Responsive**: Mobile-first design

## Color Palette

- Primary Background: `#0a0a0a`
- Secondary Background: `#141414`
- Accent Primary: `#00d4ff` (Cyan)
- Accent Secondary: `#ff6b35` (Orange)
- Accent Success: `#00ff88` (Green)

## License

MIT

