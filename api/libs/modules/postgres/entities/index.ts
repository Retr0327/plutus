import type { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { Adjustment } from './adjustment.entity';
import { AuditLog } from './audit-log.entity';
import { CampaignLineItem } from './campaign-line-item.entity';
import { Campaign } from './campaign.entity';
import { InvoiceLineItem } from './invoice-line-item.entity';
import { Invoice } from './invoice.entity';

const entities: EntityClassOrSchema[] = [
  Adjustment,
  AuditLog,
  Campaign,
  InvoiceLineItem,
  Invoice,
  CampaignLineItem,
] as const;

export {
  Adjustment,
  AuditLog,
  Campaign,
  InvoiceLineItem,
  Invoice,
  CampaignLineItem,
  entities,
};
