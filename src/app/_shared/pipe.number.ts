import {Pipe, PipeTransform} from '@angular/core';

/**
 to generate ngFor by index length
 */


@Pipe({name: 'PipeNumber'})
export class PipeNumber implements PipeTransform {
  transform(value, args:string[]) : any {
    let res = [];
    for (let i = 0; i < value; i++) {
        res.push(i+1);
      }
      return res;
  }
}
