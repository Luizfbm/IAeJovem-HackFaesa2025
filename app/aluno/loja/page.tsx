
import LojaRecompensas from '@/components/aluno/loja-recompensas'

export default function LojaPage() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Loja de Recompensas</h1>
        <p className="text-gray-600">Troque seus pontos por prêmios incríveis!</p>
      </div>
      
      <LojaRecompensas />
    </div>
  )
}
