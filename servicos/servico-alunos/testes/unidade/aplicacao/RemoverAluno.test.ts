import { RemoverAluno } from '../../../codigo/aplicacao/casos-de-uso/RemoverAluno';
import { Student } from '../../../codigo/dominio/entidades/Aluno';
import { DomainError } from '../../../codigo/dominio/erros/ErroDeDominio';
import { Cpf } from '../../../codigo/dominio/objetos-de-valor/Cpf';
import { Email } from '../../../codigo/dominio/objetos-de-valor/Email';
import { InMemoryRepositorioAluno } from '../../../codigo/infraestrutura/repositorios/RepositorioAlunoEmMemoria';

describe('RemoverAluno (Use Case)', () => {
  async function montarCenario() {
    const alunos = new InMemoryRepositorioAluno();
    const aluno = Student.register({
      id: 'aluno-1',
      name: 'Maria Silva',
      cpf: Cpf.create('529.982.247-25'),
      email: Email.create('maria@email.com'),
    });
    await alunos.save(aluno);

    return { alunos, casoDeUso: new RemoverAluno(alunos) };
  }

  it('remove um aluno cadastrado', async () => {
    const { alunos, casoDeUso } = await montarCenario();

    const saida = await casoDeUso.executar({ alunoId: 'aluno-1' });

    expect(saida).toEqual({ id: 'aluno-1', removido: true });
    expect(await alunos.findById('aluno-1')).toBeNull();
  });

  it('rejeita a remoção de aluno inexistente', async () => {
    const { casoDeUso } = await montarCenario();

    await expect(casoDeUso.executar({ alunoId: 'aluno-404' })).rejects.toThrow(DomainError);
  });
});
