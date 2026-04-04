import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { API } from '@plutus/libs/config/api';
import { request } from '@plutus/libs/request';
import { queryKeys } from '@plutus/utils/query-keys';

interface CreateAdjustmentInput {
  invoiceId: string;
  lineItemId: string;
  amount: number;
  reason: string;
  createdBy: string;
}

interface UpdateAdjustmentInput {
  invoiceId: string;
  lineItemId: string;
  adjustmentId: string;
  amount?: number;
  reason?: string;
  updatedBy: string;
}

interface DeleteAdjustmentInput {
  invoiceId: string;
  lineItemId: string;
  adjustmentId: string;
  deletedBy: string;
}

export function useCreateAdjustment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ invoiceId, lineItemId, amount, reason, createdBy }: CreateAdjustmentInput) =>
      request(API.invoice.adjustments.create(invoiceId, lineItemId), {
        method: 'POST',
        body: JSON.stringify({ amount, reason, createdBy }),
      }),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: queryKeys.invoices.detail(variables.invoiceId) });
      qc.invalidateQueries({ queryKey: queryKeys.invoices.all });
      qc.invalidateQueries({
        queryKey: ['adjustments', 'history', variables.invoiceId, variables.lineItemId],
      });
      notifications.show({
        title: 'Adjustment created',
        message: 'The adjustment has been added successfully.',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red',
      });
    },
  });
}

export function useUpdateAdjustment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      invoiceId,
      lineItemId,
      adjustmentId,
      amount,
      reason,
      updatedBy,
    }: UpdateAdjustmentInput) =>
      request(API.invoice.adjustments.detail(invoiceId, lineItemId, adjustmentId), {
        method: 'PATCH',
        body: JSON.stringify({ amount, reason, updatedBy }),
      }),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: queryKeys.invoices.detail(variables.invoiceId) });
      qc.invalidateQueries({ queryKey: queryKeys.invoices.all });
      qc.invalidateQueries({
        queryKey: queryKeys.adjustments.history(
          variables.invoiceId,
          variables.lineItemId,
          variables.adjustmentId
        ),
      });
      notifications.show({
        title: 'Adjustment updated',
        message: 'The adjustment has been updated successfully.',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red',
      });
    },
  });
}

export function useDeleteAdjustment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ invoiceId, lineItemId, adjustmentId, deletedBy }: DeleteAdjustmentInput) =>
      request(
        `${API.invoice.adjustments.detail(invoiceId, lineItemId, adjustmentId)}?deletedBy=${encodeURIComponent(deletedBy)}`,
        { method: 'DELETE' }
      ),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: queryKeys.invoices.detail(variables.invoiceId) });
      qc.invalidateQueries({ queryKey: queryKeys.invoices.all });
      qc.invalidateQueries({
        queryKey: queryKeys.adjustments.history(
          variables.invoiceId,
          variables.lineItemId,
          variables.adjustmentId
        ),
      });
      notifications.show({
        title: 'Adjustment deleted',
        message: 'The adjustment has been removed.',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red',
      });
    },
  });
}
