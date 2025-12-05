// src/app/api/admin/stats/route.js
import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/app/lib/middleware/adminAuth';
import { getUserStats } from '@/app/lib/services/userService';
import connectDB from '@/app/lib/utils/database';
import Conversation from '@/app/lib/models/Conversations';

/**
 * GET /api/admin/stats - Get admin dashboard statistics
 */
export async function GET(request) {
  try {
    const authResult = await verifyAdmin(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }

    await connectDB();

    // Get user stats
    const userStats = await getUserStats();

    // Get conversation stats
    const [totalConversations, activeConversations] = await Promise.all([
      Conversation.countDocuments(),
      Conversation.countDocuments({ isActive: true }),
    ]);

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentConversations = await Conversation.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    return NextResponse.json({
      success: true,
      stats: {
        users: userStats,
        conversations: {
          total: totalConversations,
          active: activeConversations,
          recent: recentConversations,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
