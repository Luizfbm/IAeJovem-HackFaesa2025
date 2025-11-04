
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Heart, LogIn, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useRouter } from 'next/navigation'

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const [matricula, setMatricula] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [blockedUntil, setBlockedUntil] = useState<Date | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Verificar se está bloqueado
    if (blockedUntil && new Date() < blockedUntil) {
      const remainingSeconds = Math.ceil((blockedUntil.getTime() - Date.now()) / 1000)
      setError(`Aguarde ${remainingSeconds} segundos antes de tentar novamente.`)
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        matricula: matricula.toUpperCase(),
        password,
        redirect: false,
      })

      if (result?.error) {
        const newAttempts = attempts + 1
        setAttempts(newAttempts)
        
        if (newAttempts >= 5) {
          const blockTime = new Date(Date.now() + 30000) // 30 segundos
          setBlockedUntil(blockTime)
          setError('Muitas tentativas incorretas. Aguarde 30 segundos.')
          setAttempts(0)
        } else {
          setError('Matrícula ou senha incorreta.')
        }
      } else {
        // Login bem-sucedido
        onOpenChange(false)
        setMatricula('')
        setPassword('')
        setAttempts(0)
        setBlockedUntil(null)
        
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

  const isBlocked = blockedUntil && new Date() < blockedUntil

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-r from-iaj-blue to-iaj-pink flex items-center justify-center mb-4">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Bem-vindo de volta!
          </DialogTitle>
          <p className="text-gray-600 mt-2">
            Entre com sua matrícula para acessar seu espaço
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="matricula">Matrícula</Label>
            <Input
              id="matricula"
              type="text"
              placeholder="Ex: ALUNO1"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value.toUpperCase())}
              disabled={loading || (isBlocked ?? false)}
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
              disabled={loading || (isBlocked ?? false)}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {attempts > 0 && attempts < 5 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Tentativa {attempts} de 5. {5 - attempts} tentativas restantes.
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-iaj-blue to-iaj-pink hover:from-blue-600 hover:to-rose-600 text-white"
            disabled={loading || isBlocked || !matricula.trim() || !password.trim()}
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
            Não possui acesso?{' '}
            <span className="text-iaj-blue font-medium">
              Entre em contato com a coordenação
            </span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
