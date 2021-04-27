import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'consoleLog'
})
export class ConsoleLogPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    console.log('consoleLog' + (args ? ' ' + args : ''), value);
    return value;
  }
}
