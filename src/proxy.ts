import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from './lib/auth'
import { headers } from 'next/headers'

export async function proxy(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })
    
    const user = session?.user

    // If user is not authenticated, redirect to login page
    if (!user) {
      const loginUrl = new URL('/login', request.url)
      // Attach callback URL so the user can be redirected back after logging in
      loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Allow the request to proceed if user is logged in
    return NextResponse.next()
  } catch (error) {
    // Fallback error handling: safe redirect to login if session fetch fails
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  // Covers main private routes and any nested sub-routes
  matcher: [
    '/create-event/:path*',
    '/manage-events/:path*',
    '/joined-events/:path*',
  ],
}