import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/') {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const url = request.nextUrl.clone();
    url.pathname = `/${month}/${year}`;
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}