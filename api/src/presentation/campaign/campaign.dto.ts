import { z } from 'zod';
import { ZodToCls } from '@common/pipes/zod-validation.pipe';

const campaignListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  advertiser: z.string().optional(),
  includeArchived: z.coerce.boolean().default(false),
});

export class CampaignListQueryDto extends ZodToCls(campaignListQuerySchema) {}
