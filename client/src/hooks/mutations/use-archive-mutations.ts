import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { API } from '@plutus/libs/config/api';
import { request } from '@plutus/libs/request';
import { queryKeys } from '@plutus/utils/query-keys';

export function useArchiveCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => request(API.campaign.archive(id), { method: 'PATCH' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.campaigns.all });
      notifications.show({ title: 'Archived', message: 'Campaign archived.', color: 'green' });
    },
    onError: (error) => {
      notifications.show({ title: 'Error', message: error.message, color: 'red' });
    },
  });
}

export function useUnarchiveCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => request(API.campaign.unarchive(id), { method: 'PATCH' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.campaigns.all });
      notifications.show({ title: 'Unarchived', message: 'Campaign unarchived.', color: 'green' });
    },
    onError: (error) => {
      notifications.show({ title: 'Error', message: error.message, color: 'red' });
    },
  });
}

export function useArchiveInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => request(API.invoice.archive(id), { method: 'PATCH' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.invoices.all });
      notifications.show({ title: 'Archived', message: 'Invoice archived.', color: 'green' });
    },
    onError: (error) => {
      notifications.show({ title: 'Error', message: error.message, color: 'red' });
    },
  });
}

export function useUnarchiveInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => request(API.invoice.unarchive(id), { method: 'PATCH' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.invoices.all });
      notifications.show({ title: 'Unarchived', message: 'Invoice unarchived.', color: 'green' });
    },
    onError: (error) => {
      notifications.show({ title: 'Error', message: error.message, color: 'red' });
    },
  });
}
