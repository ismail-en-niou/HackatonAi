import { NextResponse } from 'next/server';
import { verifyAdmin } from '../../../lib/middleware/adminAuth';
import { updateUserProfile } from '../../../lib/controllers/authController';

/**
 * Make a user an admin
 * This endpoint requires admin privileges OR can be used with a special secret key for initial setup
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, email, setupSecret } = body;

    // Check if this is initial setup using secret key
    const isSetup = setupSecret === process.env.ADMIN_SETUP_SECRET;
    
    if (!isSetup) {
      // If not setup, require admin authentication
      const { isAdmin, error } = await verifyAdmin(request);
      
      if (!isAdmin) {
        return NextResponse.json(
          { success: false, error: error || 'Access denied. Admin privileges required.' },
          { status: 403 }
        );
      }
    }

    if (!userId && !email) {
      return NextResponse.json(
        { success: false, error: 'userId or email is required' },
        { status: 400 }
      );
    }

    // Import User model here to avoid circular dependencies
    const User = (await import('../../../lib/models/Users')).default;
    await (await import('../../../lib/utils/database')).default();

    // Find user by ID or email
    const query = userId ? { _id: userId } : { email };
    const user = await User.findOne(query);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user role to admin
    user.role = 'admin';
    await user.save();

    return NextResponse.json({
      success: true,
      message: `User ${user.email} is now an admin`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error making user admin:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
