import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search' 
})
export class SearchPipe implements PipeTransform {
  transform(items: any[], keys:string,searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;
     searchText = searchText.toLowerCase();
      return (items || []).filter((item) => keys.split(',').some(key => item.hasOwnProperty(key) && new RegExp(searchText, 'gi').test(item[key])));
  }
}
