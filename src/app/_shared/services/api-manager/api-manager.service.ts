import { Injectable } from '@angular/core';
import { ApiList } from './api-list';
import { ApiModel } from './api.model';
import { GlobalReuse } from '../../global.reuse';
import * as _ from "lodash";

//encodeQueryData
@Injectable({
  providedIn: 'root'
})
export class ApiManagerService extends GlobalReuse {

  constructor() {
    super()
  }

  /// available api/s
  apis(): ApiModel[] {
    return new ApiList().list();
  }




  checkRequirementsModifyOutput(api: ApiModel, _obj) {
    if (api.auth === true) {
      /// some logic here todo
    }
    if (api.api_key) {
      /// some logic here todo
    }
    if (api.token) {
      /// some logic here todo
    }

    if (api.name == 'punkapi') {

      /// update query_params for output
      for (var key in _obj) {
        if (_obj.hasOwnProperty(key)) {

          if (key == 'search_by_name' || key == 'byName') {
            (api.query_params as any).beer_name = _obj[key];
            continue;
          }

          if (key == 'parent_page') {
            (api.query_params as any).page = 1;
            continue;
          }

          // to ignore
          if (key == 'originalName') {
            continue;
          }

          else {
            api.query_params[key] = _obj[key];
            continue;
          }
        }
      }

      console.log('what is api.query_params', api.query_params)
      api.apiURL = api.api + "/" + api.prefix + "/";
    }

    else if (api.free) {
      /// some logic here todo
    }

    // merge new results;
    function customizer(objValue, srcValue, what) {
      //  console.log('customizer objValue',objValue)  
      //  console.log('customizer srcValue',srcValue)
      //  console.log('customizer what',what)
      //if(objValue.length==0) return false;
      if (_.isArray(objValue)) {
        return objValue.concat(srcValue);
      }
    }

    //var q = _.mergeWith(api.query_params,_obj,customizer); 

    if (!api.query_params) {
      console.error('something went wrong with checkRequirementsModifyOutput');
      return false;
    }
    var query = this.encodeQueryData(api.query_params); // create url
    var _url = api.apiURL + '?' + query;
    var clean_url = this.removeEmptyParam(_url); // remove any empty params from url just in case

    return clean_url;
  }

  buildRespCall(apiName: string, paramData: object): string {

    var required_params = ['prefix', 'api', 'query_params'];
    var _api = this.apis();

    var get_api = _api.reduce((out, item, inx) => {
      if (item.name === apiName) {
        out.push(item)
      }
      return out;
    }, [])[0];


    var missing = required_params.filter((val, inx) => {
      return Object.keys(get_api).indexOf(val) == -1;
    })

    if (missing.length > 0) {
      console.error('--- what is missing? ', missing)
      return false as any;
    }
    var _output = this.mathingResult(get_api, paramData);
    return _output;

  }

  matchOutput(_key: string, itemApi: ApiModel, _obj): object {
    var output: any = {}

    if (itemApi.name === 'punkapi') {

      //// prepend query with 
      var _url_ = this.checkRequirementsModifyOutput(itemApi, _obj);
      console.log('-- checkRequirementsModifyOutput url: ', _url_);
      if (_url_) {
        output.good = _url_
      } else {
        output.bad = true
      }

      // itemApi.apiURL=itemApi.api + "/" + itemApi.prefix + "/";
      //var encodeQueryData = new GlobalReuse().encodeQueryData;
      // var param_q=this.encodeQueryData(_obj);
      // output.good =itemApi.apiURL+


      // constracting query logic
      /*  
         switch (_key as string) {
           case 'parent_page':
             output.good = `${itemApi.apiURL}?page=1&per_page=${_obj.per_page}`;
             break;
           case 'paged':
             output.good = `${itemApi.apiURL}?page=${_obj.paged}&per_page=${_obj.per_page}`;
             break;
 
           case 'search_by_name':
             output.good = `${itemApi.apiURL}?beer_name=${_obj.search_by_name}&per_page=${_obj.per_page}`;
             break;
 
             /// there is no byName anymore 
           case 'byName':
             output.good = `${itemApi.apiURL}?beer_name=${_obj.byName}`;
             break;
           default:
 
             output.default = `${itemApi.apiURL}?page=1&per_page=${_obj.per_page}`;
         }
           */
    } else {
      console.error(`--- currently only supporting apiName: ${itemApi.name}`);
      return false as any;
    }

    return output;
  }



  mathingResult(_api: ApiModel, obj): string {
    var results;
    var not_found_default: string;
    var api_error = false;
    var objKeys = Object.keys(obj) //  convers object keys to array
    // run switch per each key in the objKey to find any match 
    for (var i = 0; i < objKeys.length; i++) {
      var item = objKeys[i];

      if (item) {
        var s: any = this.matchOutput(item, _api, obj);
        if (!s) {
          api_error = true;
          break
        }

        if (s.bad) {
          //console.log('what is default',s.default)
          api_error = true;
          continue;
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

    if (api_error) {
      return { error: 'api no found!' } as any;
    }
    return results || not_found_default;
  }

}
