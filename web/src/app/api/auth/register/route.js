// src/app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import { registerUser } from '@/app/lib/controllers/authController';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();
    console.log("Register request data:", { name, email, password });
    if (!name || !email || !password) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'All fields are required: name, email, and password' 
        },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Please provide a valid email address' 
        },
        { status: 400 }
      );
    }

    // Password length validation
    if (password.length < 6) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Password must be at least 6 characters long' 
        },
        { status: 400 }
      );
    }

    // Register user
    const result = await registerUser({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
    });

    return NextResponse.json(result, { status: 201 });
    
  } catch (error) {
    console.error('Register error:', error);
    
    // Handle specific error types
    if (error.message.includes('already exists')) {
      return NextResponse.json(
        { 
          success: false, 
          error: error.message 
        },
        { status: 409 } // Conflict
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error. Please try again later.' 
      },
      { status: 500 }
    );
  }
}