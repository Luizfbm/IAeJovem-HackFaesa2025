
import GraficoEvolucaoEmocional from '@/components/aluno/graficos/grafico-evolucao-emocional'

export default function MeuProgressoPage() {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Meu Progresso</h1>
        <p className="text-gray-600">Acompanhe sua evolução emocional e conquistas</p>
      </div>
      
      <GraficoEvolucaoEmocional />
    </div>
  )
}
