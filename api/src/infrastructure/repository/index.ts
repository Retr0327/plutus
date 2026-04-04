import { Provider } from '@nestjs/common';
import {
  AuditLogDomain,
  AuditLogDomainRepository,
} from './audit-log.repository';
import {
  CampaignDomain,
  CampaignDomainRepository,
} from './campaign.repository';
import { InvoiceDomain, InvoiceDomainRepository } from './invoice.repository';

export const repositoryProviders: Provider[] = [
  {
    provide: AuditLogDomain.Repository,
    useClass: AuditLogDomainRepository,
  },
  {
    provide: CampaignDomain.Repository,
    useClass: CampaignDomainRepository,
  },
  {
    provide: InvoiceDomain.Repository,
    useClass: InvoiceDomainRepository,
  },
];
