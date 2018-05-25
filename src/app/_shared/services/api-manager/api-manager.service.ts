import { Injectable } from '@angular/core';
import { ApiList } from './api-list';
import { ApiModel } from './api.model';

@Injectable({
  providedIn: 'root'
})
export class ApiManagerService {

  constructor() { }

  /// available api/s
  apis():ApiModel[]{
    return new ApiList().list();
  }




   
/**
   * used to manage what url should be returned to rest service based on the obj/params
   * paramData:
   *    parent_page:
   *    paged
   *    search_by_name
   *    byName 
   *  
   * this.mathingResult > this.switchCase >output
   */

   
  buildRespCall(apiName:string, paramData:object):string{

    var required_params = ['prefix','api','query_params'];
    var _api = this.apis();
   
    var get_api = _api.reduce((out, item, inx) => {
      if (item.name===apiName) {
        out.push(item)
      }
      return out;
    }, [])[0];

    var missing = required_params.filter((val,inx)=>{
          return Object.keys(get_api).indexOf(val)==-1;
    })
    
    if(missing.length>0){
        console.error('--- what is missing? ',missing)
        return false as any;
    }
      var _output = this.mathingResult(get_api, paramData);
    return _output;
    
  }

  switchCase(_key:string,itemApi:ApiModel,_obj): object{
      var output: any = {}

      if (itemApi.name === 'punkapi') {

       //// prepend query with 
       itemApi.apiURL=itemApi.api + "/" + itemApi.prefix + "/";

       // constracting query logic
        switch (_key as string) {
          case 'parent_page':
            output.good = `${itemApi.apiURL}?page=1&per_page=${_obj.perPage}`;
            break;
          case 'paged':
            output.good = `${itemApi.apiURL}?page=${_obj.paged}&per_page=${_obj.perPage}`;
            break;

          case 'search_by_name':
            output.good = `${itemApi.apiURL}?beer_name=${_obj.search_by_name}&per_page=${_obj.perPage}`;
            break;

          case 'byName':
            output.good = `${itemApi.apiURL}?beer_name=${_obj.byName}`;
            break;
          default:

            output.default = `${itemApi.apiURL}?page=1&per_page=${_obj.perPage}`;
        }
      }else{
        console.error(`--- currently only supporting apiName: ${itemApi.name}`);        
        return false as any;
      }
  
      return output;
  }

  

  mathingResult(_api:ApiModel, obj):string {
    var results;
    var not_found_default: string;
    var api_error=false;
    var objKeys = Object.keys(obj) //  convers object keys to array
    // run switch per each key in the objKey to find any match 
    for (var i = 0; i < objKeys.length; i++) {
      var item = objKeys[i];

      if (item) {
        var s: any = this.switchCase(item, _api, obj);
        if (!s){
          api_error=true;
          break
        }
        if (s.default) {
          //console.log('what is default',s.default)
          not_found_default = s.default;
          continue;
        }
        if (s.good) {
          // console.log('what is good',s.good)
          results = s.good;
          break;
        }

      }
    }
    if (!results) {
      console.error('-- checkRouteParams did not match returning defaults');

      //this.logger.log('checkRouteParams did not match returning defaults', true);
    }

    if(api_error){
      return {error:'api no found!'} as any;
    }
    return results || not_found_default;
  }

}
