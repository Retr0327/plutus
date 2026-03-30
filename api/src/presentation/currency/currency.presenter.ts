import { Presenter } from '@common/domain/interfaces/presenter';
import { Injectable } from '@nestjs/common';

export type GetRatesPresenterInput = {
  readonly base: string;
  readonly date: number;
  readonly rates: Record<string, number>;
  readonly stale: boolean;
  readonly error: string | null;
};

export type GetRatesPresenterOutput = GetRatesPresenterInput;

@Injectable()
export class GetRatesPresenter implements Presenter<
  GetRatesPresenterInput,
  GetRatesPresenterOutput
> {
  present(input: GetRatesPresenterInput): GetRatesPresenterOutput {
    return {
      base: input.base,
      date: input.date,
      rates: input.rates,
      stale: input.stale,
      error: input.error,
    };
  }
}

export type GetSupportedCurrencyPresenterInput = Array<{
  code: string;
  name: string;
}>;

export type GetSupportedCurrencyPresenterOutput =
  GetSupportedCurrencyPresenterInput;

@Injectable()
export class GetSupportedCurrencyPresenter implements Presenter<
  GetSupportedCurrencyPresenterInput,
  GetSupportedCurrencyPresenterOutput
> {
  present(
    input: GetSupportedCurrencyPresenterInput,
  ): GetSupportedCurrencyPresenterOutput {
    return input.map((currency) => ({
      code: currency.code,
      name: currency.name,
    }));
  }
}
