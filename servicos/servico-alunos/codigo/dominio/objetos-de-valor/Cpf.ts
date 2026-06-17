import { DomainError } from '../erros/ErroDeDominio';

/**
 * Value Object de CPF. Imutável e auto-validável: se uma instância existe,
 * ela é garantidamente válida. Isso elimina checagens espalhadas pelo código
 * (Clean Code) e concentra a regra do dígito verificador num único lugar.
 */
export class Cpf {
  private readonly digits: string;

  private constructor(digits: string) {
    this.digits = digits;
  }

  static create(raw: string): Cpf {
    const digits = (raw ?? '').replace(/\D/g, '');

    if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) {
      throw new DomainError(`CPF inválido: ${raw}`);
    }
    if (!Cpf.hasValidCheckDigits(digits)) {
      throw new DomainError(`CPF inválido: ${raw}`);
    }
    return new Cpf(digits);
  }

  private static hasValidCheckDigits(digits: string): boolean {
    const calcDigit = (length: number): number => {
      let sum = 0;
      for (let i = 0; i < length; i++) {
        sum += Number(digits[i]) * (length + 1 - i);
      }
      const remainder = (sum * 10) % 11;
      return remainder === 10 ? 0 : remainder;
    };
    return calcDigit(9) === Number(digits[9]) && calcDigit(10) === Number(digits[10]);
  }

  get value(): string {
    return this.digits;
  }

  format(): string {
    return this.digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  equals(other: Cpf): boolean {
    return this.digits === other.digits;
  }
}
