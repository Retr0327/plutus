import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';
import { DefaultEntity } from '@modules/postgres/common';
import { Adjustment } from './adjustment.entity';
import { CampaignLineItem } from './campaign-line-item.entity';
import { Invoice } from './invoice.entity';

@Entity('invoice_line_items')
@Unique('UQ_invoice_line_items_invoice_campaign_line', [
  'invoiceId',
  'campaignLineItemId',
])
export class InvoiceLineItem extends DefaultEntity {
  constructor(args?: Partial<InvoiceLineItem>) {
    super();
    Object.assign(this, args);
  }

  @Column('decimal', { precision: 12, scale: 2, name: 'actual_amount' })
  actualAmount!: number;

  @Column('integer', { name: 'invoice_id' })
  invoiceId!: number;

  @ManyToOne(() => Invoice, (invoice) => invoice.lineItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'invoice_id' })
  invoice!: Invoice;

  @Column('integer', { name: 'campaign_line_item_id' })
  campaignLineItemId!: number;

  @ManyToOne(() => CampaignLineItem, (lineItem) => lineItem.invoiceLineItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'campaign_line_item_id' })
  campaignLineItem!: CampaignLineItem;

  @OneToMany(() => Adjustment, (adjustment) => adjustment.invoiceLineItem)
  adjustments!: Adjustment[];
}
