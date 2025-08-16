import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  // Handle auth session updates first
  const authResponse = await updateSession(request);
  
  // If auth middleware returns a redirect, return it
  if (authResponse.status === 302) {
    return authResponse;
  }

  // Handle root redirect logic
  if (request.nextUrl.pathname === '/') {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const url = request.nextUrl.clone();
    url.pathname = `/${month}/${year}`;
    return NextResponse.redirect(url, 308);
  }
  
  return authResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images in the public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}