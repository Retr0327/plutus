import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DefaultEntity } from '@modules/postgres/common';
import { InvoiceLineItem } from './invoice-line-item.entity';

@Entity('adjustments')
export class Adjustment extends DefaultEntity {
  constructor(args?: Partial<Adjustment>) {
    super();
    Object.assign(this, args);
  }

  @Column('decimal', { precision: 12, scale: 2 })
  amount!: number;

  @Column({ length: 500 })
  reason!: string;

  @Column({ length: 255, name: 'created_by' })
  createdBy!: string;

  @Column('integer', { name: 'invoice_line_item_id' })
  invoiceLineItemId!: number;

  @ManyToOne(
    () => InvoiceLineItem,
    (invoiceLineItem) => invoiceLineItem.adjustments,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'invoice_line_item_id' })
  invoiceLineItem!: InvoiceLineItem;
}
