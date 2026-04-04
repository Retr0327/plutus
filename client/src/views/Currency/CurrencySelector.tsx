'use client';

import { Select } from '@mantine/core';
import { useSupportedCurrencies } from '@plutus/hooks';

interface CurrencySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function CurrencySelector({ value, onChange }: CurrencySelectorProps) {
  const { data: currencies } = useSupportedCurrencies();

  const options = (currencies ?? []).map((c) => ({
    value: c.code,
    label: `${c.code} — ${c.name}`,
  }));

  return (
    <Select
      value={value}
      onChange={(v) => onChange(v ?? 'USD')}
      data={options}
      w={200}
      placeholder="Currency"
    />
  );
}
