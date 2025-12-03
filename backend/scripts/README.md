# Database Setup Scripts

This directory contains scripts to set up and seed the CarHub MongoDB database.

## Scripts

### 1. createSchema.js

Creates the database schema and indexes for optimal performance.

**Usage:**
```bash
npm run schema
```

**What it does:**
- Connects to MongoDB Atlas
- Creates indexes on all collections:
  - Users: email (unique)
  - Cars: sellerId, brand, year, price, status, createdAt, text search
  - Offers: carId, buyerId, status, createdAt
- Displays schema information

**Output:**
```
Connecting to MongoDB...
Connected to MongoDB successfully!

Creating indexes...
✓ User email index created
✓ Car indexes created
✓ Offer indexes created

✅ Schema setup completed successfully!
```

---

### 2. seedData.js

Populates the database with sample data for testing.

**Usage:**
```bash
npm run seed
```

**What it does:**
- Clears existing data (optional - can be commented out)
- Creates sample users:
  - 1 seller account
  - 2 buyer accounts
- Creates 4 sample car listings
- Creates 3 sample offers

**Test Credentials:**

**Seller:**
- Email: `seller@carhub.com`
- Password: `seller123`

**Buyer:**
- Email: `buyer@carhub.com`
- Password: `buyer123`

**Buyer 2:**
- Email: `bob@carhub.com`
- Password: `buyer123`

---

## Setup Workflow

1. **First Time Setup:**
   ```bash
   # Create schema and indexes
   npm run schema
   
   # (Optional) Seed sample data
   npm run seed
   ```

2. **After Schema Changes:**
   ```bash
   # Recreate indexes
   npm run schema
   ```

---

## Important Notes

- Make sure your `.env` file has the correct `MONGODB_URI`
- The seed script will **delete all existing data** by default
- To keep existing data, comment out the delete operations in `seedData.js`
- Indexes improve query performance significantly
- Text search index allows searching across car title, brand, model, and description

---

## Troubleshooting

**Connection Error:**
- Verify MongoDB URI in `.env` file
- Check internet connection
- Verify MongoDB Atlas IP whitelist settings

**Index Creation Error:**
- Indexes may already exist (this is OK)
- Check MongoDB Atlas connection limits

**Seed Data Error:**
- Ensure schema is created first (`npm run schema`)
- Check for duplicate email addresses

