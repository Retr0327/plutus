'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconAlertCircle } from '@tabler/icons-react';
import { Alert, Badge } from '@mantine/core';
import { ArchiveButton } from '@plutus/components/ArchiveButton';
import { DataTable } from '@plutus/components/DataTable';
import { MoneyDisplay } from '@plutus/components/MoneyDisplay';
import { PageHeader } from '@plutus/components/PageHeader';
import { StatusBadge } from '@plutus/components/StatusBadge';
import {
  useArchiveInvoice,
  useCampaignList,
  useCurrencyRates,
  useInvoiceList,
  useUnarchiveInvoice,
} from '@plutus/hooks';
import { Route } from '@plutus/libs/config/routes';
import type { InvoiceListItem } from '@plutus/types/invoice';
import { InvoiceFilters } from './InvoiceFilters';

export default function InvoiceListView() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string | null>(null);
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const [includeArchived, setIncludeArchived] = useState(false);
  const [currency, setCurrency] = useState<string>('USD');
  const { data: currencyData } = useCurrencyRates();
  const rates = currencyData?.rates;

  const { data, isLoading, error } = useInvoiceList({
    page,
    limit: 10,
    status: status || undefined,
    campaignId: campaignId || undefined,
    includeArchived,
  });

  const { data: campaignData } = useCampaignList({ limit: 100 });

  const archiveMutation = useArchiveInvoice();
  const unarchiveMutation = useUnarchiveInvoice();

  const campaignOptions = useMemo(
    () =>
      (campaignData?.items ?? []).map((c) => ({
        value: String(c.id),
        label: c.name,
      })),
    [campaignData]
  );

  const columns = [
    {
      key: 'invoiceNumber',
      label: 'Invoice #',
      render: (item: InvoiceListItem) => (
        <>
          {item.invoiceNumber}
          {item.archivedAt && (
            <Badge size="xs" color="gray" ml="xs">
              Archived
            </Badge>
          )}
        </>
      ),
    },
    { key: 'campaign', label: 'Campaign', render: (item: InvoiceListItem) => item.campaignName },
    {
      key: 'status',
      label: 'Status',
      render: (item: InvoiceListItem) => <StatusBadge status={item.status} />,
    },
    {
      key: 'actual',
      label: 'Total Actual',
      render: (item: InvoiceListItem) => (
        <MoneyDisplay amount={item.totalActualAmount} currency={currency} rates={rates} />
      ),
    },
    {
      key: 'adjustments',
      label: 'Adjustments',
      render: (item: InvoiceListItem) => (
        <MoneyDisplay amount={item.totalAdjustments} colorSign currency={currency} rates={rates} />
      ),
    },
    {
      key: 'billable',
      label: 'Billable',
      render: (item: InvoiceListItem) => (
        <MoneyDisplay
          amount={item.totalBillableAmount}
          fw={600}
          currency={currency}
          rates={rates}
        />
      ),
    },
    {
      key: 'lineItems',
      label: 'Line Items',
      render: (item: InvoiceListItem) => item.lineItemCount,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (item: InvoiceListItem) => (
        <ArchiveButton
          isArchived={!!item.archivedAt}
          onArchive={() => archiveMutation.mutate(item.id)}
          onUnarchive={() => unarchiveMutation.mutate(item.id)}
          loading={archiveMutation.isPending || unarchiveMutation.isPending}
        />
      ),
    },
  ];

  if (error) {
    return (
      <>
        <PageHeader title="Invoices" />
        <Alert color="red" icon={<IconAlertCircle />} title="Error loading invoices">
          {error.message}
        </Alert>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Invoices" />
      <InvoiceFilters
        onStatusChange={(v) => {
          setStatus(v);
          setPage(1);
        }}
        onCampaignChange={(v) => {
          setCampaignId(v);
          setPage(1);
        }}
        onIncludeArchivedChange={setIncludeArchived}
        includeArchived={includeArchived}
        campaignOptions={campaignOptions}
        currency={currency}
        onCurrencyChange={setCurrency}
      />
      <DataTable
        data={data?.items ?? []}
        columns={columns}
        loading={isLoading}
        onRowClick={(item) => router.push(Route.InvoiceDetail(item.id))}
        rowKey={(item) => item.id}
        rowOpacity={(item) => (item.archivedAt ? 0.5 : undefined)}
        pagination={
          data?.meta
            ? { page: data.meta.page, totalPages: data.meta.totalPages, onPageChange: setPage }
            : undefined
        }
        emptyMessage="No invoices found matching your filters."
      />
    </>
  );
}
