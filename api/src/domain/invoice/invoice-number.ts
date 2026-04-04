import { ValueObject } from '@common/domain/core/value-object';
import { Result } from '@common/result';

type InvoiceNumberProps = {
  value: string;
};

export class InvoiceNumber extends ValueObject<InvoiceNumberProps> {
  constructor(value: string) {
    super({ value });
  }

  get value() {
    return this.props.value;
  }

  static from(invoiceNumber: string) {
    return new InvoiceNumber(invoiceNumber);
  }

  static create(invoiceNumber: string) {
    const trimmed = invoiceNumber.trim();
    if (trimmed.length === 0) {
      return Result.Err(new Error('Invoice number cannot be empty'));
    }
    return Result.Ok(new InvoiceNumber(trimmed));
  }
}
