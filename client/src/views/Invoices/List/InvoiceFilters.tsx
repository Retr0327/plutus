'use client';

import { Checkbox, Group, Select } from '@mantine/core';
import { CurrencySelector } from '@plutus/views/Currency/CurrencySelector';

interface InvoiceFiltersProps {
  onStatusChange: (value: string | null) => void;
  onCampaignChange: (value: string | null) => void;
  onIncludeArchivedChange: (value: boolean) => void;
  includeArchived: boolean;
  campaignOptions: { value: string; label: string }[];
  currency: string;
  onCurrencyChange: (value: string) => void;
}

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'finalized', label: 'Finalized' },
];

export function InvoiceFilters({
  onStatusChange,
  onCampaignChange,
  onIncludeArchivedChange,
  includeArchived,
  campaignOptions,
  currency,
  onCurrencyChange,
}: InvoiceFiltersProps) {
  return (
    <Group mb="md">
      <Select
        placeholder="Status"
        data={statusOptions}
        onChange={onStatusChange}
        clearable
        w={180}
      />
      <Select
        placeholder="Campaign"
        data={[{ value: '', label: 'All Campaigns' }, ...campaignOptions]}
        onChange={onCampaignChange}
        clearable
        w={220}
      />
      <Checkbox
        label="Show archived"
        checked={includeArchived}
        onChange={(e) => onIncludeArchivedChange(e.currentTarget.checked)}
      />
      <CurrencySelector value={currency} onChange={onCurrencyChange} />
    </Group>
  );
}
