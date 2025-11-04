
import { PrismaClient, UserRole, Serie, Turma, RedemptionStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Limpar dados existentes
  await prisma.notification.deleteMany()
  await prisma.assignment.deleteMany()
  await prisma.note.deleteMany()
  await prisma.redemption.deleteMany()
  await prisma.score.deleteMany()
  await prisma.conversation.deleteMany()
  await prisma.product.deleteMany()
  await prisma.user.deleteMany()

  // Hash da senha padrão "1234"
  const hashedPassword = await bcrypt.hash('1234', 10)
  
  // Hash da senha do admin padrão
  const adminHashedPassword = await bcrypt.hash('johndoe123', 10)

  console.log('👥 Criando usuários para apresentação...')

  // Criar apenas 1 administrador
  const admin1 = await prisma.user.create({
    data: {
      name: 'Administrador Principal',
      matricula: 'ADM1',
      email: 'adm1@iaejovem.com',
      password: hashedPassword,
      role: UserRole.ADMINISTRADOR,
      termsAccepted: true,
    }
  })

  // Criar apenas 1 professor
  const professores = []
  const professor = await prisma.user.create({
    data: {
      name: 'Prof. Maria Silva',
      matricula: 'PROF1',
      email: 'prof1@iaejovem.com',
      serie: Serie.NONO_ANO,
      turma: Turma.A,
      password: hashedPassword,
      role: UserRole.PROFESSOR,
      termsAccepted: true,
    }
  })
  professores.push(professor)

  // Criar apenas 1 aluno com histórico de conversas e pontos
  const alunos = []
  const aluno = await prisma.user.create({
    data: {
      name: 'Lucas Santos',
      matricula: 'ALUNO1',
      email: 'aluno1@iaejovem.com',
      password: hashedPassword,
      role: UserRole.ALUNO,
      serie: Serie.NONO_ANO,
      turma: Turma.A,
      points: 85,
      termsAccepted: true,
    }
  })
  alunos.push({ ...aluno, scoreType: 'verde' })

  console.log('🏫 Criando atribuição professor-aluno...')

  // Atribuir o único aluno ao único professor
  await prisma.assignment.create({
    data: {
      teacherId: professor.id,
      studentId: aluno.id,
    }
  })

  console.log('💬 Criando conversas e scores para o aluno...')

  // Criar algumas conversas de exemplo para o aluno
  const numConversas = 3 // 3 conversas de exemplo
  
  for (let j = 0; j < numConversas; j++) {
    const diasAtras = [1, 3, 7][j] // 1, 3 e 7 dias atrás
    const dataConversa = new Date()
    dataConversa.setDate(dataConversa.getDate() - diasAtras)
    
    // Score verde para o aluno (7-10)
    const score = Math.random() * 3 + 7 // 7-10
    
    const mensagens = [
      {
        role: 'assistant',
        content: `Olá ${aluno.name}! Como você está se sentindo hoje?`
      },
      {
        role: 'user', 
        content: 'Estou me sentindo bem hoje!'
      },
      {
        role: 'assistant',
        content: 'Que bom ouvir isso! Fico feliz que você esteja bem.'
      }
    ]
    
    const duracao = Math.floor(Math.random() * 600) + 300 // 5-15 minutos
    
    const conversa = await prisma.conversation.create({
      data: {
        userId: aluno.id,
        messages: mensagens,
        score: Math.round(score * 10) / 10, // Arredondar para 1 decimal
        duration: duracao,
        createdAt: dataConversa,
      }
    })
    
    await prisma.score.create({
      data: {
        userId: aluno.id,
        conversationId: conversa.id,
        score: Math.round(score * 10) / 10,
        createdAt: dataConversa,
      }
    })
  }

  console.log('🛍️ Criando produtos da loja...')

  // Criar produtos para a loja com imagens
  const produtos = [
    { name: 'Fone de Ouvido Bluetooth', description: 'Fone de ouvido sem fio de qualidade premium', pointsCost: 150, stock: 5, image: '/products/fone-bluetooth.jpg' },
    { name: 'Livro Inspirador', description: 'Livro motivacional para jovens', pointsCost: 80, stock: 10, image: '/products/livro.jpg' },
    { name: 'Vale-Presente', description: 'R$ 50 para usar onde quiser', pointsCost: 120, stock: 8, image: '/products/vale-presente.jpg' },
    { name: 'Mochila Escolar', description: 'Mochila resistente e espaçosa com múltiplos compartimentos', pointsCost: 200, stock: 3, image: '/products/mochila.jpg' },
    { name: 'Kit Material Escolar', description: 'Kit completo com canetas, lápis, borrachas e muito mais', pointsCost: 60, stock: 15, image: '/products/kit-escolar.jpg' },
    { name: 'Fone com Fio', description: 'Fone de ouvido com fio de alta qualidade', pointsCost: 50, stock: 12, image: '/products/fone-com-fio.jpg' },
    { name: 'Mousepad Gamer', description: 'Mousepad grande para estudos e jogos', pointsCost: 40, stock: 20, image: '/products/mousepad.jpg' },
    { name: 'Camiseta IAeJovem', description: 'Camiseta exclusiva do programa', pointsCost: 100, stock: 8, image: '/products/camiseta.jpg' },
    { name: 'Carregador Portátil', description: 'Power bank de 10.000mAh para seu celular', pointsCost: 90, stock: 7, image: '/products/powerbank.jpg' },
    { name: 'Squeeze Personalizada', description: 'Garrafa térmica para se manter hidratado', pointsCost: 70, stock: 15, image: '/products/squeeze.jpg' },
  ]

  for (const produto of produtos) {
    await prisma.product.create({
      data: produto
    })
  }

  console.log('🎯 Criando resgate de exemplo...')

  // Criar um resgate de exemplo para o aluno
  const produtoParaResgate = await prisma.product.findFirst()
  
  if (produtoParaResgate) {
    const codigo = `RES-2024-${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`
    
    const diasAtras = 5
    const dataResgate = new Date()
    dataResgate.setDate(dataResgate.getDate() - diasAtras)
    
    await prisma.redemption.create({
      data: {
        userId: aluno.id,
        productId: produtoParaResgate.id,
        code: codigo,
        status: RedemptionStatus.AGUARDANDO_RETIRADA,
        createdAt: dataResgate,
      }
    })
  }

  console.log('📝 Criando anotação do professor...')

  // Criar anotação do professor sobre o aluno
  await prisma.note.create({
    data: {
      teacherId: professor.id,
      studentId: aluno.id,
      note: 'Aluno participativo e interessado nas aulas. Demonstra bom engajamento emocional.',
    }
  })

  console.log('🔔 Criando notificações...')

  // Criar notificações para o administrador
  await prisma.notification.create({
    data: {
      userId: admin1.id,
      message: 'Produto "Mochila Escolar" com estoque baixo (3 unidades restantes).',
      read: false,
    }
  })
  
  await prisma.notification.create({
    data: {
      userId: admin1.id,
      message: 'Novos resgates aguardando processamento.',
      read: false,
    }
  })

  console.log('✅ Seed concluído com sucesso!')
  console.log('\n📊 Resumo dos dados criados:')
  
  const totalUsers = await prisma.user.count()
  const totalAlunos = await prisma.user.count({ where: { role: UserRole.ALUNO } })
  const totalProfessores = await prisma.user.count({ where: { role: UserRole.PROFESSOR } })
  const totalAdmins = await prisma.user.count({ where: { role: UserRole.ADMINISTRADOR } })
  const totalConversas = await prisma.conversation.count()
  const totalProdutos = await prisma.product.count()
  const totalResgates = await prisma.redemption.count()
  const totalNotifications = await prisma.notification.count()
  
  console.log(`👥 Total de usuários: ${totalUsers}`)
  console.log(`🎓 Alunos: ${totalAlunos}`)
  console.log(`👨‍🏫 Professores: ${totalProfessores}`)  
  console.log(`👨‍💼 Administradores: ${totalAdmins}`)
  console.log(`💬 Conversas: ${totalConversas}`)
  console.log(`🛍️ Produtos: ${totalProdutos}`)
  console.log(`🎁 Resgates: ${totalResgates}`)
  console.log(`🔔 Notificações: ${totalNotifications}`)
  
  console.log('\n🔑 CREDENCIAIS PARA APRESENTAÇÃO:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('👨‍🎓 Aluno: ALUNO1 / senha: 1234')
  console.log('👨‍🏫 Professor: PROF1 / senha: 1234')
  console.log('👨‍💼 Administrador: ADM1 / senha: 1234')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
