import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterImage'
})

// returns image uri containing array
export class FilterImage implements PipeTransform {
    transform(items: any[], keys: string, searchBy: string): any[] {
        if (!items || !keys) return [];
        return (items || []).filter((item, inx) => {
            return keys.split(',').some((key, inx, keys_arr) => {
                if (item.hasOwnProperty(key) && new RegExp(searchBy, 'gi').test(item[key])) {
                    return item[keys_arr[0]];// 'uri' because its the first item in key chain
                }
            })
        })
    }
}


