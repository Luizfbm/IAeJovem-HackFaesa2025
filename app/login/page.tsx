
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, LogIn, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [matricula, setMatricula] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        matricula: matricula.toUpperCase(),
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Matrícula ou senha incorreta.')
      } else {
        // Login bem-sucedido
        // Buscar informações do usuário para redirecionar corretamente
        try {
          const response = await fetch('/api/user')
          if (response.ok) {
            const userData = await response.json()
            
            // Verificar se precisa aceitar os termos
            if (!userData.termsAccepted) {
              window.location.href = '/terms-acceptance'
              return
            }
            
            // Redirecionar baseado no papel
            switch (userData.role) {
              case 'ALUNO':
                window.location.href = '/aluno'
                break
              case 'PROFESSOR':
                window.location.href = '/professor'
                break
              case 'ADMINISTRADOR':
                window.location.href = '/admin'
                break
              default:
                window.location.href = '/'
            }
          } else {
            // Fallback caso não consiga buscar os dados
            window.location.href = '/aluno'
          }
        } catch {
          // Fallback em caso de erro
          window.location.href = '/aluno'
        }
      }
    } catch (error) {
      setError('Erro interno. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-rose-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-r from-iaj-blue to-iaj-pink flex items-center justify-center mb-4">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Bem-vindo ao IAeJovem!
          </CardTitle>
          <CardDescription>
            Entre com sua matrícula para acessar seu espaço
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="matricula">Matrícula</Label>
              <Input
                id="matricula"
                type="text"
                placeholder="Ex: ALUNO1"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value.toUpperCase())}
                disabled={loading}
                className="text-center font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-iaj-blue to-iaj-pink hover:from-blue-600 hover:to-rose-600 text-white"
              disabled={loading || !matricula.trim() || !password.trim()}
            >
              {loading ? (
                'Entrando...'
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Entrar
                </>
              )}
            </Button>
          </form>

          <div className="text-center mt-6 pt-4 border-t">
            <p className="text-sm text-gray-500">
              Credenciais de teste:
            </p>
            <p className="text-sm font-mono text-gray-700 mt-1">
              ALUNO1 / 1234
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
