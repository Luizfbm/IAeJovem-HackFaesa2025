
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Gift, 
  Star, 
  Package, 
  CheckCircle,
  Clock,
  Loader2,
  ShoppingCart
} from 'lucide-react'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Product {
  id: string
  name: string
  description: string
  pointsCost: number
  stock: number
  image: string | null
}

interface Redemption {
  id: string
  code: string
  status: string
  createdAt: string
  product: Product
}

export default function LojaRecompensas() {
  const { data: session, update } = useSession()
  const [produtos, setProdutos] = useState<Product[]>([])
  const [resgates, setResgates] = useState<Redemption[]>([])
  const [loading, setLoading] = useState(true)
  const [resgatando, setResgatando] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const userPoints = session?.user?.points || 0

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    setLoading(true)
    try {
      const [produtosRes, resgatesRes] = await Promise.all([
        fetch('/api/aluno/produtos'),
        fetch('/api/aluno/meus-resgates')
      ])

      if (produtosRes.ok) {
        const data = await produtosRes.json()
        setProdutos(data.produtos)
      }

      if (resgatesRes.ok) {
        const data = await resgatesRes.json()
        setResgates(data.resgates)
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      toast.error('Erro ao carregar dados da loja')
    } finally {
      setLoading(false)
    }
  }

  const confirmarResgate = (produto: Product) => {
    setSelectedProduct(produto)
    setShowConfirmDialog(true)
  }

  const resgatarProduto = async () => {
    if (!selectedProduct) return

    if (userPoints < selectedProduct.pointsCost) {
      toast.error('Você não tem pontos suficientes')
      return
    }

    setResgatando(true)
    setShowConfirmDialog(false)

    try {
      const response = await fetch('/api/aluno/resgatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: selectedProduct.id })
      })

      if (response.ok) {
        const data = await response.json()
        
        toast.success(
          <div>
            <p className="font-bold">Produto resgatado com sucesso! 🎉</p>
            <p className="text-sm mt-1">Código: {data.code}</p>
            <p className="text-xs mt-1 text-gray-500">Apresente este código para retirar seu prêmio</p>
          </div>,
          { duration: 6000 }
        )

        // Atualizar pontos na sessão
        await update()
        
        // Recarregar dados
        carregarDados()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Erro ao resgatar produto')
      }
    } catch (error) {
      console.error('Erro ao resgatar:', error)
      toast.error('Erro ao processar resgate')
    } finally {
      setResgatando(false)
      setSelectedProduct(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-iaj-blue" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header com pontos */}
      <Card className="border-l-4 border-l-yellow-500 bg-gradient-to-r from-yellow-50 to-orange-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">Seus Pontos</h3>
              <p className="text-sm text-gray-600">Troque por recompensas incríveis!</p>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
              <span className="text-4xl font-bold text-gray-800">{userPoints}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="loja" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="loja">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Loja
          </TabsTrigger>
          <TabsTrigger value="meus-resgates">
            <Package className="w-4 h-4 mr-2" />
            Meus Resgates
          </TabsTrigger>
        </TabsList>

        {/* Loja */}
        <TabsContent value="loja" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {produtos.map((produto) => {
              const podeResgatar = userPoints >= produto.pointsCost && produto.stock > 0
              
              return (
                <Card key={produto.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-video bg-gray-100">
                    {produto.image ? (
                      <Image
                        src={produto.image}
                        alt={produto.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Gift className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    {produto.stock <= 5 && produto.stock > 0 && (
                      <Badge className="absolute top-2 right-2 bg-orange-500">
                        Últimas unidades
                      </Badge>
                    )}
                    {produto.stock === 0 && (
                      <Badge className="absolute top-2 right-2 bg-red-500">
                        Esgotado
                      </Badge>
                    )}
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-lg">{produto.name}</CardTitle>
                    <CardDescription>{produto.description}</CardDescription>
                  </CardHeader>
                  
                  <CardFooter className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="text-xl font-bold text-gray-800">
                        {produto.pointsCost}
                      </span>
                    </div>
                    
                    <Button
                      onClick={() => confirmarResgate(produto)}
                      disabled={!podeResgatar || resgatando}
                      className="bg-gradient-to-r from-iaj-blue to-blue-500 hover:from-blue-600 hover:to-blue-600"
                    >
                      {resgatando ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Resgatar'
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>

          {produtos.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  Nenhum produto disponível no momento.
                  <br />
                  Volte em breve para ver novidades!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Meus Resgates */}
        <TabsContent value="meus-resgates" className="mt-6">
          <div className="space-y-4">
            {resgates.map((resgate) => (
              <Card key={resgate.id}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {resgate.product.image ? (
                        <Image
                          src={resgate.product.image}
                          alt={resgate.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Gift className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-gray-800">{resgate.product.name}</h3>
                          <p className="text-sm text-gray-600">
                            {format(new Date(resgate.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                          </p>
                        </div>
                        
                        {resgate.status === 'AGUARDANDO_RETIRADA' ? (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                            <Clock className="w-3 h-3 mr-1" />
                            Aguardando retirada
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Entregue
                          </Badge>
                        )}
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3 border border-dashed border-gray-300">
                        <p className="text-xs text-gray-600 mb-1">Código de retirada:</p>
                        <p className="font-mono text-lg font-bold text-iaj-blue">
                          {resgate.code}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Apresente este código para retirar seu prêmio
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {resgates.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Você ainda não resgatou nenhum produto.
                    <br />
                    Continue conversando com a Ayla para ganhar pontos!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Diálogo de confirmação */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar resgate</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem certeza que deseja resgatar {selectedProduct?.name} por {selectedProduct?.pointsCost} pontos?
              <br />
              <br />
              Seus pontos atuais: <strong>{userPoints}</strong>
              <br />
              Pontos após resgate: <strong>{userPoints - (selectedProduct?.pointsCost || 0)}</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={resgatarProduto}>
              Confirmar resgate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
