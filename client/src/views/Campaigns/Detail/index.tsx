'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { IconAlertCircle } from '@tabler/icons-react';
import { Alert, Card, Grid, Group, Skeleton, Text, Title } from '@mantine/core';
import { ArchiveButton } from '@plutus/components/ArchiveButton';
import { MoneyDisplay } from '@plutus/components/MoneyDisplay';
import { PageHeader } from '@plutus/components/PageHeader';
import {
  useArchiveCampaign,
  useCampaignDetail,
  useCurrencyRates,
  useUnarchiveCampaign,
} from '@plutus/hooks';
import { Route } from '@plutus/libs/config/routes';
import { ApiRequestError } from '@plutus/libs/request';
import { formatDate } from '@plutus/utils/format';
import { CurrencySelector } from '@plutus/views/Currency/CurrencySelector';
import { InvoicesList } from './InvoicesList';
import { LineItemsTable } from './LineItemsTable';

export default function CampaignDetailView() {
  const { id } = useParams<{ id: string }>();
  const { data: campaign, isLoading, error } = useCampaignDetail(id);
  const archiveMutation = useArchiveCampaign();
  const unarchiveMutation = useUnarchiveCampaign();

  const [currency, setCurrency] = useState<string>('USD');
  const { data: currencyData } = useCurrencyRates();
  const rates = currencyData?.rates;

  if (isLoading) {
    return (
      <>
        <Skeleton height={30} width={300} mb="md" />
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
        {is404 ? 'This campaign does not exist.' : error.message}
      </Alert>
    );
  }

  if (!campaign) return null;

  return (
    <>
      <PageHeader
        title={campaign.name}
        breadcrumbs={[{ label: 'Campaigns', href: Route.Campaigns }]}
        actions={
          <Group>
            <CurrencySelector value={currency} onChange={setCurrency} />
            <ArchiveButton
              isArchived={!!campaign.archivedAt}
              onArchive={() => archiveMutation.mutate(id)}
              onUnarchive={() => unarchiveMutation.mutate(id)}
              loading={archiveMutation.isPending || unarchiveMutation.isPending}
            />
          </Group>
        }
      />

      {campaign.archivedAt && (
        <Alert color="yellow" mb="md">
          This campaign is archived.
        </Alert>
      )}

      <Grid mb="lg">
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Card withBorder>
            <Text size="sm" c="dimmed">
              Advertiser
            </Text>
            <Text fw={500}>{campaign.advertiser}</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Card withBorder>
            <Text size="sm" c="dimmed">
              Start Date
            </Text>
            <Text fw={500}>{formatDate(campaign.startDate)}</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Card withBorder>
            <Text size="sm" c="dimmed">
              End Date
            </Text>
            <Text fw={500}>{formatDate(campaign.endDate)}</Text>
          </Card>
        </Grid.Col>
      </Grid>

      <Group mb="sm">
        <Text>
          Total Booked:{' '}
          <MoneyDisplay
            amount={campaign.totalBookedAmount}
            fw={600}
            currency={currency}
            rates={rates}
          />
        </Text>
        <Text>
          Total Actual:{' '}
          <MoneyDisplay
            amount={campaign.totalActualAmount}
            fw={600}
            currency={currency}
            rates={rates}
          />
        </Text>
      </Group>

      <Title order={4} mb="sm">
        Line Items
      </Title>
      <LineItemsTable
        lineItems={campaign.lineItems}
        totalBookedAmount={campaign.totalBookedAmount}
        totalActualAmount={campaign.totalActualAmount}
        currency={currency}
        rates={rates}
      />

      <Title order={4} mt="lg" mb="sm">
        Invoices
      </Title>
      <InvoicesList invoices={campaign.invoices} currency={currency} rates={rates} />
    </>
  );
}
