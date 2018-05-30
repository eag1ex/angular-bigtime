import { Injectable } from '@angular/core';
import { ApiList } from '../../../api-list';
import { IApiModel } from '../../interfaces';
import { GlobalReuse } from '../../global.reuse';
//import * as _ from "lodash"; 

import { IMyGlobals } from "../../interfaces";

import { IbuildRespCall } from "../../interfaces";



//encodeQueryData
@Injectable({
  providedIn: 'root'
})
export class ApiManagerService extends GlobalReuse {

  last_gen_api = {
    headers: Object,
    'Api-Key': false,
    'api_key': false
  }

  constructor() {
    super()
  }

  /// available api/s
  get apis(): IApiModel[] {
    return new ApiList().list() as any;
  }



  buildRespCall(apiName: string, paramData: object, globs): IbuildRespCall {

    var required_params = ['prefix', 'api', 'query_params'];
    var _api = this.apis;
    //console.log('what are the kick ass _apis ',_api)

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

      return { error: true, message: `missing required_params: ${missing}` } as any
    }
    console.log('what api are me getting?',get_api)
    var _output = this.testOutput(get_api, paramData, globs) as any;

    if (_output.error) {
      //console.error('--- what is missing? ', _output.error)
      return { error: true, message: `${_output.error.toString()}` } as any;
    }

    return { url: _output } as any;

  }




  private modifyOutput(api: IApiModel, _obj) {

    api = this.checkAPIrequirements(api, _obj) as IApiModel;

    /*  
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
    */
    //var q = _.mergeWith(api.query_params,_obj,customizer); 

    if (!api.query_params) {
      console.error('something went wrong with modifyOutput');
      return false;
    }
    var query = this.encodeQueryData(api.query_params); // create url
    var q = this.removeEmptyParam(query);

    var _url = api.apiURL + q;
    console.log('what is the _url', _url)
    var clean_url = _url; // remove any empty params from url just in case

    return clean_url;
  }


private randNumber(max:number=10){
 var min = 0;
 return  Math.floor(Math.random()*(max-min+1)+min);
}


private randomTitleFor_omdbapi():string{
        var search_titles = ['bruce lee','kill bill','killer','ladies','sexy','iron man','start wars','matrix','ip man','rambo'];
        var rand_num = this.randNumber(search_titles.length-1);
  return search_titles[rand_num];
}

  private checkAPIprerequests(api: IApiModel): IApiModel {
    if (!api) {
      console.error('--- api is false for checkAPIprerequests!');
      return false as any;
    }
    if (api.prefix) {
      /// some logic here todo
      api.apiURL = api.api + "/" + api.prefix + "/";
    }

    if (api.auth === true) {
      /// some logic here todo
    }

    if ((api.api_key || api.apikey) && !api.header_params) {

      /// get key name for either value
      var _api_key = Object.keys(api)
        .filter(val => val.indexOf('api_key') !== -1 || val.indexOf('apikey') !== -1)[0];

      var _key_val = api.api_key || api.apikey;
      api.apiURL = api.api + `/?${_api_key}=` + _key_val;

    }

    if (api['Api-Key'] && api.header_params) {
      ///// some logic here todo
      //  api.apiURL =  api.apiURL +"?";

      (this.last_gen_api as any).headers = {
        'Api-Key': api['Api-Key']
      }
      delete api['Api-Key'];
    }


    if (api.token) {
      /// some logic here todo
      api.apiURL = api.api + "/?token=" + api.token;

    }

    if (api.free) {
      /// some logic here todo
    }
    
    /// presets
   if (api.name == 'omdbapi'){
     console.log('what are api.query_params as any).s',(api.query_params as any).s)
     if( !(api.query_params as any).s ){
      
        (api.query_params as any).s = this.randomTitleFor_omdbapi();
     }
   }

    // prepend corrent prefixes
    if (api.name == 'gettyimages') api.apiURL = api.apiURL + '?';
    if (api.name == 'punkapi') api.apiURL = api.apiURL + '?';
    if (api.name == 'flickr') api.apiURL = api.apiURL + '&';
    if (api.name == 'omdbapi') api.apiURL = api.apiURL + '&';

    return api
  }

  private checkAPIrequirements(api: IApiModel, _obj): IApiModel {

    // update pre requests!!
    api = this.checkAPIprerequests(api);

    // match to familiar name defenitions for all apis, saves alot of lines of code!!!
    var commKeyParams = {
      'gettyimages': {
        search: 'phrase',
        page: 'page',
        per_page: 'page_size'
      },
        'omdbapi': {
        search: 's',
        page: 'page',
     //   per_page: 'page_size'
      },
      'punkapi': {
        search: 'beer_name',
        page: 'page',
        per_page: 'per_page'
      },
      'flickr': {
        search: 'text',
        page: 'page',
        per_page: 'per_page'
      }
    }

    var api_selected_chain = commKeyParams[api.name];

    // recycle common
    for (var key in api_selected_chain) {
      var _delete = api_selected_chain[key];
      if ( (api.query_params as any)[_delete] ){
        delete (api.query_params as any)[_delete];
      }
    } //


    for (var key in _obj) {
      if (_obj.hasOwnProperty(key)) {

        /**
         * here we list api custom handle definitions and what to ignore 
         * in the url params if not avaialble
         */

        // to ignore
        if (key == 'originalName') {
          continue;
        }


        if (key == 'user_id' || key == 'owner') {
          (api.query_params as any).user_id = _obj[key];
          continue;
        }

        if (key == 'method') {
          (api.query_params as any).method = _obj[key];
          continue;
        }

        if (key == 'parent_page') {
          (api.query_params as any)[api_selected_chain.page] = 1;
          continue;
        }

        if (key == 'search_by_name' && api.name=='omdbapi') {
            if(!_obj[key]){
              (api.query_params as any)[api_selected_chain.search] = this.randomTitleFor_omdbapi();
               continue; // important to put it here
            }      
         
        }

        if (key == 'search_by_name' || key == 'byName') {
          (api.query_params as any)[api_selected_chain.search] = _obj[key];
          continue;
        }

        if (key == 'paged') {
          (api.query_params as any)[api_selected_chain.page] = _obj[key];
          continue;
        }

        if (key == 'per_page' && api.name=='omdbapi') {
          continue;
        }

        if (key == 'per_page') {
          (api.query_params as any)[api_selected_chain.per_page] = _obj[key];
          continue;
        }

        else { // this may cause problems, todo
          api.query_params[key] = _obj[key];
          continue;
        }

      }
    }


    if (api.name == 'omdbapi') {

      if (!api.query_params.s) {
        api.query_params.s = this.randomTitleFor_omdbapi();
      }
    }

    return api;

  }

  private testOutput(itemApi: IApiModel, _obj, globs: IMyGlobals): object {
    var output: any = {}
    var result;

    // check for supprted apis
    if (globs.api_support.indexOf(itemApi.name) !== -1) {

      //// prepend query with 
      var _url_ = this.modifyOutput(itemApi, _obj);
      console.log('-- modifyOutput url: ', _url_);
      if (_url_) {
        output.good = _url_
      } else {
        output.bad = true
      }
    }

    if (output.bad) {
      return { error: 'api no found!' } as any;
    }

    if (output.good) {
      return output.good;
    }

    else { //api_support 

      // console.error(`--- currently only supporting apiName: ${glob.api_support}`);
      var msg = `currently only supporting apiName: ${globs.api_support.toString()}`;
      return { error: msg } as any;
    }
  }


}
