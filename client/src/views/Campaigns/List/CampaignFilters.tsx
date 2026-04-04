'use client';

import { useState } from 'react';
import { IconSearch } from '@tabler/icons-react';
import { Checkbox, Group, Select, TextInput } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import { CurrencySelector } from '@plutus/views/Currency/CurrencySelector';

interface CampaignFiltersProps {
  onSearchChange: (value: string) => void;
  onAdvertiserChange: (value: string | null) => void;
  onIncludeArchivedChange: (value: boolean) => void;
  includeArchived: boolean;
  currency: string;
  onCurrencyChange: (value: string) => void;
}

const advertiserOptions = [
  { value: '', label: 'All Advertisers' },
  { value: 'Nike', label: 'Nike' },
  { value: 'Target', label: 'Target' },
  { value: 'Samsung', label: 'Samsung' },
];

export function CampaignFilters({
  onSearchChange,
  onAdvertiserChange,
  onIncludeArchivedChange,
  includeArchived,
  currency,
  onCurrencyChange,
}: CampaignFiltersProps) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedCallback(onSearchChange, 300);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    debouncedSearch(value);
  };

  return (
    <Group mb="md">
      <TextInput
        placeholder="Search by name..."
        leftSection={<IconSearch size={16} />}
        value={search}
        onChange={(e) => handleSearchChange(e.currentTarget.value)}
        style={{ flex: 1, maxWidth: 300 }}
      />
      <Select
        placeholder="Advertiser"
        data={advertiserOptions}
        onChange={onAdvertiserChange}
        clearable
        w={180}
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
