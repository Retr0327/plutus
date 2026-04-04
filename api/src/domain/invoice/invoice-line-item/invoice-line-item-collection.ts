import Collection from '@common/domain/collection';
import { InvoiceLineItem } from './invoice-line-item';

export class InvoiceLineItemCollection extends Collection<InvoiceLineItem> {
  isSameItem(a: InvoiceLineItem, b: InvoiceLineItem) {
    return a.equals(b);
  }
}
