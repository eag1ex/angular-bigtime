import { Injectable } from '@angular/core';
import { ApiList } from '../../../api-list';
import { IApiModel, IMyGlobals } from '../../interfaces';
import { GlobalReuse } from '../../global.reuse';
//import * as _ from "lodash"; 

import { IbuildRespCall } from "../../interfaces";



//encodeQueryData
@Injectable({
  providedIn: 'root'
})
export class ApiManagerService extends GlobalReuse {
  _globals:IMyGlobals;
  last_gen_api = {
    headers: Object,
    'Api-Key': false,
    'api_key': false
  }

  constructor() {
    super();

  }

  /// available api/s
  get apis(): IApiModel[] {
    return new ApiList().list() as any;
  }



  buildRespCall(apiName: string, paramData: object, globs:IMyGlobals): IbuildRespCall {
    // import
    this._globals = globs;

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
   // console.log('what api are me getting?',get_api)
    var _output = this.testOutput(get_api, paramData) as any;

    if (_output.error) {
      //console.error('--- what is missing? ', _output.error)
      return { error: true, message: `${_output.error.toString()}` } as any;
    }
    var ready_d = { url: _output.good} as any;
    if(_output.lastSearch ){
        _output.lastSearch = encodeURIComponent(_output.lastSearch);
        ready_d.lastSearch =_output.lastSearch; 
    }
    return ready_d as any;

  }




  private modifyOutput(api: IApiModel, _obj):object {

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
      return false as any;
    }
    var query = this.encodeQueryData(api.query_params); // create url
    var q = this.removeEmptyParam(query);

    var _url = api.apiURL + q;
   // console.log('what is the _url', _url)
    var clean_url = _url; // remove any empty params from url just in case

    return {clean_url:clean_url,lastSearch:(api as any).lastSearch};
  }


private randNumber(max:number=10){
 var min = 0;
 return  Math.floor(Math.random()*(max-min+1)+min);
}


private searchByrandomTitle(search_titles:Array<any>):string{
    if(!search_titles) return ''
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


    // randomSearch values
  
    // match to familiar name defenitions for all apis, saves alot of lines of code!!!
    var commKeyParams = {
      'gettyimages': {
        search: 'phrase',
        page: 'page',
        per_page: 'page_size',
         randomTitles:['technology','galaxy','crime','war','poland','love','drugs','strong man','future','kungfu','creative','celebrity','china','bangkok','thailand']
      },
        'omdbapi': {
        search: 's',
        page: 'page',
        randomTitles:['bruce lee','kill bill','war','killer','ladies','sexy','iron man','start wars','the matrix','ip man','rambo']
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
        per_page: 'per_page',
        randomTitles:['bruce lee','kill bill','killer','war','ladies','sexy','strong man','start wars','the matrix','kungfu','rambo','galaxy']
      }
    }

    var api_selected_chain = commKeyParams[api.name];

    // recycle common
    for (var key in api_selected_chain) {
      var _delete = api_selected_chain[key];
      if ( (api.query_params as any)[_delete] && key!=='randomTitles'){
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

    // add rendom search results except for punkapi
     if (api.name !== 'punkapi') {
      if (!api.query_params[ api_selected_chain.search]) {
        var searchName = this.searchByrandomTitle(api_selected_chain.randomTitles);
        api.query_params[ api_selected_chain.search] =  searchName;
         this._globals.api_random_search_val = searchName;
        console.log('--- searching for ',searchName)
      }
    }
    (api as any).lastSearch = api.query_params[ api_selected_chain.search]||'';
    return api;

  }

  private testOutput(itemApi: IApiModel, _obj): object {
    var output: any = {}
    var result;

    delete _obj.searchAPI; /// we do not need it here
    // check for supprted apis
    if (this._globals.api_support.indexOf(itemApi.name) !== -1) {

      //// prepend query with 
      var val = this.modifyOutput(itemApi, _obj) as any;
      console.log('-- modifyOutput url: ', val.clean_url);
      if (val.clean_url) {
        output.good = val.clean_url
      } else {
        output.bad = true
      }
    }

    if (output.bad) {
      return { error: 'api no found!' } as any;
    }

    if (output.good) {
      return {good:output.good,lastSearch:val.lastSearch};
    }

    else { //api_support 

      // console.error(`--- currently only supporting apiName: ${glob.api_support}`);
      var msg = `currently only supporting apiName: ${this._globals.api_support.toString()}`;
      return { error: msg } as any;
    }
  }


}
