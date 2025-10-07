import { NextRequest, NextResponse } from 'next/server';
import { handleApiResponseError } from '@/utils/apiErrorHandler';

export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const token = request.headers.get('authorization');
    const { searchParams } = new URL(request.url);
    
    // Forward query parameters to backend
    const queryString = searchParams.toString();
    const backendUrlWithParams = queryString 
      ? `${backendUrl}/api/admin/buyforme-requests?${queryString}`
      : `${backendUrl}/api/admin/buyforme-requests`;
    
    const response = await fetch(backendUrlWithParams, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': token }),
      },
    });
    
    if (!response.ok) {
      const errorData = await handleApiResponseError(response);
      return NextResponse.json(errorData, { status: response.status });
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching BuyForMe requests:', error);
    return NextResponse.json(
      { 
        success: false,
        error: {
          type: 'network_error',
          message: 'Failed to fetch BuyForMe requests',
          statusCode: 500
        }
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const token = request.headers.get('authorization');
    const body = await request.json();
    
    const response = await fetch(`${backendUrl}/api/admin/buyforme-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': token }),
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      const errorData = await handleApiResponseError(response);
      return NextResponse.json(errorData, { status: response.status });
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error creating BuyForMe request:', error);
    return NextResponse.json(
      { 
        success: false,
        error: {
          type: 'network_error',
          message: 'Failed to create BuyForMe request',
          statusCode: 500
        }
      },
      { status: 500 }
    );
  }
}
