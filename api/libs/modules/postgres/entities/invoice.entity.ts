import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { DefaultEntity, PrimaryCuidColumn } from '@modules/postgres/common';
import { Campaign } from '@modules/postgres/entities/campaign.entity';
import { InvoiceLineItem } from '@modules/postgres/entities/invoice-line-item.entity';
import { InvoiceStatus } from '@modules/postgres/enum';

@Entity('invoices')
export class Invoice extends DefaultEntity {
  constructor(args?: Partial<Invoice>) {
    super();
    Object.assign(this, args);
  }

  @Column({ length: 50, unique: true, name: 'invoice_number' })
  invoiceNumber!: string;

  @Column({ type: 'varchar', length: 20, default: InvoiceStatus.Draft })
  status!: InvoiceStatus;

  @PrimaryCuidColumn({ name: 'campaign_id' })
  campaignId!: string;

  @Column({ type: 'bigint', name: 'archived_at', nullable: true })
  archivedAt!: number | null;

  @ManyToOne(() => Campaign, (campaign) => campaign.invoices, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'campaign_id' })
  campaign!: Campaign;

  @OneToMany(() => InvoiceLineItem, (item) => item.invoice)
  lineItems!: InvoiceLineItem[];
}
