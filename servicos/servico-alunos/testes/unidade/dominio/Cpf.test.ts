import { Cpf } from '../../../codigo/dominio/objetos-de-valor/Cpf';
import { DomainError } from '../../../codigo/dominio/erros/ErroDeDominio';

describe('Cpf (Value Object)', () => {
  it('aceita um CPF válido com pontuação e normaliza', () => {
    const cpf = Cpf.create('529.982.247-25');
    expect(cpf.value).toBe('52998224725');
    expect(cpf.format()).toBe('529.982.247-25');
  });

  it('aceita um CPF válido somente com dígitos', () => {
    expect(Cpf.create('52998224725').value).toBe('52998224725');
  });

  it('rejeita CPF com dígito verificador incorreto', () => {
    expect(() => Cpf.create('529.982.247-24')).toThrow(DomainError);
  });

  it('rejeita CPF com todos os dígitos iguais', () => {
    expect(() => Cpf.create('111.111.111-11')).toThrow(DomainError);
  });

  it('rejeita CPF com quantidade de dígitos inválida', () => {
    expect(() => Cpf.create('123')).toThrow(DomainError);
  });

  it('compara dois CPFs por valor', () => {
    expect(Cpf.create('52998224725').equals(Cpf.create('529.982.247-25'))).toBe(true);
  });
});
