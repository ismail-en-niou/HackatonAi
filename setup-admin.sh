#!/bin/bash

# Admin Setup Script for OCP Platform
# This script helps you create your first admin user

echo "================================"
echo "OCP Admin User Setup"
echo "================================"
echo ""

# Check if MongoDB is running
echo "Checking MongoDB connection..."
if ! command -v mongosh &> /dev/null && ! command -v mongo &> /dev/null
then
    echo "❌ MongoDB CLI not found. Please install MongoDB."
    echo "   Visit: https://www.mongodb.com/try/download/community"
    exit 1
fi

echo "✅ MongoDB CLI found"
echo ""

# Get database details
read -p "Enter MongoDB URI (default: mongodb://localhost:27017): " MONGO_URI
MONGO_URI=${MONGO_URI:-mongodb://localhost:27017}

read -p "Enter database name (default: llm): " DB_NAME
DB_NAME=${DB_NAME:-llm}

echo ""
echo "Enter admin user details:"
read -p "Name: " ADMIN_NAME
read -p "Email: " ADMIN_EMAIL
read -sp "Password (min 6 chars): " ADMIN_PASSWORD
echo ""

# Validate inputs
if [ -z "$ADMIN_NAME" ] || [ -z "$ADMIN_EMAIL" ] || [ -z "$ADMIN_PASSWORD" ]; then
    echo "❌ All fields are required!"
    exit 1
fi

if [ ${#ADMIN_PASSWORD} -lt 6 ]; then
    echo "❌ Password must be at least 6 characters!"
    exit 1
fi

echo ""
echo "Creating admin user..."

# Use Node.js to hash password and create user
node << EOF
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

async function createAdmin() {
  try {
    await mongoose.connect('${MONGO_URI}/${DB_NAME}');
    console.log('✅ Connected to MongoDB');

    const User = mongoose.model('User', new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: String,
      isActive: Boolean,
    }), 'users');

    // Check if user already exists
    const existing = await User.findOne({ email: '${ADMIN_EMAIL}' });
    if (existing) {
      if (existing.role === 'admin') {
        console.log('ℹ️  User already exists and is already an admin');
        process.exit(0);
      }
      // Update to admin
      existing.role = 'admin';
      await existing.save();
      console.log('✅ User updated to admin role');
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash('${ADMIN_PASSWORD}', salt);

    // Create admin user
    const admin = new User({
      name: '${ADMIN_NAME}',
      email: '${ADMIN_EMAIL}',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
    });

    await admin.save();
    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('Login credentials:');
    console.log('Email:', '${ADMIN_EMAIL}');
    console.log('Password: [hidden for security]');
    console.log('');
    console.log('You can now login at: http://localhost:3000/login');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();
EOF

echo ""
echo "================================"
echo "Setup Complete!"
echo "================================"
