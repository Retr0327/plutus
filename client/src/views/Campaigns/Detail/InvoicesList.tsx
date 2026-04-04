'use client';

import { useRouter } from 'next/navigation';
import { IconChevronRight } from '@tabler/icons-react';
import { Group, Paper, Text } from '@mantine/core';
import { MoneyDisplay } from '@plutus/components/MoneyDisplay';
import { StatusBadge } from '@plutus/components/StatusBadge';
import { Route } from '@plutus/libs/config/routes';
import type { CampaignInvoiceSummary } from '@plutus/types/campaign';

interface InvoicesListProps {
  invoices: CampaignInvoiceSummary[];
  currency?: string;
  rates?: Record<string, number>;
}

export function InvoicesList({ invoices, currency, rates }: InvoicesListProps) {
  const router = useRouter();

  if (invoices.length === 0) {
    return <Text c="dimmed">No invoices linked to this campaign.</Text>;
  }

  return (
    <>
      {invoices.map((invoice) => (
        <Paper
          key={invoice.id}
          p="sm"
          mb="xs"
          withBorder
          onClick={() => router.push(Route.InvoiceDetail(invoice.id))}
          style={{ cursor: 'pointer' }}
        >
          <Group justify="space-between">
            <Group>
              <Text fw={500}>{invoice.invoiceNumber}</Text>
              <StatusBadge status={invoice.status} />
            </Group>
            <Group>
              <MoneyDisplay
                amount={invoice.totalBillableAmount}
                fw={500}
                currency={currency}
                rates={rates}
              />
              <IconChevronRight size={16} />
            </Group>
          </Group>
        </Paper>
      ))}
    </>
  );
}
