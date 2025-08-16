import { NextRequest, NextResponse } from 'next/server';
import { getValidToken } from '@/lib/auth-tokens';

export async function POST(request: NextRequest) {
  try {
    const { provider } = await request.json();

    if (!provider) {
      return NextResponse.json(
        { error: 'Provider is required' },
        { status: 400 }
      );
    }

    const token = await getValidToken(provider);

    if (!token) {
      return NextResponse.json(
        { error: 'Failed to get valid token' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const provider = searchParams.get('provider');

    if (!provider) {
      return NextResponse.json(
        { error: 'Provider is required' },
        { status: 400 }
      );
    }

    const token = await getValidToken(provider);

    if (!token) {
      return NextResponse.json(
        { error: 'No valid token available' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      hasValidToken: true 
    });
  } catch (error) {
    console.error('Token check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}