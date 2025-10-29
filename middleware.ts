
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { NextRequestWithAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    const { pathname } = request.nextUrl
    const token = request.nextauth.token

    // Permitir acesso à página inicial (landing page) sempre
    if (pathname === '/') {
      return NextResponse.next()
    }

    // Se não estiver logado, redirecionar para home
    if (!token) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Verificar aceite de termos
    if (!token.termsAccepted && pathname !== '/terms-acceptance') {
      return NextResponse.redirect(new URL('/terms-acceptance', request.url))
    }

    const userRole = token.role

    // Redirecionar baseado no papel do usuário
    if (pathname === '/dashboard') {
      if (userRole === 'ALUNO') {
        return NextResponse.redirect(new URL('/aluno', request.url))
      } else if (userRole === 'PROFESSOR') {
        return NextResponse.redirect(new URL('/professor', request.url))
      } else if (userRole === 'ADMINISTRADOR') {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
    }

    // Proteger rotas específicas por papel
    if (pathname.startsWith('/aluno') && userRole !== 'ALUNO') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    if (pathname.startsWith('/professor') && userRole !== 'PROFESSOR') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    if (pathname.startsWith('/admin') && userRole !== 'ADMINISTRADOR') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Permitir acesso à landing page sempre
        if (pathname === '/') return true
        
        // Para outras rotas, verificar se tem token
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    '/aluno/:path*',
    '/professor/:path*', 
    '/admin/:path*',
    '/dashboard',
    '/terms-acceptance'
  ]
}
