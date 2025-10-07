import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('🔐 Admin login API route called:', { email });

    // Proxy to backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const backendResponse = await fetch(`${backendUrl}/api/admin/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    console.log('🔐 Backend response status:', backendResponse.status);

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      console.error('🔐 Backend login error:', errorData);
      return NextResponse.json(
        { 
          success: false, 
          message: errorData.message || 'Login failed',
          error: errorData 
        },
        { status: backendResponse.status }
      );
    }

    const loginData = await backendResponse.json();
    console.log('🔐 Login successful:', { 
      adminName: loginData.admin?.name,
      hasToken: !!loginData.token 
    });

    return NextResponse.json(loginData);
  } catch (error: any) {
    console.error('🔐 Admin login API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: error.message 
      },
      { status: 500 }
    );
  }
}
