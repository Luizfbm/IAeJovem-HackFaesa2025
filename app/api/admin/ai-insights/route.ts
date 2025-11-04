export const dynamic = 'force-dynamic';


import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';

// POST - Gerar insights com IA
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMINISTRADOR') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { type, filters } = await req.json();

    // Buscar dados relevantes
    let data: any = {};

    if (type === 'general') {
      // Estatísticas gerais
      const [totalStudents, totalConversations, avgScore] = await Promise.all([
        prisma.user.count({ where: { role: 'ALUNO' } }),
        prisma.conversation.count(),
        prisma.score.aggregate({ _avg: { score: true } }),
      ]);

      const studentsWithLowScore = await prisma.score.groupBy({
        by: ['userId'],
        where: {
          score: { lt: 4 },
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
        _count: true,
      });

      data = {
        totalStudents,
        totalConversations,
        avgScore: avgScore._avg.score?.toFixed(1) || 0,
        studentsAtRisk: studentsWithLowScore.length,
      };
    } else if (type === 'student' && filters?.studentId) {
      // Análise de um aluno específico
      const student = await prisma.user.findUnique({
        where: { id: filters.studentId },
        include: {
          conversations: {
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
          scores: {
            orderBy: { createdAt: 'desc' },
            take: 7,
          },
        },
      });

      if (!student) {
        return NextResponse.json({ error: 'Aluno não encontrado' }, { status: 404 });
      }

      const avgScore = student.scores.reduce((sum, s) => sum + s.score, 0) / student.scores.length || 0;
      const trend = student.scores.length >= 2
        ? student.scores[0].score - student.scores[student.scores.length - 1].score
        : 0;

      data = {
        studentName: student.name,
        studentMatricula: student.matricula,
        totalConversations: student.conversations.length,
        avgScore: avgScore.toFixed(1),
        trend: trend > 0 ? 'melhorando' : trend < 0 ? 'piorando' : 'estável',
        recentScores: student.scores.map(s => s.score),
      };
    }

    // Gerar insights com IA
    const apiKey = process.env.ABACUSAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key não configurada' }, { status: 500 });
    }

    const prompt = type === 'general'
      ? `Você é um analista educacional especializado em saúde mental de estudantes. Com base nos seguintes dados da plataforma IAeJovem:

- Total de alunos: ${data.totalStudents}
- Total de conversas: ${data.totalConversations}
- Score emocional médio: ${data.avgScore}/10
- Alunos em situação de risco: ${data.studentsAtRisk}

Forneça uma análise breve (máximo 150 palavras) com:
1. Avaliação geral do bem-estar emocional dos estudantes
2. Pontos de atenção principais
3. Recomendações práticas para a equipe pedagógica

Use uma linguagem profissional mas acessível.`
      : `Você é um analista educacional especializado em saúde mental de estudantes. Analise o seguinte perfil do aluno:

- Nome: ${data.studentName}
- Matrícula: ${data.studentMatricula}
- Total de conversas: ${data.totalConversations}
- Score emocional médio: ${data.avgScore}/10
- Tendência: ${data.trend}
- Scores recentes: ${data.recentScores.join(', ')}

Forneça uma análise breve (máximo 150 palavras) com:
1. Avaliação do estado emocional atual
2. Identificação de padrões relevantes
3. Recomendações específicas de acompanhamento

Use uma linguagem profissional mas acessível.`;

    const response = await fetch('https://api.abacus.ai/v1/chat/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: 'gpt-4o',
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao chamar API da IA');
    }

    const result = await response.json();
    const insights = result.choices?.[0]?.message?.content || 'Não foi possível gerar insights no momento.';

    return NextResponse.json({
      success: true,
      insights,
      data,
    });
  } catch (error) {
    console.error('Erro ao gerar insights:', error);
    return NextResponse.json({ error: 'Erro ao gerar insights' }, { status: 500 });
  }
}
