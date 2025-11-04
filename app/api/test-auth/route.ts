
import { NextRequest, NextResponse } from 'next/server'
import { signIn, getSession } from 'next-auth/react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const { action, matricula, password } = await request.json()

    if (action === 'login') {
      // Testar login com credenciais de teste
      const result = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/callback/credentials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          matricula: matricula || 'ALUNO1',
          password: password || '1234',
          csrfToken: 'test',
        })
      })

      if (result.ok) {
        return NextResponse.json({ 
          success: true, 
          message: 'Login successful' 
        })
      } else {
        return NextResponse.json({ 
          success: false, 
          message: 'Login failed' 
        }, { status: 401 })
      }
    }

    if (action === 'signup') {
      // No IAeJovem, não há signup público
      return NextResponse.json({ 
        success: false, 
        message: 'Signup not available - only admins can create users' 
      }, { status: 400 })
    }

    return NextResponse.json({ 
      success: false, 
      message: 'Invalid action' 
    }, { status: 400 })

  } catch (error) {
    console.error('Test auth error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Internal error' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    return NextResponse.json({
      authenticated: !!session,
      user: session?.user || null
    })
  } catch (error) {
    return NextResponse.json({
      authenticated: false,
      user: null,
      error: 'Session check failed'
    })
  }
}
