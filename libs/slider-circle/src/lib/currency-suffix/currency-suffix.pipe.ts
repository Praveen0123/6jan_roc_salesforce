import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencySuffix'
})
export class CurrencySuffixPipe implements PipeTransform
{

  constructor
    (
      private currencyPipe: CurrencyPipe
    )
  {
  }

  transform
    (
      value: number
    ): string
  {
    const suffixes = ['', 'K', 'M', 'G', 'T', 'P', 'E'];
    const isNegative: boolean = (value < 0);

    if (Number.isNaN(value) || value === 0)
    {
      return `${this.currencyPipe.transform(0, '', 'symbol', '1.0-0')}`;
    }

    value = Math.abs(value);

    // find which suffix will set for the amount based on length.
    let exp = Math.floor(Math.log(value) / Math.log(1000));

    if (exp < 0)
    {
      exp = 0;
    }

    // get amount after dividing 1000 according the suffix divide rule.
    let smallNumber = value / Math.pow(1000, exp);

    // apply nagative if original amount is nagative
    smallNumber = isNegative ? -smallNumber : smallNumber;

    const hasDecimals: boolean = (smallNumber % 1 !== 0);
    const digitsInfo: string = (hasDecimals) ? '1.1-1' : '1.0-0';

    return `${this.currencyPipe.transform(smallNumber, '', 'symbol', digitsInfo)}${suffixes[exp]}`;
  }
}
