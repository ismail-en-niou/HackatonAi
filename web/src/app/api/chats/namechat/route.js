import { NextResponse } from 'next/server';

const AI_URL = process.env.AI_URL || 'http://localhost:8000';

export async function POST(request) {
  try {
    const body = await request.json();
    const query = (body?.query || body?.message || '').trim();
    
    if (!query) {
      return NextResponse.json({ 
        success: false, 
        error: 'Query is required' 
      }, { status: 400 });
    }

    const response = await fetch(`${AI_URL}/namechat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI service namechat error:', errorText);
      return NextResponse.json({ 
        success: false, 
        error: errorText || 'Failed to generate chat name' 
      }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ 
      success: true, 
      name: data.name || data.title || data,
      ...data
    });
  } catch (error) {
    console.error('Namechat proxy error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Internal server error' 
    }, { status: 500 });
  }
}
