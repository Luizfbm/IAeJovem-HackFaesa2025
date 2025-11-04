
'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { 
  MessageCircle, 
  Star, 
  Gift, 
  User, 
  LogOut, 
  Menu, 
  Heart,
  Home,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import NotificacoesDropdown from '@/components/aluno/notificacoes-dropdown'
import { ThemeSwitcher } from '@/components/theme-switcher'

const navigation = [
  { name: 'Início', href: '/aluno', icon: Home },
  { name: 'Conversar', href: '/aluno/conversar', icon: MessageCircle },
  { name: 'Meu Progresso', href: '/aluno/meu-progresso', icon: TrendingUp },
  { name: 'Loja de Pontos', href: '/aluno/loja', icon: Gift },
  { name: 'Perfil', href: '/aluno/perfil', icon: User },
]

interface AlunoLayoutProps {
  children: React.ReactNode
}

export default function AlunoLayout({ children }: AlunoLayoutProps) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center space-x-3 p-6 border-b bg-gradient-to-r from-iaj-blue to-iaj-pink text-white">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <Heart className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-bold text-lg">IAeJovem</h2>
          <p className="text-xs opacity-90">Painel do Estudante</p>
        </div>
      </div>

      {/* Saudação */}
      <div className="p-6 bg-gradient-to-br from-blue-50 to-rose-50 dark:from-gray-800 dark:to-gray-700 border-b dark:border-gray-700">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-lg">
          Olá, {session?.user?.name?.split(' ')[0]}! 👋
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
          Como você está se sentindo hoje?
        </p>
        <div className="flex items-center mt-3 space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="font-medium dark:text-gray-100">{session?.user?.points || 0} pontos</span>
          </div>
          <div className="text-gray-500 dark:text-gray-400">
            {session?.user?.serie} • {session?.user?.turma}
          </div>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => mobile && setSidebarOpen(false)}
              className={cn(
                'flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-iaj-blue to-iaj-pink text-white shadow-md'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-iaj-blue'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer com Logout */}
      <div className="p-4 border-t">
        <Button
          onClick={handleSignOut}
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sair
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 bg-white dark:bg-gray-900 shadow-xl border-r dark:border-gray-800">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-80 p-0">
          <SidebarContent mobile />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-800 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
              </Sheet>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-iaj-blue to-iaj-pink flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-gray-800 dark:text-gray-100">IAeJovem</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeSwitcher />
              <NotificacoesDropdown />
              <div className="flex items-center space-x-1 text-sm">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="font-medium dark:text-gray-100">{session?.user?.points || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Header - apenas notificações */}
        <div className="hidden lg:block bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-800 px-6 py-3">
          <div className="flex items-center justify-end space-x-3">
            <ThemeSwitcher />
            <NotificacoesDropdown />
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
