import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import MarketPrice from '../models/MarketPrice.js';
import WeatherData from '../models/WeatherData.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await MarketPrice.deleteMany({});
    await WeatherData.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create sample users
    const users = await User.create([
      {
        name: 'Juan Dela Cruz',
        email: 'juan@example.com',
        password: 'password123',
        phone: '09171234567',
        role: 'farmer',
        farmLocation: 'Nueva Ecija',
        farmSize: '5 hectares',
        crops: ['Rice', 'Corn'],
        address: {
          municipality: 'Cabanatuan',
          province: 'Nueva Ecija',
          region: 'Region III'
        }
      },
      {
        name: 'Maria Santos',
        email: 'maria@example.com',
        password: 'password123',
        phone: '09187654321',
        role: 'buyer',
        farmLocation: 'Manila',
        address: {
          municipality: 'Manila',
          province: 'Metro Manila',
          region: 'NCR'
        }
      }
    ]);
    console.log('👥 Created sample users');

    // Create sample products
    const products = await Product.create([
      {
        seller: users[0]._id,
        name: 'Fresh Rice',
        category: 'grain',
        description: 'Premium quality freshly harvested rice',
        price: 45,
        unit: 'kg',
        quantity: 500,
        location: {
          municipality: 'Cabanatuan',
          province: 'Nueva Ecija'
        },
        organic: false,
        harvestDate: new Date()
      },
      {
        seller: users[0]._id,
        name: 'Yellow Corn',
        category: 'grain',
        description: 'Sweet yellow corn, perfect for grilling',
        price: 30,
        unit: 'kg',
        quantity: 200,
        location: {
          municipality: 'Cabanatuan',
          province: 'Nueva Ecija'
        },
        organic: true,
        harvestDate: new Date()
      }
    ]);
    console.log('📦 Created sample products');

    // Create sample market prices
    const marketPrices = await MarketPrice.create([
      {
        commodity: 'Rice',
        category: 'grain',
        variety: 'Well Milled',
        price: {
          low: 40,
          high: 50,
          average: 45
        },
        unit: 'kg',
        market: {
          name: 'Nueva Ecija Agri-Trading Center',
          location: {
            municipality: 'Cabanatuan',
            province: 'Nueva Ecija',
            region: 'Region III'
          }
        },
        trend: 'stable'
      },
      {
        commodity: 'Corn',
        category: 'grain',
        variety: 'Yellow',
        price: {
          low: 25,
          high: 35,
          average: 30
        },
        unit: 'kg',
        market: {
          name: 'Nueva Ecija Agri-Trading Center',
          location: {
            municipality: 'Cabanatuan',
            province: 'Nueva Ecija',
            region: 'Region III'
          }
        },
        trend: 'up',
        priceChange: 2
      }
    ]);
    console.log('💰 Created sample market prices');

    // Create sample weather data
    const weather = await WeatherData.create({
      location: {
        municipality: 'Cabanatuan',
        province: 'Nueva Ecija',
        region: 'Region III',
        coordinates: {
          latitude: 15.4855,
          longitude: 120.9703
        }
      },
      current: {
        temperature: 28,
        feelsLike: 31,
        humidity: 75,
        windSpeed: 15,
        windDirection: 'NE',
        precipitation: 0,
        condition: 'partly_cloudy',
        uvIndex: 7
      },
      forecast: [
        {
          date: new Date(Date.now() + 86400000),
          tempHigh: 32,
          tempLow: 24,
          precipitation: 5,
          rainChance: 30,
          condition: 'partly_cloudy'
        },
        {
          date: new Date(Date.now() + 172800000),
          tempHigh: 31,
          tempLow: 23,
          precipitation: 15,
          rainChance: 60,
          condition: 'rainy'
        }
      ],
      farmingRecommendations: [
        {
          activity: 'Irrigation',
          recommendation: 'Good day for irrigation. Soil moisture is optimal.',
          priority: 'medium'
        },
        {
          activity: 'Planting',
          recommendation: 'Favorable conditions for planting. Rain expected in 2 days.',
          priority: 'high'
        }
      ]
    });
    console.log('🌤️  Created sample weather data');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📝 Sample credentials:');
    console.log('   Email: juan@example.com');
    console.log('   Password: password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
