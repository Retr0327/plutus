'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { IconAlertCircle } from '@tabler/icons-react';
import {
  Alert,
  Anchor,
  Button,
  Grid,
  Group,
  Skeleton,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { ArchiveButton } from '@plutus/components/ArchiveButton';
import { PageHeader } from '@plutus/components/PageHeader';
import { StatusBadge } from '@plutus/components/StatusBadge';
import {
  useArchiveInvoice,
  useCurrencyRates,
  useDeleteAdjustment,
  useInvoiceDetail,
  useUnarchiveInvoice,
} from '@plutus/hooks';
import { Route } from '@plutus/libs/config/routes';
import { ApiRequestError } from '@plutus/libs/request';
import type { Adjustment } from '@plutus/types/invoice';
import { CurrencySelector } from '@plutus/views/Currency/CurrencySelector';
import { AdjustmentForm } from './AdjustmentForm';
import { AdjustmentHistory } from './AdjustmentHistory';
import { InvoiceSummary } from './InvoiceSummary';
import { LineItemCard } from './LineItemCard';

export default function InvoiceDetailView() {
  const { id } = useParams<{ id: string }>();
  const { data: invoice, isLoading, error } = useInvoiceDetail(id);
  const archiveMutation = useArchiveInvoice();
  const unarchiveMutation = useUnarchiveInvoice();
  const deleteMutation = useDeleteAdjustment();

  const [currency, setCurrency] = useState<string>('USD');
  const { data: currencyData } = useCurrencyRates();
  const rates = currencyData?.rates;

  const openAdjustmentForm = (lineItemId: string, adjustment?: Adjustment) => {
    modals.open({
      title: adjustment ? 'Edit Adjustment' : 'Add Adjustment',
      children: (
        <AdjustmentForm
          invoiceId={id}
          lineItemId={lineItemId}
          adjustment={adjustment}
          onClose={() => modals.closeAll()}
        />
      ),
    });
  };

  const openDeleteConfirm = (lineItemId: string, adjustment: Adjustment) => {
    let deletedBy = '';
    modals.open({
      title: 'Delete Adjustment',
      children: (
        <Stack>
          <Text>Are you sure you want to delete this adjustment?</Text>
          <Text size="sm" c="dimmed">
            Amount: {adjustment.amount} — {adjustment.reason}
          </Text>
          <TextInput
            label="Deleted By"
            placeholder="your@email.com"
            required
            onChange={(e) => {
              deletedBy = e.currentTarget.value;
            }}
          />
          <Group justify="flex-end">
            <Button variant="default" onClick={() => modals.closeAll()}>
              Cancel
            </Button>
            <Button
              color="red"
              onClick={() => {
                if (!deletedBy.trim()) return;
                deleteMutation.mutate(
                  {
                    invoiceId: id,
                    lineItemId,
                    adjustmentId: adjustment.id,
                    deletedBy: deletedBy.trim(),
                  },
                  { onSuccess: () => modals.closeAll() }
                );
              }}
            >
              Delete
            </Button>
          </Group>
        </Stack>
      ),
    });
  };

  const openHistory = (lineItemId: string, adjustment: Adjustment) => {
    modals.open({
      title: `Change History — Adjustment`,
      size: 'lg',
      children: (
        <AdjustmentHistory invoiceId={id} lineItemId={lineItemId} adjustmentId={adjustment.id} />
      ),
    });
  };

  if (isLoading) {
    return (
      <>
        <Skeleton height={30} width={400} mb="md" />
        <Grid mb="md">
          {[1, 2, 3].map((i) => (
            <Grid.Col span={4} key={i}>
              <Skeleton height={80} />
            </Grid.Col>
          ))}
        </Grid>
        <Skeleton height={200} />
      </>
    );
  }

  if (error) {
    const is404 = error instanceof ApiRequestError && error.statusCode === 404;
    return (
      <Alert color="red" icon={<IconAlertCircle />} title={is404 ? 'Not Found' : 'Error'}>
        {is404 ? 'This invoice does not exist.' : error.message}
      </Alert>
    );
  }

  if (!invoice) return null;

  const isDraft = invoice.status === 'draft';

  return (
    <>
      <PageHeader
        title={invoice.invoiceNumber}
        breadcrumbs={[{ label: 'Invoices', href: Route.Invoices }]}
        actions={
          <Group>
            <CurrencySelector value={currency} onChange={setCurrency} />
            <ArchiveButton
              isArchived={!!invoice.archivedAt}
              onArchive={() => archiveMutation.mutate(id)}
              onUnarchive={() => unarchiveMutation.mutate(id)}
              loading={archiveMutation.isPending || unarchiveMutation.isPending}
            />
          </Group>
        }
      />

      <Group mb="md" gap="md">
        <StatusBadge status={invoice.status} />
        <Text size="sm">
          Campaign:{' '}
          <Anchor component={Link} href={Route.CampaignDetail(invoice.campaign.id)}>
            {invoice.campaign.name}
          </Anchor>
        </Text>
      </Group>

      {!isDraft && (
        <Alert color="blue" mb="md">
          This invoice is finalized. Adjustments cannot be modified.
        </Alert>
      )}

      {invoice.archivedAt && (
        <Alert color="yellow" mb="md">
          This invoice is archived.
        </Alert>
      )}

      <InvoiceSummary
        totalActualAmount={invoice.totalActualAmount}
        totalAdjustments={invoice.totalAdjustments}
        totalBillableAmount={invoice.totalBillableAmount}
        currency={currency}
        rates={rates}
      />

      {invoice.lineItems.map((lineItem) => (
        <LineItemCard
          key={lineItem.id}
          lineItem={lineItem}
          isDraft={isDraft}
          currency={currency}
          rates={rates}
          onAddAdjustment={(liId) => openAdjustmentForm(liId)}
          onEditAdjustment={(liId, adj) => openAdjustmentForm(liId, adj)}
          onDeleteAdjustment={(liId, adj) => openDeleteConfirm(liId, adj)}
          onViewHistory={(liId, adj) => openHistory(liId, adj)}
        />
      ))}
    </>
  );
}
