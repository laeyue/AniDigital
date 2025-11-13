# Ani-Digital Backend API

Express + MongoDB backend for the Ani-Digital AgriTech platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB installed and running locally (or MongoDB Atlas account)

### Installation

1. **Navigate to server directory:**
```bash
cd server
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment:**
```bash
cp .env.example .env
```

Edit `.env` and update the MongoDB URI if needed:
```
MONGODB_URI=mongodb://localhost:27017/ani-digital
```

4. **Seed the database (optional but recommended):**
```bash
npm run seed
```

This creates sample data including:
- 2 test users (farmer and buyer)
- Sample products
- Market prices
- Weather data

**Sample Login Credentials:**
- Email: `juan@example.com`
- Password: `password123`

5. **Start the server:**
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:5000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Products (Marketplace)
- `GET /api/products` - Get all products (supports filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (with image upload)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Diagnoses (Crop Doctor)
- `GET /api/diagnoses` - Get user's diagnoses
- `GET /api/diagnoses/:id` - Get single diagnosis
- `POST /api/diagnoses` - Create diagnosis (with image upload)
- `PUT /api/diagnoses/:id` - Update diagnosis

### Transactions
- `GET /api/transactions` - Get user's transactions
- `GET /api/transactions/:id` - Get single transaction
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction

### Market Prices
- `GET /api/market-prices` - Get market prices
- `GET /api/market-prices/latest` - Get latest prices
- `GET /api/market-prices/trends/:commodity` - Get price trends

### Weather
- `GET /api/weather` - Get weather data
- `GET /api/weather/forecast` - Get forecast
- `GET /api/weather/advisories` - Get weather advisories

### Financial Records
- `GET /api/financials` - Get financial records
- `GET /api/financials/summary` - Get financial summary
- `GET /api/financials/:id` - Get single record
- `POST /api/financials` - Create record
- `PUT /api/financials/:id` - Update record
- `DELETE /api/financials/:id` - Delete record

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

Include the token in the Authorization header:
```
Authorization: Bearer <your_token>
```

## 📁 Project Structure

```
server/
├── config/
│   └── db.js              # MongoDB connection
├── middleware/
│   ├── auth.js            # JWT authentication
│   ├── error.js           # Error handling
│   └── upload.js          # File upload (multer)
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Diagnosis.js
│   ├── Transaction.js
│   ├── MarketPrice.js
│   ├── WeatherData.js
│   └── FinancialRecord.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── products.js
│   ├── diagnoses.js
│   ├── transactions.js
│   ├── marketPrices.js
│   ├── weather.js
│   └── financials.js
├── scripts/
│   └── seed.js            # Database seeding
├── uploads/               # Uploaded files
├── .env.example
├── .gitignore
├── package.json
└── server.js              # Main entry point
```

## 🧪 Testing

You can test the API using:
- **Postman** or **Insomnia** (import the endpoints)
- **curl** commands
- The frontend React app

Example curl request:
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"juan@example.com","password":"password123"}'
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | development |
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/ani-digital |
| `JWT_SECRET` | Secret key for JWT | (required) |
| `JWT_EXPIRE` | Token expiration time | 7d |
| `CLIENT_URL` | Frontend URL for CORS | http://localhost:8080 |
| `MAX_FILE_SIZE` | Max upload file size in bytes | 5242880 (5MB) |

## 📝 Notes

- File uploads are stored in the `uploads/` directory
- Images are served at `/uploads/:filename`
- The API includes rate limiting and security headers via Helmet
- CORS is configured for the frontend URL

## 🛠️ Development

For development with auto-reload:
```bash
npm run dev
```

This uses nodemon to automatically restart the server when files change.
