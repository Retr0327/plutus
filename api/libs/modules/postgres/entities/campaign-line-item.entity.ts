import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { DefaultEntity, PrimaryCuidColumn } from '@modules/postgres/common';
import { Campaign } from './campaign.entity';
import { InvoiceLineItem } from './invoice-line-item.entity';

@Entity('campaign_line_items')
export class CampaignLineItem extends DefaultEntity {
  constructor(args?: Partial<CampaignLineItem>) {
    super();
    Object.assign(this, args);
  }

  @Column({ length: 255 })
  name!: string;

  @Column('decimal', { precision: 12, scale: 2, name: 'booked_amount' })
  bookedAmount!: number;

  @Column('decimal', { precision: 12, scale: 2, name: 'actual_amount' })
  actualAmount!: number;

  @PrimaryCuidColumn({ name: 'campaign_id' })
  campaignId!: string;

  @ManyToOne(() => Campaign, (campaign) => campaign.lineItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'campaign_id' })
  campaign!: Campaign;

  @OneToMany(
    () => InvoiceLineItem,
    (invoiceLineItem) => invoiceLineItem.campaignLineItem,
  )
  invoiceLineItems!: InvoiceLineItem[];
}
