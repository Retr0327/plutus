import { Column, Entity, OneToMany } from 'typeorm';
import { DefaultEntity, TimeStampColumn } from '@modules/postgres/common';
import { CampaignLineItem } from './campaign-line-item.entity';
import { Invoice } from './invoice.entity';

@Entity('campaigns')
export class Campaign extends DefaultEntity {
  constructor(args?: Partial<Campaign>) {
    super();
    Object.assign(this, args);
  }

  @Column({ length: 255 })
  name!: string;

  @Column({ length: 255 })
  advertiser!: string;

  @TimeStampColumn({ name: 'start_date' })
  startDate!: string;

  @TimeStampColumn({ name: 'end_date' })
  endDate!: string;

  @Column({ type: 'bigint', name: 'archived_at', nullable: true })
  archivedAt!: number | null;

  @OneToMany(() => CampaignLineItem, (lineItem) => lineItem.campaign)
  lineItems!: CampaignLineItem[];

  @OneToMany(() => Invoice, (invoice) => invoice.campaign)
  invoices!: Invoice[];
}
