import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DefaultEntity, PrimaryCuidColumn } from '@modules/postgres/common';
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

  @PrimaryCuidColumn({ name: 'invoice_line_item_id' })
  invoiceLineItemId!: string;

  @ManyToOne(
    () => InvoiceLineItem,
    (invoiceLineItem) => invoiceLineItem.adjustments,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'invoice_line_item_id' })
  invoiceLineItem!: InvoiceLineItem;
}
