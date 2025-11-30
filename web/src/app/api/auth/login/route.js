// src/app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import { loginUser } from '@/app/lib/controllers/authController';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Email and password are required' 
        },
        { status: 400 }
      );
    }

    // Login user
    const result = await loginUser(email, password);

    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Login error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Invalid email or password' 
      },
      { status: 401 }
    );
  }
}