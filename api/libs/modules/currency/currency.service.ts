import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Result, type Ok } from '@common/result';

interface CachedRates {
  readonly rates: Record<string, number>;
  readonly date: number;
  readonly fetchedAt: number;
}

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const BASE_API_URL = 'https://api.frankfurter.app';

@Injectable()
export class CurrencyService {
  private readonly logger = new Logger(CurrencyService.name);
  private cache: CachedRates | null = null;

  constructor(private readonly httpService: HttpService) {}

  async getSupportedCurrencies() {
    try {
      const response = await firstValueFrom(
        this.httpService.get<Record<string, string>>(
          `${BASE_API_URL}/currencies`,
        ),
      );
      return Result.Ok(
        Object.entries(response.data).map(([code, name]) => ({
          code,
          name,
        })),
      );
    } catch (err) {
      this.logger.error('Failed to fetch supported currencies', err);
      return Result.Ok([{ code: 'USD', name: 'United States Dollar' }]);
    }
  }

  async getRates(): Promise<
    Ok<{
      readonly base: string;
      readonly date: number;
      readonly rates: Record<string, number>;
      readonly stale: boolean;
      readonly error: string | null;
    }>
  > {
    const now = Date.now();
    const cacheValid = this.cache && now - this.cache.fetchedAt < CACHE_TTL_MS;
    if (cacheValid) {
      return Result.Ok({
        base: 'USD',
        date: this.cache!.date,
        rates: { USD: 1, ...this.cache!.rates },
        stale: false,
        error: null,
      });
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get<{ date: string; rates: Record<string, number> }>(
          `${BASE_API_URL}/latest?from=USD`,
        ),
      );

      const freshCache: CachedRates = {
        rates: response.data.rates,
        date: new Date(response.data.date).getTime(),
        fetchedAt: now,
      };
      this.cache = freshCache;

      return Result.Ok({
        base: 'USD',
        date: freshCache.date,
        rates: { USD: 1, ...freshCache.rates },
        stale: false,
        error: null,
      });
    } catch (err) {
      this.logger.error('Failed to fetch currency rates', err);

      if (this.cache) {
        return Result.Ok({
          base: 'USD',
          date: this.cache.date,
          rates: { USD: 1, ...this.cache.rates },
          stale: true,
          error:
            'Using cached rates. Currency service temporarily unavailable.',
        });
      }

      return Result.Ok({
        base: 'USD',
        date: now,
        rates: { USD: 1 },
        stale: true,
        error: 'Currency service unavailable. Showing USD only.',
      });
    }
  }
}
