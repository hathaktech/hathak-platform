import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const token = request.headers.get('authorization');
    
    if (!token) {
      return NextResponse.json(
        { 
          success: false,
          error: {
            type: 'authentication',
            message: 'Authorization token required',
            statusCode: 401
          }
        },
        { status: 401 }
      );
    }

    // Forward the request to the correct backend endpoint
    const response = await fetch(`${backendUrl}/api/user/buyforme-requests`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching user BuyForMe requests:', error);
    return NextResponse.json(
      { 
        success: false,
        error: {
          type: 'server_error',
          message: 'Failed to fetch BuyForMe requests',
          statusCode: 500
        }
      },
      { status: 500 }
    );
  }
}
