import { NextRequest, NextResponse } from 'next/server';
import { handleApiResponseError } from '@/utils/apiErrorHandler';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const token = request.headers.get('authorization');
    const body = await request.json();
    
    const response = await fetch(`${backendUrl}/api/admin/buyforme-requests/${params.id}/status`, {
      method: 'PATCH',
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
    console.error('Error updating BuyForMe request status:', error);
    return NextResponse.json(
      { 
        success: false,
        error: {
          type: 'network_error',
          message: 'Failed to update BuyForMe request status',
          statusCode: 500
        }
      },
      { status: 500 }
    );
  }
}
