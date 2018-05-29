import { Injectable } from '@angular/core';
import { ApiList } from '../../../api-list';
import { IApiModel } from '../../interfaces';
import { GlobalReuse } from '../../global.reuse';
import * as _ from "lodash";

import {IMyGlobals} from "../../interfaces";

import {IbuildRespCall} from "../../interfaces";



//encodeQueryData
@Injectable({
  providedIn: 'root'
})
export class ApiManagerService extends GlobalReuse {

  last_gen_api = {
    headers:Object,
    'Api-Key':false,
    'api_key':false
  }

  constructor() {
    super()
  }  
     
  /// available api/s
  get apis(): IApiModel[] {
    return new ApiList().list();
  }
      


  buildRespCall(apiName: string, paramData: object, glob): IbuildRespCall {

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

      return {error:true,message:`missing required_params: ${missing}`}as any
    }

    var _output = this.matchOutput(get_api, paramData, glob) as any;

    if(_output.error ){
        //console.error('--- what is missing? ', _output.error)
       return {error:true,message:`${_output.error.toString()}`}as any;
    }

    return {url:_output} as any;

  }




 private checkRequirementsModifyOutput(api: IApiModel, _obj, globs) {

    if (api.prefix) {
      /// some logic here todo
       api.apiURL = api.api + "/" +api.prefix + "/";
    }   

    if (api.auth === true) {
      /// some logic here todo
    }

    if (api.api_key && !api.header_params) {
      /// some logic here todo
        api.apiURL = api.api + "/?api_key=" +api.api_key;

    }

    if (api['Api-Key'] && api.header_params) {
      ///// some logic here todo
      //  api.apiURL =  api.apiURL +"?";

        (this.last_gen_api as any).headers={
          'Api-Key':api['Api-Key']
        }
    }


    if (api.token) {
      /// some logic here todo
       api.apiURL = api.api + "/?token=" +api.token;
       
    }
    
    /**
    'phrase': "",// what to search
    'fields': 'comp,id,title,collection_name,caption,detail_set',// what to output
    'page_size': 20,// per page results
    'page': 1
     */


    if (api.name == 'gettyimages') {

      api.apiURL = api.apiURL + '?';

      for (var key in _obj) {
        if (_obj.hasOwnProperty(key)) {
          
          // to ignore
          if (key == 'originalName') {
            continue;
          }

          if (key == 'parent_page') {
            (api.query_params as any).page = 1;
            continue;
          }


          if (key == 'search_by_name' || key == 'byName') {
            (api.query_params as any).phrase = _obj[key];
            continue;
          }

          if (key == 'paged') {
            (api.query_params as any).page = _obj[key];
            continue;
          }
          if (key == 'per_page') {
            (api.query_params as any).page_size = _obj[key];
            continue;
          }

          else {          
            api.query_params[key] = _obj[key];
            continue;
          }


        }
      }

    }


    if (api.name == 'flickr') {
      console.log('what is _obj for flicker',_obj)

       api.apiURL = api.apiURL+'&';

       /// reset other query for this search
      // unset api.query_params.text
      delete (api.query_params as any).text;
      
      for (var key in _obj) {
        if (_obj.hasOwnProperty(key)) {

          if(key=='user_id' || key=='owner'){       
            (api.query_params as any).user_id = _obj[key];
            continue; 
          }

          if (key == 'method') {
            (api.query_params as any).method = _obj[key];
            continue; 
          }


          if (key == 'search_by_name' || key == 'byName') {
            (api.query_params as any).text = _obj[key];
            continue; 
          }

          if (key == 'paged') {
            (api.query_params as any).page = _obj[key];
            continue; 
          }

           if (key == 'per_page') {       
            (api.query_params as any).per_page = _obj[key];
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
    }// flickr

    if (api.name == 'punkapi') {
      api.apiURL = api.apiURL+'?';
      /// update query_params for output
      // reset
      delete (api.query_params as any).beer_name;

      for (var key in _obj) {
        if (_obj.hasOwnProperty(key)) {

  

          if (key == 'paged') {
            (api.query_params as any).page = _obj[key];
            continue; 
          }

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
      } // punkapi

      
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

    //console.log('what is api.query_params', api.query_params)
    if (!api.query_params) {
      console.error('something went wrong with checkRequirementsModifyOutput');
      return false;       
    }
    var query = this.encodeQueryData(api.query_params); // create url
    var q = this.removeEmptyParam(query);

    var _url = api.apiURL + q;
    console.log('what is the _url',_url) 
    var clean_url =_url; // remove any empty params from url just in case

    return clean_url;
  }





 private matchOutput(itemApi: IApiModel, _obj, glob:IMyGlobals): object {
    var output: any = {}
    var result;

    // check for supprted apis
    if (glob.api_support.indexOf(itemApi.name )!==-1) {

      //// prepend query with 
      var _url_ = this.checkRequirementsModifyOutput(itemApi, _obj, glob);
      console.log('-- checkRequirementsModifyOutput url: ', _url_);
      if (_url_) {
        output.good = _url_
      } else {
        output.bad = true
      }
    } 

    if (output.bad) {
      return { error: 'api no found!' } as any;
    }

    if(output.good ){
      return output.good;
    }

    else { //api_support 
      
     // console.error(`--- currently only supporting apiName: ${glob.api_support}`);
      var msg = `currently only supporting apiName: ${glob.api_support.toString()}`;
      return { error: msg } as any;
    }
  }


}
