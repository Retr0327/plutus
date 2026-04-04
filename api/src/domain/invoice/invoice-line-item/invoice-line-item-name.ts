import { ValueObject } from '@common/domain/core/value-object';
import { Result } from '@common/result';

type InvoiceLineItemNameProps = {
  value: string;
};

export class InvoiceLineItemName extends ValueObject<InvoiceLineItemNameProps> {
  constructor(value: string) {
    super({ value });
  }

  get value() {
    return this.props.value;
  }

  static from(name: string) {
    return new InvoiceLineItemName(name);
  }

  static create(name: string) {
    const trimmed = name.trim();
    if (trimmed.length === 0) {
      return Result.Err(new Error('Invoice line item name cannot be empty'));
    }
    return Result.Ok(new InvoiceLineItemName(trimmed));
  }
}
