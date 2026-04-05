import { z } from 'zod';
import { ZodToCls } from '@common/pipes/zod-validation.pipe';

const invoiceListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  status: z.enum(['draft', 'finalized']).optional(),
  campaignId: z.coerce.number().int().positive().optional(),
  includeArchived: z.coerce.boolean().default(false),
});

export class InvoiceListQueryDto extends ZodToCls(invoiceListQuerySchema) {}

const createAdjustmentSchema = z.object({
  amount: z
    .number()
    .refine((n) => n !== 0, { message: 'Amount cannot be zero' }),
  reason: z.string().trim().min(1).max(500),
  createdBy: z.string().trim().min(1).max(255),
});

export class CreateAdjustmentDto extends ZodToCls(createAdjustmentSchema) {}

const updateAdjustmentSchema = z
  .object({
    amount: z
      .number()
      .refine((n) => n !== 0, { message: 'Amount cannot be zero' })
      .optional(),
    reason: z.string().trim().min(1).max(500).optional(),
    updatedBy: z.string().trim().min(1).max(255),
  })
  .refine((data) => data.amount !== undefined || data.reason !== undefined, {
    message: 'At least one of amount or reason must be provided',
  });

export class UpdateAdjustmentDto extends ZodToCls(updateAdjustmentSchema) {}

const deleteAdjustmentQuerySchema = z.object({
  deletedBy: z.string().trim().min(1).max(255),
});

export class DeleteAdjustmentQueryDto extends ZodToCls(
  deleteAdjustmentQuerySchema,
) {}
