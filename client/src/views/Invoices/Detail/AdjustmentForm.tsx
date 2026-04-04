'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import { Button, Group, NumberInput, Stack, Text, TextInput } from '@mantine/core';
import { useCreateAdjustment, useUpdateAdjustment } from '@plutus/hooks';
import type { Adjustment } from '@plutus/types/invoice';

const createSchema = z.object({
  amount: z.number().refine((n) => n !== 0, { message: 'Amount cannot be zero' }),
  reason: z.string().trim().min(1, 'Required').max(500, 'Max 500 characters'),
  createdBy: z.string().trim().min(1, 'Required').max(255),
});

const updateSchema = z.object({
  amount: z
    .number()
    .refine((n) => n !== 0, 'Amount cannot be zero')
    .optional(),
  reason: z.string().trim().min(1).max(500).optional(),
  updatedBy: z.string().trim().min(1, 'Required').max(255),
});

interface AdjustmentFormProps {
  invoiceId: string;
  lineItemId: string;
  adjustment?: Adjustment;
  onClose: () => void;
}

export function AdjustmentForm({
  invoiceId,
  lineItemId,
  adjustment,
  onClose,
}: AdjustmentFormProps) {
  const isEdit = !!adjustment;
  const createMutation = useCreateAdjustment();
  const updateMutation = useUpdateAdjustment();

  const createForm = useForm<z.infer<typeof createSchema>>({
    resolver: zodResolver(createSchema),
    defaultValues: { amount: 0, reason: '', createdBy: '' },
  });

  const editForm = useForm<z.infer<typeof updateSchema>>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      amount: adjustment?.amount,
      reason: adjustment?.reason,
      updatedBy: '',
    },
  });

  const handleCreate = createForm.handleSubmit((values) => {
    createMutation.mutate({ invoiceId, lineItemId, ...values }, { onSuccess: onClose });
  });

  const handleUpdate = editForm.handleSubmit((values) => {
    if (!adjustment) return;
    updateMutation.mutate(
      { invoiceId, lineItemId, adjustmentId: adjustment.id, ...values },
      { onSuccess: onClose }
    );
  });

  if (isEdit) {
    return (
      <form onSubmit={handleUpdate}>
        <Stack>
          <Text size="sm" c="dimmed">
            Created by: {adjustment.createdBy}
          </Text>
          <NumberInput
            label="Amount"
            placeholder="Enter amount"
            decimalScale={2}
            value={editForm.watch('amount') ?? ''}
            onChange={(val) => editForm.setValue('amount', val === '' ? undefined : Number(val))}
            error={editForm.formState.errors.amount?.message}
          />
          <TextInput
            label="Reason"
            placeholder="Reason for adjustment"
            {...editForm.register('reason')}
            error={editForm.formState.errors.reason?.message}
          />
          <TextInput
            label="Updated By"
            placeholder="your@email.com"
            {...editForm.register('updatedBy')}
            error={editForm.formState.errors.updatedBy?.message}
          />
          <Group justify="flex-end">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={updateMutation.isPending}>
              Update
            </Button>
          </Group>
        </Stack>
      </form>
    );
  }

  return (
    <form onSubmit={handleCreate}>
      <Stack>
        <NumberInput
          label="Amount"
          placeholder="Enter amount (negative for credits)"
          decimalScale={2}
          required
          value={createForm.watch('amount')}
          onChange={(val) => createForm.setValue('amount', val === '' ? 0 : Number(val))}
          error={createForm.formState.errors.amount?.message}
        />
        <TextInput
          label="Reason"
          placeholder="Reason for adjustment"
          required
          {...createForm.register('reason')}
          error={createForm.formState.errors.reason?.message}
        />
        <TextInput
          label="Created By"
          placeholder="your@email.com"
          required
          {...createForm.register('createdBy')}
          error={createForm.formState.errors.createdBy?.message}
        />
        <Group justify="flex-end">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={createMutation.isPending}>
            Create
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
