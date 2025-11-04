
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import dynamic from 'next/dynamic'

// @ts-ignore
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

interface EmocaoDia {
  data: string
  emocoes: string[]
  sentimentoMedio: number
  totalConversas: number
}

interface DadosEmocoes {
  emocoesPorDia: EmocaoDia[]
  totalConversas: number
}

export default function GraficoEvolucaoEmocional() {
  const [dados, setDados] = useState<DadosEmocoes | null>(null)
  const [loading, setLoading] = useState(true)
  const [periodo, setPeriodo] = useState<'7' | '30' | '90'>('30')

  useEffect(() => {
    carregarDados()
  }, [periodo])

  const carregarDados = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/aluno/emocoes?days=${periodo}`)
      if (response.ok) {
        const data = await response.json()
        setDados(data)
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-iaj-blue" />
        </CardContent>
      </Card>
    )
  }

  if (!dados || dados.totalConversas === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Evolução Emocional</CardTitle>
          <CardDescription>Acompanhe como você tem se sentido ao longo do tempo</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <p className="text-gray-500">
            Você ainda não tem conversas suficientes para gerar gráficos.
            <br />
            Continue conversando com a Ayla para ver sua evolução emocional!
          </p>
        </CardContent>
      </Card>
    )
  }

  // Preparar dados para o gráfico de linha (sentimento ao longo do tempo)
  const datasFormatadas = dados.emocoesPorDia.map(d => 
    format(parseISO(d.data), 'dd/MM', { locale: ptBR })
  )
  const sentimentos = dados.emocoesPorDia.map(d => d.sentimentoMedio)

  // Calcular tendência
  const ultimosSentimentos = sentimentos.slice(-7)
  const mediaRecente = ultimosSentimentos.reduce((a, b) => a + b, 0) / ultimosSentimentos.length
  const mediaAnterior = sentimentos.slice(0, -7).reduce((a, b) => a + b, 0) / Math.max(1, sentimentos.length - 7)
  const tendencia = mediaRecente > mediaAnterior + 0.1 ? 'positiva' : 
                    mediaRecente < mediaAnterior - 0.1 ? 'negativa' : 'estavel'

  // Contar emoções mais frequentes
  const contagemEmocoes: Record<string, number> = {}
  dados.emocoesPorDia.forEach(dia => {
    dia.emocoes.forEach(emocao => {
      contagemEmocoes[emocao] = (contagemEmocoes[emocao] || 0) + 1
    })
  })

  const emocoesOrdenadas = Object.entries(contagemEmocoes)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  const emocaoMaisFrequente = emocoesOrdenadas[0]?.[0] || 'Nenhuma'

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Evolução Emocional</CardTitle>
              <CardDescription>Como você tem se sentido ao longo do tempo</CardDescription>
            </div>
            <Tabs value={periodo} onValueChange={(v) => setPeriodo(v as any)}>
              <TabsList>
                <TabsTrigger value="7">7 dias</TabsTrigger>
                <TabsTrigger value="30">30 dias</TabsTrigger>
                <TabsTrigger value="90">90 dias</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Estatísticas */}
            <Card className="border-l-4 border-l-iaj-blue">
              <CardContent className="p-4">
                <div className="text-sm text-gray-600 mb-1">Tendência</div>
                <div className="flex items-center space-x-2">
                  {tendencia === 'positiva' && (
                    <>
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      <span className="text-lg font-bold text-green-500">Positiva</span>
                    </>
                  )}
                  {tendencia === 'negativa' && (
                    <>
                      <TrendingDown className="w-5 h-5 text-orange-500" />
                      <span className="text-lg font-bold text-orange-500">Atenção</span>
                    </>
                  )}
                  {tendencia === 'estavel' && (
                    <>
                      <Minus className="w-5 h-5 text-blue-500" />
                      <span className="text-lg font-bold text-blue-500">Estável</span>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-iaj-pink">
              <CardContent className="p-4">
                <div className="text-sm text-gray-600 mb-1">Emoção mais frequente</div>
                <div className="text-lg font-bold text-gray-800 capitalize">
                  {emocaoMaisFrequente}
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total de conversas</div>
                <div className="text-lg font-bold text-gray-800">
                  {dados.totalConversas}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de linha */}
          <div className="bg-white rounded-lg border p-4">
            {/* @ts-ignore */}
            <Plot
              data={[
                {
                  x: datasFormatadas,
                  y: sentimentos,
                  type: 'scatter',
                  mode: 'lines+markers',
                  marker: {
                    color: '#007EA0',
                    size: 8
                  },
                  line: {
                    color: '#007EA0',
                    width: 3,
                    shape: 'spline'
                  },
                  fill: 'tozeroy',
                  fillcolor: 'rgba(0, 126, 160, 0.1)',
                  name: 'Humor'
                }
              ]}
              layout={{
                title: {
                  text: 'Seu humor ao longo do tempo'
                },
                xaxis: {
                  title: {
                    text: 'Data'
                  },
                  showgrid: true,
                  gridcolor: '#f0f0f0'
                },
                yaxis: {
                  title: {
                    text: 'Nível de humor'
                  },
                  range: [-1, 1],
                  showgrid: true,
                  gridcolor: '#f0f0f0',
                  zeroline: true,
                  zerolinecolor: '#999',
                  tickvals: [-1, -0.5, 0, 0.5, 1],
                  ticktext: ['Muito triste', 'Triste', 'Neutro', 'Feliz', 'Muito feliz']
                },
                showlegend: false,
                hovermode: 'x unified',
                plot_bgcolor: 'white',
                paper_bgcolor: 'white',
                margin: { t: 50, r: 20, b: 50, l: 80 },
                height: 400
              }}
              config={{
                displayModeBar: false,
                responsive: true
              }}
              style={{ width: '100%' }}
            />
          </div>

          {/* Gráfico de barras - emoções mais frequentes */}
          {emocoesOrdenadas.length > 0 && (
            <div className="bg-white rounded-lg border p-4 mt-6">
              {/* @ts-ignore */}
              <Plot
                data={[
                  {
                    x: emocoesOrdenadas.map(([emocao]) => emocao),
                    y: emocoesOrdenadas.map(([, count]) => count),
                    type: 'bar',
                    marker: {
                      color: ['#E83E8C', '#007EA0', '#6C757D', '#17A2B8', '#FFC107'],
                    },
                    text: emocoesOrdenadas.map(([, count]) => String(count)),
                    textposition: 'outside'
                  }
                ]}
                layout={{
                  title: {
                    text: 'Suas emoções mais frequentes'
                  },
                  xaxis: {
                    title: {
                      text: 'Emoção'
                    },
                    showgrid: false
                  },
                  yaxis: {
                    title: {
                      text: 'Frequência'
                    },
                    showgrid: true,
                    gridcolor: '#f0f0f0'
                  },
                  showlegend: false,
                  plot_bgcolor: 'white',
                  paper_bgcolor: 'white',
                  margin: { t: 50, r: 20, b: 80, l: 60 },
                  height: 350
                }}
                config={{
                  displayModeBar: false,
                  responsive: true
                }}
                style={{ width: '100%' }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="border-l-4 border-l-iaj-pink">
        <CardHeader>
          <CardTitle className="text-lg">💡 Insights sobre sua jornada emocional</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {tendencia === 'positiva' && (
            <p className="text-gray-700">
              🌟 Que legal! Sua jornada emocional está em uma tendência positiva. Continue conversando com a Ayla e cuidando do seu bem-estar!
            </p>
          )}
          {tendencia === 'negativa' && (
            <p className="text-gray-700">
              💙 Percebemos que você pode estar passando por um momento mais difícil. Lembre-se que a Ayla está sempre aqui para te ouvir, e buscar apoio é um sinal de força.
            </p>
          )}
          {tendencia === 'estavel' && (
            <p className="text-gray-700">
              ⚖️ Seu humor tem se mantido estável. Continue se expressando e compartilhando seus sentimentos com a Ayla!
            </p>
          )}
          
          {dados.totalConversas >= 10 && (
            <p className="text-gray-700">
              🏆 Você já teve {dados.totalConversas} conversas! Manter esse hábito de se expressar é fundamental para o seu bem-estar emocional.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
