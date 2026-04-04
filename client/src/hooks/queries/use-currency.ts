import { useQuery } from '@tanstack/react-query';
import { API } from '@plutus/libs/config/api';
import { request } from '@plutus/libs/request';
import type { CurrencyRates, SupportedCurrency } from '@plutus/types/currency';
import { queryKeys } from '@plutus/utils/query-keys';

export function useCurrencyRates(base?: string) {
  const url = base ? `${API.currency.rates}?base=${base}` : API.currency.rates;
  return useQuery({
    queryKey: queryKeys.currency.rates(base),
    queryFn: () => request<CurrencyRates>(url),
  });
}

export function useSupportedCurrencies() {
  return useQuery({
    queryKey: queryKeys.currency.supported,
    queryFn: () => request<SupportedCurrency[]>(API.currency.supported),
  });
}
