import { Provider } from '@nestjs/common';
import {
  AuditLogDomain,
  AuditLogDomainRepository,
} from './audit-log.repository';
import {
  CampaignDomain,
  CampaignDomainRepository,
} from './campaign.repository';

export const repositoryProviders: Provider[] = [
  {
    provide: AuditLogDomain.Repository,
    useClass: AuditLogDomainRepository,
  },
  {
    provide: CampaignDomain.Repository,
    useClass: CampaignDomainRepository,
  },
];
