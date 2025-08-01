import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    // Check password against environment variable
    const adminPassword = process.env.ADMIN_PASSWORD || 'brewquest2024'
    
    if (password !== adminPassword) {
      // Log failed authentication attempt
      console.log(`Failed admin login attempt at ${new Date().toISOString()}`)
      
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    // Success - set authentication cookie
    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful'
    })

    // Set secure httpOnly cookie for authentication
    response.cookies.set('admin-auth', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })

    console.log(`Successful admin login at ${new Date().toISOString()}`)

    return response

  } catch (error) {
    console.error('Error in admin authentication:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}

// Logout endpoint
export async function DELETE() {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    })

    // Clear authentication cookie
    response.cookies.set('admin-auth', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    })

    console.log(`Admin logout at ${new Date().toISOString()}`)

    return response

  } catch (error) {
    console.error('Error in admin logout:', error)
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    )
  }
}