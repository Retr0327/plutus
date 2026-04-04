export interface CurrencyRates {
  base: string;
  date: string;
  rates: Record<string, number>;
  stale: boolean;
  error: string | null;
}

export interface SupportedCurrency {
  code: string;
  name: string;
}
