import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterBy'
})
export class FilterBy implements PipeTransform {
    transform(items: any[], keys: string): any[] {
        if (!items || !keys) return [];
        return (items || []).filter((item) => keys.split(',').some(key => item.hasOwnProperty(key)));
    }
}
