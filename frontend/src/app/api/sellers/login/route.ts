import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Make request to backend API
    const backendResponse = await fetch(`${process.env.BACKEND_URL || 'http://localhost:5000'}/api/seller/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(
        { message: data.message || 'Login failed' },
        { status: backendResponse.status }
      );
    }

    // Return success response with token from backend
    return NextResponse.json({
      message: 'Login successful',
      token: data.token,
      seller: {
        _id: data.seller._id,
        businessName: data.seller.businessName,
        email: data.seller.email,
        status: data.seller.status,
        isActive: data.seller.isActive
      }
    });

  } catch (error) {
    console.error('Seller login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
