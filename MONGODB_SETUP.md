# MongoDB Atlas Setup Guide

## Current Issue: Authentication Failed

The error "bad auth : authentication failed" means we need to properly configure MongoDB Atlas.

## Steps to Fix:

### 1. Create Database User in MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Log in to your account
3. Select your cluster (Cluster0)
4. Click on **Database Access** in the left sidebar
5. Click **Add New Database User**
6. Set authentication method to **Password**
7. Username: `ani-digital-user`
8. Password: `<db_password>` (or auto-generate a new one)
9. Database User Privileges: Select **Atlas admin** or **Read and write to any database**
10. Click **Add User**

### 2. Whitelist Your IP Address

1. In MongoDB Atlas, click **Network Access** in the left sidebar
2. Click **Add IP Address**
3. Either:
   - Click **Allow Access from Anywhere** (for development) - adds `0.0.0.0/0`
   - Or click **Add Current IP Address** (more secure)
4. Click **Confirm**

### 3. Get the Correct Connection String

1. Go to your cluster dashboard
2. Click **Connect**
3. Choose **Connect your application**
4. Select **Driver**: Node.js, **Version**: 5.5 or later
5. Copy the connection string

The connection string should look like:
```
mongodb+srv://ani-digital-user:<password>@cluster0.ccnp9l0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

### 4. Update the .env file

Replace `<password>` with your actual password in `server/.env`:

```env
MONGODB_URI=mongodb+srv://ani-digital-user:<db_password>@cluster0.ccnp9l0.mongodb.net/ani-digital?retryWrites=true&w=majority
```

**Important:** If your password contains special characters, URL encode them:
- `@` becomes `%40`
- `:` becomes `%3A`
- `/` becomes `%2F`
- `?` becomes `%3F`
- `#` becomes `%23`
- `[` becomes `%5B`
- `]` becomes `%5D`

### 5. Test the Connection

After completing the above steps, run:

```bash
cd server
npm run seed
```

If successful, you should see:
```
✅ Connected to MongoDB
🗑️  Cleared existing data
👥 Created sample users
📦 Created sample products
💰 Created sample market prices
🌤️  Created sample weather data

✅ Database seeded successfully!

📝 Sample credentials:
   Email: juan@example.com
   Password: <db_password>
```

### 6. Start the Backend Server

```bash
cd server
npm run dev
```

You should see:
```
✅ MongoDB Connected: cluster0-xxxxx.mongodb.net
🚀 Server running in development mode on port 5000
```

### 7. Start the Frontend

In a new terminal:
```bash
npm run dev
```

Visit http://localhost:8080 and login with:
- Email: `juan@example.com`
- Password: `<db_password>`

---

## Alternative: Use Local MongoDB

If you prefer to use MongoDB locally instead of Atlas:

1. Install MongoDB locally:
   ```bash
   # Ubuntu/Debian
   sudo apt-get install mongodb
   
   # macOS with Homebrew
   brew install mongodb-community
   ```

2. Start MongoDB:
   ```bash
   # Ubuntu/Debian
   sudo systemctl start mongodb
   
   # macOS
   brew services start mongodb-community
   ```

3. Update `server/.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/ani-digital
   ```

4. Run the seed script:
   ```bash
   cd server
   npm run seed
   ```

---

## Troubleshooting

### "Network error" or "Connection timeout"
- Check Network Access settings in MongoDB Atlas
- Make sure your IP is whitelisted

### "Authentication failed"
- Verify the database user exists
- Double-check username and password
- Ensure password is URL encoded if it contains special characters

### "Database not found"
- This is normal on first run
- MongoDB will create the database automatically when you seed it

---

## Next Steps

Once connected successfully:

1. **Seed the database**: `cd server && npm run seed`
2. **Start backend**: `cd server && npm run dev`
3. **Start frontend**: `npm run dev`
4. **Access the app**: http://localhost:8080
5. **Login**: Use `juan@example.com` / `password123`

The integrated MongoDB + Express backend is now ready for your React frontend!
