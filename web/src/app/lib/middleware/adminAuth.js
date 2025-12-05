// src/lib/middleware/adminAuth.js
import jwt from 'jsonwebtoken';
import User from '../models/Users';
import connectDB from '../utils/database';

export async function verifyAdmin(request) {
  try {
    // Get token from Authorization header or cookies
    let token = null;
    
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
    
    // Fallback to cookies if no Authorization header
    if (!token) {
      const cookies = request.headers.get('cookie');
      if (cookies) {
        const tokenMatch = cookies.match(/token=([^;]+)/);
        if (tokenMatch) {
          token = tokenMatch[1];
        }
      }
    }

    if (!token) {
      return { success: false, error: 'No authentication token provided', status: 401 };
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.userId) {
      return { success: false, error: 'Invalid token', status: 401 };
    }

    // Get user from database
    await connectDB();
    const user = await User.findById(decoded.userId).select('role email name isActive');
    
    if (!user) {
      return { success: false, error: 'User not found', status: 404 };
    }

    if (!user.isActive) {
      return { success: false, error: 'Account is suspended', status: 403 };
    }

    if (user.role !== 'admin') {
      return { success: false, error: 'Access denied. Admin privileges required.', status: 403 };
    }
    console.log('Admin verified:', user.email);
    return { success: true, user , isAdmin: true};
  } catch (error) {
    console.error('Admin verification error:', error);
    if (error.name === 'JsonWebTokenError') {
      return { success: false, error: 'Invalid token', status: 401 };
    }
    if (error.name === 'TokenExpiredError') {
      return { success: false, error: 'Token expired', status: 401 };
    }
    return { success: false, error: 'Authentication failed', status: 500 };
  }
}

export async function verifyUser(request) {
  try {
    // Get token from Authorization header or cookies
    let token = null;
    
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
    
    // Fallback to cookies if no Authorization header
    if (!token) {
      const cookies = request.headers.get('cookie');
      if (cookies) {
        const tokenMatch = cookies.match(/token=([^;]+)/);
        if (tokenMatch) {
          token = tokenMatch[1];
        }
      }
    }

    if (!token) {
      return { success: false, error: 'No authentication token provided', status: 401 };
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.userId) {
      return { success: false, error: 'Invalid token', status: 401 };
    }

    // Get user from database
    await connectDB();
    const user = await User.findById(decoded.userId).select('role email name isActive');
    
    if (!user) {
      return { success: false, error: 'User not found', status: 404 };
    }

    if (!user.isActive) {
      return { success: false, error: 'Account is suspended', status: 403 };
    }

    return { success: true, user };
  } catch (error) {
    console.error('User verification error:', error);
    if (error.name === 'JsonWebTokenError') {
      return { success: false, error: 'Invalid token', status: 401 };
    }
    if (error.name === 'TokenExpiredError') {
      return { success: false, error: 'Token expired', status: 401 };
    }
    return { success: false, error: 'Authentication failed', status: 500 };
  }
}
