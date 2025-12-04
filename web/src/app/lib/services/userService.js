// src/lib/services/userService.js
import User from '../models/Users';
import connectDB from '../utils/database';
import bcrypt from 'bcryptjs';

/**
 * Get all users with optional filtering and pagination
 */
export async function getAllUsers({ search = '', page = 1, limit = 10, role = '', status = '' } = {}) {
  await connectDB();

  const query = {};

  // Search by name or email
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  // Filter by role
  if (role) {
    query.role = role;
  }

  // Filter by status
  if (status !== '') {
    query.isActive = status === 'active';
  }

  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments(query),
  ]);

  return {
    users,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get user by ID
 */
export async function getUserById(userId) {
  await connectDB();

  const user = await User.findById(userId).select('-password');
  
  if (!user) {
    throw new Error('User not found');
  }

  return user;
}

/**
 * Create new user (admin function)
 */
export async function createUser(userData) {
  await connectDB();

  // Check if user already exists
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  // Validate required fields
  if (!userData.name || !userData.email || !userData.password) {
    throw new Error('Name, email, and password are required');
  }

  // Create new user
  const user = new User({
    name: userData.name,
    email: userData.email,
    password: userData.password,
    role: userData.role || 'user',
    isActive: userData.isActive !== undefined ? userData.isActive : true,
  });

  await user.save();

  return user.toJSON();
}

/**
 * Update user
 */
export async function updateUser(userId, updates) {
  await connectDB();

  // Don't allow password update through this function
  const allowedFields = ['name', 'email', 'role', 'isActive', 'avatar'];
  const filteredUpdates = {};

  for (const key of allowedFields) {
    if (updates[key] !== undefined) {
      filteredUpdates[key] = updates[key];
    }
  }

  // If email is being updated, check for duplicates
  if (filteredUpdates.email) {
    const existingUser = await User.findOne({ 
      email: filteredUpdates.email,
      _id: { $ne: userId }
    });
    
    if (existingUser) {
      throw new Error('Email already in use');
    }
  }

  const user = await User.findByIdAndUpdate(
    userId,
    filteredUpdates,
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}

/**
 * Delete user (soft delete by setting isActive to false)
 */
export async function deleteUser(userId) {
  await connectDB();

  const user = await User.findByIdAndUpdate(
    userId,
    { isActive: false },
    { new: true }
  ).select('-password');

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}

/**
 * Permanently delete user
 */
export async function permanentDeleteUser(userId) {
  await connectDB();

  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    throw new Error('User not found');
  }

  return { success: true };
}

/**
 * Suspend/Unsuspend user
 */
export async function toggleUserStatus(userId) {
  await connectDB();

  const user = await User.findById(userId);
  
  if (!user) {
    throw new Error('User not found');
  }

  user.isActive = !user.isActive;
  await user.save();

  return user.toJSON();
}

/**
 * Reset user password
 */
export async function resetUserPassword(userId, newPassword) {
  await connectDB();

  if (!newPassword || newPassword.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  const user = await User.findById(userId);
  
  if (!user) {
    throw new Error('User not found');
  }

  user.password = newPassword;
  await user.save();

  return { success: true };
}

/**
 * Get user statistics
 */
export async function getUserStats() {
  await connectDB();

  const [totalUsers, activeUsers, adminUsers, suspendedUsers] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActive: true }),
    User.countDocuments({ role: 'admin' }),
    User.countDocuments({ isActive: false }),
  ]);

  return {
    total: totalUsers,
    active: activeUsers,
    admins: adminUsers,
    suspended: suspendedUsers,
  };
}
