
# 💙 IAeJovem (IAJ) - Plataforma de Apoio Emocional para Estudantes

🌐 **[VER DEMO AO VIVO](iaejovem.abacusai.app)** | 📁 [GitHub](https://github.com/Luizfbm/IAeJovem-HackFaesa2025)
**IAeJovem (IAJ)** é uma plataforma de apoio emocional inovadora desenvolvida para estudantes, construída em torno de uma IA empática chamada **Ayla**. A plataforma oferece um espaço seguro, acolhedor e confidencial onde os estudantes podem conversar, se expressar e receber apoio emocional.

---

## 🎯 Visão Geral

A plataforma foi desenvolvida com foco total no bem-estar emocional dos estudantes, oferecendo:

- 🤗 **Conversa empática com Ayla**: IA treinada para oferecer escuta ativa e apoio emocional
- 🏆 **Sistema de pontos motivacional**: Recompensas por cuidar da saúde mental
- 🎁 **Loja de resgates**: Produtos e prêmios que incentivam o engajamento
- 📊 **Acompanhamento de bem-estar**: Professores podem monitorar scores emocionais
- 👨‍💼 **Gestão completa**: Administradores gerenciam toda a plataforma

---

## ✨ Funcionalidades Principais

### 👨‍🎓 Para Alunos
- **Conversar com Ayla**: Chat por texto com IA empática (voz vem na Fase 2)
- **Meus Pontos**: Visualização de pontos acumulados e histórico
- **Loja de Pontos**: Catálogo de prêmios para resgatar
- **Perfil**: Dados pessoais, histórico de conversas e resgates
- **Sistema de Pontos**: 10 pontos por conversa válida (mínimo 1 minuto), limite de 10 pontos/dia

### 👨‍🏫 Para Professores
- **Meus Alunos**: Lista alfabética com indicadores emocionais coloridos
  - 🟢 Verde (7-10): Está bem
  - 🟡 Amarelo (4-6): Atenção
  - 🔴 Vermelho (0-3): Risco emocional
- **Detalhes do Aluno**: Scores dos últimos 7 dias, anotações privadas
- **Notificações**: Alertas quando alunos apresentam scores baixos
- **Busca**: Encontrar alunos por nome ou matrícula

### 🧑‍💼 Para Administradores
- **Dashboard**: Indicadores gerais da instituição
- **Gerenciar Usuários**: Criar, editar e excluir alunos, professores e admins
- **Atribuir Alunos**: Vincular alunos a professores responsáveis
- **Gerenciar Produtos**: Controle da loja de resgates
- **Notificações Completas**: Alertas de scores baixos, estoque e resgates
- **Acesso Total**: Visualização de todos os alunos e estatísticas
- **🆕 Log de Auditoria**: Histórico completo de ações com filtros e exportação CSV
- **🆕 Ajuste de Pontos**: Adicione ou remova pontos com justificativa registrada
- **🆕 Arquivamento**: Sistema de arquivamento de dados por ano letivo
- **🆕 Análises com IA**: Insights inteligentes sobre bem-estar emocional
- **🆕 Ações em Massa**: Atribuir professores, ajustar pontos e enviar notificações em lote
- **🆕 Dark Mode**: Interface adaptável para modo claro e escuro

---

## 🛠️ Tecnologias Utilizadas

- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript
- **Banco de Dados**: PostgreSQL com Prisma ORM
- **Autenticação**: NextAuth.js
- **UI Components**: Radix UI + Tailwind CSS
- **IA**: ChatGPT API (Abacus.AI)
- **Gráficos**: Recharts (Fase 2)
- **PDFs**: jsPDF (Fase 2)

---

## 📦 Estrutura do Banco de Dados

### Tabelas Principais

- **User**: Usuários (alunos, professores, administradores)
- **Conversation**: Histórico de conversas com Ayla
- **EmotionalScore**: Scores emocionais (0-10) por conversa
- **Product**: Produtos da loja de resgates
- **Redemption**: Histórico de resgates de prêmios
- **Assignment**: Atribuições de alunos a professores
- **TeacherNote**: Anotações privadas dos professores
- **Notification**: Sistema de notificações
- **DailyPoints**: Controle de pontos diários
- **🆕 AuditLog**: Log de auditoria de todas as ações
- **🆕 PointAdjustment**: Histórico de ajustes manuais de pontos
- **🆕 YearArchive**: Arquivamento de dados por ano letivo

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- Node.js 18+ 
- Yarn
- PostgreSQL

### Instalação

```bash
# 1. Instalar dependências
cd nextjs_space
yarn install

# 2. Configurar variáveis de ambiente
# Criar arquivo .env baseado em .env.example
# Configurar DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL

# 3. Configurar banco de dados
yarn prisma generate
yarn prisma db push

# 4. Popular banco com dados de teste
yarn prisma db seed

# 5. Rodar em desenvolvimento
yarn dev

# 6. Acessar em http://localhost:3000
```

---

## 🔑 Logins de Teste

### Alunos
- **Matrículas**: ALUNO1, ALUNO2, ALUNO3, ALUNO4, ALUNO5 (até ALUNO28)
- **Senha**: 1234

### Professores
- **Matrículas**: PROF1, PROF2, PROF3, PROF4, PROF5 (até PROF7)
- **Senha**: 1234

### Administradores
- **Matrículas**: ADM1, ADM2
- **Senha**: 1234

---

## 🎨 Design e UX

### Paleta de Cores

- **Azul Royal (#2563EB)**: Confiança e calma - Painel do Aluno
- **Rosa Magenta (#EC4899)**: Acolhimento e empatia - Ayla
- **Verde Menta (#10B981)**: Serenidade e equilíbrio - Scores positivos
- **Roxo Lilás (#8B5CF6)**: Criatividade e sensibilidade - Destaques
- **Cinza**: Painel do Professor
- **Vermelho**: Painel do Administrador e alertas

### Princípios de Design

1. **Acolhedor e Empático**: Linguagem humanizada, nunca técnica
2. **Tranquilo**: Cores suaves, animações delicadas
3. **Confidencial**: Ênfase na privacidade das conversas
4. **Responsivo**: Funciona perfeitamente em desktop e mobile
5. **Acessível**: Navegação intuitiva e clara

---

## 🤖 Ayla - A IA Empática

**Ayla** é o coração da plataforma. Ela foi projetada para:

- ✅ Ouvir ativamente e validar sentimentos
- ✅ Fazer perguntas abertas e construtivas
- ✅ Nunca julgar ou criticar
- ✅ Lembrar de conversas anteriores
- ✅ Detectar situações de risco e oferecer ajuda
- ✅ Calcular scores emocionais (0-10) automaticamente

**Personalidade**: Empática, jovem, acolhedora e natural. Ayla conversa como uma amiga próxima que genuinamente se importa.

**Importante**: Ayla NUNCA se refere como "IA", "chatbot" ou "assistente". Ela é simplesmente Ayla.

---

## 📊 Sistema de Scores Emocionais

### Escala (0-10)

- **🔴 0-3 (Vermelho)**: Risco emocional - Requer atenção imediata
- **🟡 4-6 (Amarelo)**: Atenção - Pode precisar de suporte
- **🟢 7-10 (Verde)**: Está bem - Situação emocional positiva

### Cálculo

- Score calculado pela Ayla ao final de cada conversa
- Baseado em: tom emocional, problemas mencionados, engajamento
- Média de todas as conversas do aluno
- Visível apenas para professores e administradores

---

## 📈 Roadmap - Próximas Fases

### ✅ FASE 1 - Core Essencial (CONCLUÍDA)
- Sistema de autenticação completo
- Painéis para 3 tipos de usuários
- Chat por texto com Ayla
- Sistema de pontos e loja básica
- Scores emocionais
- Gestão de usuários e produtos
- Dados de teste completos

### ✅ FASE 2 - Expansão (CONCLUÍDA)
- 🎤 **Conversa por VOZ** com Ayla (speech-to-text e text-to-speech)
- 📊 **Gráficos de evolução** emocional
- 🖼️ **Loja com imagens** reais dos produtos
- 🔔 **Sistema de notificações** completo
- 📈 **Tela expandida** de alunos com gráficos do mês

### ✅ FASE 3 - Features Avançadas (CONCLUÍDA)
- 🌙 **Dark mode** - Alterne entre modo claro e escuro
- 📜 **Log de auditoria completo** - Histórico de todas as ações na plataforma
- 📦 **Sistema de arquivamento de ano letivo** - Organize dados por ano
- 🤖 **IA para análises personalizadas** - Insights inteligentes sobre bem-estar
- ⚡ **Ações em massa** - Execute operações para múltiplos alunos
- 📧 **Ajuste manual de pontos** - Adicione ou remova pontos com justificativa

---

## 🔒 Segurança e Privacidade

- ✅ Conversas são **totalmente confidenciais**
- ✅ Professores e ADMs **não têm acesso** ao conteúdo das conversas
- ✅ Apenas scores e estatísticas são visíveis
- ✅ Senhas são hash com bcrypt
- ✅ Sessões seguras com NextAuth
- ✅ Validações em todas as APIs
- ✅ Bloqueio após 5 tentativas de login (30s)

---

## 🎓 Estrutura Escolar

### Séries Suportadas
- 6º ano, 7º ano, 8º ano, 9º ano
- 1º Ensino Médio, 2º Ensino Médio, 3º Ensino Médio

### Turmas
- Turma A, Turma B, Turma C

### Atribuições
- 1 aluno → 1 professor (exclusivo)
- 1 professor → N alunos (ilimitado)
- Professor é representante de uma turma específica

---

## 🛍️ Loja de Resgates

### Produtos Disponíveis (Exemplos)

1. Fone Bluetooth (150 pontos)
2. Livro Popular (80 pontos)
3. Vale-Presente R$50 (200 pontos)
4. Mochila (180 pontos)
5. Kit Escolar (60 pontos)
6. Squeeze (40 pontos)
7. Camiseta (90 pontos)
8. Mousepad (70 pontos)
9. Powerbank (160 pontos)
10. Fone com Fio (50 pontos)

### Processo de Resgate

1. Aluno escolhe produto e resgata (se tiver pontos)
2. Sistema gera tela de confirmação com:
   - Matrícula do aluno
   - Data e horário do resgate
   - Código único (#RES-2024-XXXXX)
3. Aluno salva como PDF ou imagem
4. Apresenta aos responsáveis pelos brindes
5. ADM dá baixa no sistema (status: Entregue)

---

## 💡 Dicas de Uso

### Para Alunos
- Converse com a Ayla pelo menos 1 vez ao dia
- Seja sincero sobre seus sentimentos
- Lembre-se: suas conversas são confidenciais
- Acumule pontos e resgate prêmios legais!

### Para Professores
- Verifique diariamente os scores dos seus alunos
- Preste atenção especial em alunos com scores vermelhos
- Use o campo de anotações para registrar observações
- Converse pessoalmente com alunos que precisam de apoio

### Para Administradores
- Mantenha o estoque de produtos atualizado
- Atribua alunos aos professores da mesma série/turma
- Monitore as estatísticas gerais regularmente
- Dê baixa nos resgates prontamente

---

## 🤝 Contribuindo

Este é um projeto em desenvolvimento ativo. Sugestões e melhorias são bem-vindas!

---

## 📞 Suporte

Para dúvidas ou problemas:
- Verifique se todos os dados de teste foram criados (`yarn prisma db seed`)
- Confira as variáveis de ambiente no arquivo `.env`
- Certifique-se de que o PostgreSQL está rodando
- Consulte os logs do servidor para erros específicos

---

## 📄 Licença

Este projeto foi desenvolvido como parte do programa IAeJovem.

---

## 👥 Equipe

Desenvolvido com 💙 pela equipe IAeJovem

---

**Versão Atual**: 3.0.0 (Fase 3 - Completa)  
**Última Atualização**: Outubro 2025

---

### 🌟 Lembrança Importante

> "O IAeJovem não é apenas uma plataforma - é um espaço seguro onde cada estudante pode ser ouvido, compreendido e apoiado. A saúde mental importa, e estamos aqui para isso." 💙
