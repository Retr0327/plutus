import { z } from 'zod';
import { ZodToCls } from '@common/pipes/zod-validation.pipe';

const auditLogListQuerySchema = z.object({
  entityType: z.string().optional(),
  entityId: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export class AuditLogListQueryDto extends ZodToCls(auditLogListQuerySchema) {}
