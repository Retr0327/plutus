'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconAlertCircle } from '@tabler/icons-react';
import { Alert, Badge } from '@mantine/core';
import { ArchiveButton } from '@plutus/components/ArchiveButton';
import { DataTable } from '@plutus/components/DataTable';
import { MoneyDisplay } from '@plutus/components/MoneyDisplay';
import { PageHeader } from '@plutus/components/PageHeader';
import {
  useArchiveCampaign,
  useCampaignList,
  useCurrencyRates,
  useUnarchiveCampaign,
} from '@plutus/hooks';
import { Route } from '@plutus/libs/config/routes';
import type { CampaignListItem } from '@plutus/types/campaign';
import { formatDate } from '@plutus/utils/format';
import { CampaignFilters } from './CampaignFilters';

export default function CampaignListView() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [advertiser, setAdvertiser] = useState<string | null>(null);
  const [includeArchived, setIncludeArchived] = useState(false);
  const [currency, setCurrency] = useState<string>('USD');
  const { data: currencyData } = useCurrencyRates();
  const rates = currencyData?.rates;

  const { data, isLoading, error } = useCampaignList({
    page,
    limit: 10,
    search: search || undefined,
    advertiser: advertiser || undefined,
    includeArchived,
  });

  const archiveMutation = useArchiveCampaign();
  const unarchiveMutation = useUnarchiveCampaign();

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (item: CampaignListItem) => (
        <>
          {item.name}
          {item.archivedAt && (
            <Badge size="xs" color="gray" ml="xs">
              Archived
            </Badge>
          )}
        </>
      ),
    },
    { key: 'advertiser', label: 'Advertiser', render: (item: CampaignListItem) => item.advertiser },
    {
      key: 'startDate',
      label: 'Start Date',
      render: (item: CampaignListItem) => formatDate(item.startDate),
    },
    {
      key: 'endDate',
      label: 'End Date',
      render: (item: CampaignListItem) => formatDate(item.endDate),
    },
    {
      key: 'booked',
      label: 'Total Booked',
      render: (item: CampaignListItem) => (
        <MoneyDisplay amount={item.totalBookedAmount} currency={currency} rates={rates} />
      ),
    },
    {
      key: 'actual',
      label: 'Total Actual',
      render: (item: CampaignListItem) => (
        <MoneyDisplay amount={item.totalActualAmount} currency={currency} rates={rates} />
      ),
    },
    {
      key: 'invoices',
      label: 'Invoices',
      render: (item: CampaignListItem) => <Badge variant="light">{item.invoiceCount}</Badge>,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (item: CampaignListItem) => (
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
        <PageHeader title="Campaigns" />
        <Alert color="red" icon={<IconAlertCircle />} title="Error loading campaigns">
          {error.message}
        </Alert>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Campaigns" />
      <CampaignFilters
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        onAdvertiserChange={(v) => {
          setAdvertiser(v);
          setPage(1);
        }}
        onIncludeArchivedChange={setIncludeArchived}
        includeArchived={includeArchived}
        currency={currency}
        onCurrencyChange={setCurrency}
      />
      <DataTable
        data={data?.items ?? []}
        columns={columns}
        loading={isLoading}
        onRowClick={(item) => router.push(Route.CampaignDetail(item.id))}
        rowKey={(item) => item.id}
        rowOpacity={(item) => (item.archivedAt ? 0.5 : undefined)}
        pagination={
          data?.meta
            ? { page: data.meta.page, totalPages: data.meta.totalPages, onPageChange: setPage }
            : undefined
        }
        emptyMessage="No campaigns found matching your filters."
      />
    </>
  );
}
