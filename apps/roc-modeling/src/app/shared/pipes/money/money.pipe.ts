import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'money'
})
export class MoneyPipe implements PipeTransform {
  transform(input: any, args?: any): any {
    const suffixes = ['K', 'M', 'B', 'T'];

    if (input === undefined || input == null || Number.isNaN(input)) {
      return 'N/A';
    }

    if (input < 1000) {
      return input;
    }

    const exp = Math.floor(Math.log(input) / Math.log(1000));

    return (
      '$' + (input / Math.pow(1000, exp)).toFixed(args) + suffixes[exp - 1]
    );
  }
}
