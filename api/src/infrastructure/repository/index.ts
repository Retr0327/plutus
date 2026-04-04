import { Provider } from '@nestjs/common';
import {
  AuditLogDomain,
  AuditLogDomainRepository,
} from './audit-log.repository';

export const repositoryProviders: Provider[] = [
  {
    provide: AuditLogDomain.Repository,
    useClass: AuditLogDomainRepository,
  },
];
