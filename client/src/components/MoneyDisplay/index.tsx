'use client';

import { Text } from '@mantine/core';
import { formatMoney } from '@plutus/utils/format';

interface MoneyDisplayProps {
  amount: number;
  currency?: string;
  rates?: Record<string, number>;
  colorSign?: boolean;
  fw?: number | string;
}

export function MoneyDisplay({
  amount,
  currency = 'USD',
  rates,
  colorSign = false,
  fw,
}: MoneyDisplayProps) {
  const converted =
    rates && currency !== 'USD' && rates[currency] ? amount * rates[currency] : amount;

  const displayCurrency = rates && currency !== 'USD' && rates[currency] ? currency : 'USD';

  const color = colorSign
    ? converted < 0
      ? 'red'
      : converted > 0
        ? 'green'
        : undefined
    : undefined;

  return (
    <Text span c={color} fw={fw}>
      {formatMoney(converted, displayCurrency)}
    </Text>
  );
}
