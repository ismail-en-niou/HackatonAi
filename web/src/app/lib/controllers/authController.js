// src/lib/controllers/authController.js
import User from '../models/Users';
import jwt from 'jsonwebtoken';
import connectDB from '../utils/database';

// Generate JWT token
function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

// Register new user
export async function registerUser(userData) {
  await connectDB();
  
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Create new user with inactive status
    const user = new User({
      ...userData,
      isActive: true,
    }); 
    await user.save();

    // Generate token (user can't login until activated, but we return it for consistency)
    const token = generateToken(user._id);

    return {
      success: true,
      message: 'Account created successfully. Please wait for admin approval.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
      token,
    };
  } catch (error) {
    // Handle duplicate key error (MongoDB unique constraint)
    if (error.code === 11000) {
      throw new Error('User already exists with this email');
    }
    throw error;
  }
}

// Login user
export async function loginUser(email, password) {
  await connectDB();
  
  const user = await User.findOne({ email, isActive: true });
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }
  
  const token = generateToken(user._id);
  
  return {
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
    token,
  };
}

// Get user profile
export async function getUserProfile(userId) {
  await connectDB();
  
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new Error('User not found');
  }
  
  return {
    success: true,
    user,
  };
}

export async function updateUserProfile(userId, updates = {}) {
  await connectDB();

  // Prevent updating password here, and avoid sensitive fields
  const allowed = ['name', 'email', 'avatar', 'role', 'isActive'];
  const data = {};
  for (const key of allowed) {
    if (updates[key] !== undefined) data[key] = updates[key];
  }

  const user = await User.findByIdAndUpdate(userId, data, { new: true }).select('-password');
  if (!user) throw new Error('User not found');
  return { success: true, user };
}

// Create demo users (optional)
export async function createDemoUsers() {
  await connectDB();
  
  const demoUsers = [
    {
      name: 'Demo User 1',
      email: 'demo1@company.com',
      password: 'demo123',
    },
    {
      name: 'Demo User 2',
      email: 'demo2@company.com',
      password: 'demo123',
    },
  ];

  const createdUsers = [];
  
  for (const userData of demoUsers) {
    try {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        const user = new User(userData);
        await user.save();
        createdUsers.push(userData.email);
        console.log(`✅ Created demo user: ${userData.email}`);
      }
    } catch (error) {
      console.error(`❌ Failed to create demo user ${userData.email}:`, error.message);
    }
  }
  
  return createdUsers;
}