import { DomainError } from '../erros/ErroDeDominio';

/**
 * Value Object de e-mail. Garante formato válido na construção.
 */
export class Email {
  private static readonly PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(private readonly address: string) {}

  static create(raw: string): Email {
    const normalized = (raw ?? '').trim().toLowerCase();
    if (!Email.PATTERN.test(normalized)) {
      throw new DomainError(`E-mail inválido: ${raw}`);
    }
    return new Email(normalized);
  }

  get value(): string {
    return this.address;
  }

  equals(other: Email): boolean {
    return this.address === other.address;
  }
}
