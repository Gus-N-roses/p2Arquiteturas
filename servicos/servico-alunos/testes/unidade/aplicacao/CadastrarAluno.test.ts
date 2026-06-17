import { RegisterStudent } from '../../../codigo/aplicacao/casos-de-uso/CadastrarAluno';
import { DomainError } from '../../../codigo/dominio/erros/ErroDeDominio';
import { InMemoryRepositorioAluno } from '../../../codigo/infraestrutura/repositorios/RepositorioAlunoEmMemoria';
import { GeradorDeIdsSequencial } from '../../suporte/dubles';

describe('RegisterStudent (Use Case)', () => {
  const validInput = { name: 'Maria Silva', cpf: '529.982.247-25', email: 'maria@email.com' };

  function makeSut() {
    const students = new InMemoryRepositorioAluno();
    const sut = new RegisterStudent(students, new GeradorDeIdsSequencial('std'));
    return { sut, students };
  }

  it('cadastra um aluno válido e persiste com id gerado', async () => {
    const { sut, students } = makeSut();

    const saida = await sut.executar(validInput);

    expect(saida.id).toBe('std-1');
    expect(saida.status).toBe('ACTIVE');
    expect(await students.findById('std-1')).not.toBeNull();
  });

  it('impede dois alunos com o mesmo CPF', async () => {
    const { sut } = makeSut();
    await sut.executar(validInput);

    await expect(sut.executar({ ...validInput, email: 'outro@email.com' })).rejects.toThrow(
      DomainError,
    );
  });

  it('rejeita nome muito curto', async () => {
    const { sut } = makeSut();
    await expect(sut.executar({ ...validInput, name: 'Jo' })).rejects.toThrow(DomainError);
  });

  it('rejeita e-mail inválido', async () => {
    const { sut } = makeSut();
    await expect(sut.executar({ ...validInput, email: 'invalido' })).rejects.toThrow(DomainError);
  });
});
