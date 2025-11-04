
import AlunoLayout from '@/components/layouts/aluno-layout'

export default function AlunoLayoutPage({
  children,
}: {
  children: React.ReactNode
}) {
  return <AlunoLayout>{children}</AlunoLayout>
}
