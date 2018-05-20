import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search' 
})
export class SearchPipe implements PipeTransform {
  transform(items: any[], keys:string,searchText: string): any[] {
    console.log('what are the items',items)
      console.log('what are the keys',keys)
      console.log('what searchText',searchText)
    if (!items) return [];
    if (!searchText) return items;
     searchText = searchText.toLowerCase();
      return (items || []).filter((item) => keys.split(',').some(key => item.hasOwnProperty(key) && new RegExp(searchText, 'gi').test(item[key])));
  }
}

/**
 //   <div *ngFor="let item of items | search:'id,text':query">{{item.text}}</div>
 export class SearchPipe implements PipeTransform {
  public transform(value, keys: string, term: string) {
    console.log('what is value',value)
    console.log('what is keys',keys)
    if (!term) return value;
    return (value || []).filter((item) => keys.split(',').some(key => item.hasOwnProperty(key) && new RegExp(term, 'gi').test(item[key])));

  }
}
 */