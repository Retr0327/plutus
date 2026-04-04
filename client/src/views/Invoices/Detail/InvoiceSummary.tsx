'use client';

import { Card, Grid, Text } from '@mantine/core';
import { MoneyDisplay } from '@plutus/components/MoneyDisplay';

interface InvoiceSummaryProps {
  totalActualAmount: number;
  totalAdjustments: number;
  totalBillableAmount: number;
  currency?: string;
  rates?: Record<string, number>;
}

export function InvoiceSummary({
  totalActualAmount,
  totalAdjustments,
  totalBillableAmount,
  currency,
  rates,
}: InvoiceSummaryProps) {
  return (
    <Grid mb="lg">
      <Grid.Col span={{ base: 12, sm: 4 }}>
        <Card withBorder>
          <Text size="sm" c="dimmed">
            Total Actual
          </Text>
          <MoneyDisplay amount={totalActualAmount} fw={600} currency={currency} rates={rates} />
        </Card>
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 4 }}>
        <Card withBorder>
          <Text size="sm" c="dimmed">
            Adjustments
          </Text>
          <MoneyDisplay
            amount={totalAdjustments}
            fw={600}
            colorSign
            currency={currency}
            rates={rates}
          />
        </Card>
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 4 }}>
        <Card withBorder>
          <Text size="sm" c="dimmed">
            Billable
          </Text>
          <MoneyDisplay amount={totalBillableAmount} fw={700} currency={currency} rates={rates} />
        </Card>
      </Grid.Col>
    </Grid>
  );
}
