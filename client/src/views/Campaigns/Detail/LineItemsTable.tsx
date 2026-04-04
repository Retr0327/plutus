'use client';

import { Table, Text } from '@mantine/core';
import { MoneyDisplay } from '@plutus/components/MoneyDisplay';
import type { CampaignLineItem } from '@plutus/types/campaign';

interface LineItemsTableProps {
  lineItems: CampaignLineItem[];
  totalBookedAmount: number;
  totalActualAmount: number;
  currency?: string;
  rates?: Record<string, number>;
}

export function LineItemsTable({
  lineItems,
  totalBookedAmount,
  totalActualAmount,
  currency,
  rates,
}: LineItemsTableProps) {
  return (
    <Table striped>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Name</Table.Th>
          <Table.Th>Booked Amount</Table.Th>
          <Table.Th>Actual Amount</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {lineItems.map((item) => (
          <Table.Tr key={item.id}>
            <Table.Td>{item.name}</Table.Td>
            <Table.Td>
              <MoneyDisplay amount={item.bookedAmount} currency={currency} rates={rates} />
            </Table.Td>
            <Table.Td>
              <MoneyDisplay amount={item.actualAmount} currency={currency} rates={rates} />
            </Table.Td>
          </Table.Tr>
        ))}
        <Table.Tr>
          <Table.Td>
            <Text fw={700}>TOTAL</Text>
          </Table.Td>
          <Table.Td>
            <MoneyDisplay amount={totalBookedAmount} fw={700} currency={currency} rates={rates} />
          </Table.Td>
          <Table.Td>
            <MoneyDisplay amount={totalActualAmount} fw={700} currency={currency} rates={rates} />
          </Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );
}
