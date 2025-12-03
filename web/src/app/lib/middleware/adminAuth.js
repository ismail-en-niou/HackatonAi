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
      return { isAdmin: false, error: 'No authentication token provided' };
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.userId) {
      return { isAdmin: false, error: 'Invalid token' };
    }

    // Get user from database
    await connectDB();
    const user = await User.findById(decoded.userId).select('role email name');
    
    if (!user) {
      return { isAdmin: false, error: 'User not found' };
    }

    if (user.role !== 'admin') {
      return { isAdmin: false, error: 'Access denied. Admin privileges required.', user };
    }

    return { isAdmin: true, user };
  } catch (error) {
    console.error('Admin verification error:', error);
    return { isAdmin: false, error: 'Authentication failed' };
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
      return { isAuthenticated: false, error: 'No authentication token provided' };
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.userId) {
      return { isAuthenticated: false, error: 'Invalid token' };
    }

    // Get user from database
    await connectDB();
    const user = await User.findById(decoded.userId).select('role email name');
    
    if (!user) {
      return { isAuthenticated: false, error: 'User not found' };
    }

    return { isAuthenticated: true, user };
  } catch (error) {
    console.error('User verification error:', error);
    return { isAuthenticated: false, error: 'Authentication failed' };
  }
}
