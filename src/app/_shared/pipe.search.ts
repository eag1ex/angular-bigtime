import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {
  transform(items: any[], keys: string, searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;
    searchText = searchText.toLowerCase();
    return (items || []).filter((item, inx) => {
      return keys.split(',').some((key) => {

        if (key == 'keywords') {
          var keyRef = 'text';
          if (item.keywords) {
            return  item.keywords.filter((keywordItem, inx)=>{
                return keywordItem.hasOwnProperty(keyRef) && new RegExp(searchText, 'gi').test(keywordItem[keyRef])
            }).length >0 ||false;
          }
        }
        else{
           return item.hasOwnProperty(key) && new RegExp(searchText, 'gi').test(item[key])
        }
       
      });
    })
  }
}
