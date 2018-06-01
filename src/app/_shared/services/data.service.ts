import { Injectable } from '@angular/core';
import { Headers, Http,RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch'; //
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/toPromise';

import * as _ from "lodash";
import { BeersModel,FlickrPhotoModel,Models,GettyImages,OmdbapiModel } from './models';
import { LoggerService } from './logger.service';
import { LocalStorageService } from './local-storage.service';
import {ApiManagerService} from './api-manager/api-manager.service';

// interfaces
import { IRouteName, IMyGlobals} from '../interfaces';



@Injectable({
  providedIn: 'root'
})
export class DataService {
 /// private apiURL = 'https://api.punkapi.com/v2/beers'; now using ApiManagerService
  public punkapiData: Array<any>;
  public _globs:any;
  constructor(
    private http: Http,
    private logger: LoggerService,
    private lStorage: LocalStorageService,
    private apiManager:ApiManagerService
  ) { 

    
  }

  get _globals(){
    return this._globs;
  }

  ///check if we have avaialble localstorage first
  
  checkLocalstorage(apiName, params: any): any {
    if (!params) return null;
    var getStorage: any = null;
    console.log('do wehave last search q ',params.lastSearch)
    //{apiName}:paged:1:lastSearch:example_name  << always first page
    if (params.parent_page) {
      var set_key = `${apiName}:paged:${1}`;
      if (params.lastSearch) {
        set_key = set_key + `:lastsearch:${params.lastSearch}`;
      }
      getStorage = this.lStorage.getItem(set_key);
    }
    // {apiName}:paged:${paged}:lastSearch:example_name
    if (params.paged) {
      var set_key = `${apiName}:paged:${params.paged}`;
      if (params.lastSearch) {
        set_key = set_key + `:lastsearch:${params.lastSearch}`;
      }
      getStorage = this.lStorage.getItem(set_key);
    }

    // {apiName}:item:name:search_by_name:lastSearch:example_name
    // {apiName}:item:name:byName:lastSearch:example_name
    if (params.byName || params.search_by_name) {
      var searchBy = params.byName || params.search_by_name;
      var set_key = `${apiName}:item:name:${searchBy}`;

      if (params.lastSearch) {
        set_key = set_key + `:lastsearch:${params.lastSearch}`;
      }

      getStorage = this.lStorage.getItem(set_key);
    }
    return getStorage;
  }


  /**
   * this will set local storage for any sub-sequent calls to the same item/data
   * @param params 
   * @param data 
   */
  setLocalStorage(apiName, params: any, data: Models[]): boolean {

    if (!params && !data) return false;
    var setStorage: any = false;

    //{apiName}:paged:1:lastSearch:example_search  << always first page
    if (params.parent_page) {
      var set_key = `${apiName}:paged:${1}`;
      if (params.lastSearch) {
        set_key = set_key + `:lastsearch:${params.lastSearch}`;
      }
      setStorage = this.lStorage.setItem(set_key, data);
    }
    // {apiName}:paged:${paged}:lastSearch:example_search
    if (params.paged) {
      var set_key = `${apiName}:paged:${params.paged}`;
      if (params.lastSearch) {
        set_key = set_key + `:lastsearch:${params.lastSearch}`;
      }
      setStorage = this.lStorage.setItem(set_key, data);
    }
    // {apiName}:item:name:search_by_name:lastSearch:example_search
    if (params.search_by_name || params.byName) {
      var byName = params.search_by_name || params.byName;
      var set_key = `${apiName}:item:name:${byName}`;
      if (params.lastSearch) {
        set_key = set_key + `:lastsearch:${params.lastSearch}`;
      }
      setStorage = this.lStorage.setItem(set_key, data);
    }

    return setStorage;
  }


  errorHandler(errorData:any, apiName:string):object{

    if (apiName == 'omdbapi') {
      if(errorData.Error!==undefined){
          return errorData;
      }
    }

    if (apiName == 'gettyimages') {
      if (errorData.ErrorCode !== undefined) {
        return errorData;
      }

      if (errorData.images == undefined) {
        return {
          error: true,
          message: 'no results found',
          apiName: apiName
        };
      }

      if (errorData.images !== undefined) {
        if (errorData.images.length == 0) {
          return {
            error: true,
            message: 'no results found',
            apiName: apiName
          };
        }
      }
    }
   
    if (apiName == 'flickr') {
      if (errorData.photos !== undefined) {
        if (errorData.photos.photo.length == 0) {
          return {
            error: true,
            message: 'no results found',
            apiName: apiName
          }
        }
      }

      if (errorData.stat === 'fail') {
        errorData.apiName = apiName
        return errorData;
      }
    }

    if(errorData.error){
      errorData.apiName = apiName
      return errorData;
    }

      if (errorData.length === 0) {
        return {
          error: true,
          message: 'data respons as null',
          apiName: apiName
        }
      

    }else{
      return false as any;
    }
  }


  getHttpRequest(params: IRouteName, apiName: string = 'punkapi'): Observable<any[]> {

    // remove all storage / for testing
    //this.lStorage.removeAll()
    var _paramsReturn = this.apiManager.buildRespCall(apiName, params,this._globals as IMyGlobals);

    var paramsForLocalStorage =params;
    paramsForLocalStorage.lastSearch= _paramsReturn.lastSearch;
    var checkLocalstorage = this.checkLocalstorage(apiName,paramsForLocalStorage);

    if (checkLocalstorage !== false && checkLocalstorage!==null && !params.searchAPI) {
     // console.log('why is localstorrage not empty',checkLocalstorage)
      this.logger.log(`getting data for ${apiName} from localstorage!!`)
      return checkLocalstorage;
    }


     
   
    
    if (_paramsReturn.error) {
      var nice_print = ( _paramsReturn.error ) ? JSON.stringify(_paramsReturn):_paramsReturn;
     // console.log('what is _paramsReturn!!!!!',nice_print)
      return Observable.throw(`api error for ${apiName}: ${nice_print}`);
    }


    if ( apiName == 'omdbapi') {
      return this.httpRequest(params, _paramsReturn, apiName, 
        // MANAGE DATA OUTPUT
        (DATA:OmdbapiModel[])=>{
          var d= (DATA as any).Search;
          /// conditional check
          return this.checkImages_omdbapi(d);
        }) as Observable<OmdbapiModel[]>;
    }

    
    if ( apiName == 'gettyimages') {
      (params as any).header_params = this.apiManager.last_gen_api.headers;
      return this.httpRequest(params, _paramsReturn, apiName, 
        // MANAGE DATA OUTPUT
        (DATA:GettyImages[])=>{
          return (DATA as any).images
        }) as Observable<GettyImages[]>;
    }
    

    if ( apiName == 'punkapi') {
      return this.httpRequest(params, _paramsReturn, apiName, 
        // MANAGE DATA OUTPUT
        (DATA:BeersModel[])=>{
          return DATA;
        }) as Observable<BeersModel[]>;
    }

    if (apiName == 'flickr') {
      return this.httpRequest(params, _paramsReturn, apiName,
        // MANAGE DATA OUTPUT
        (DATA:FlickrPhotoModel[])=>{
          return (DATA as any).photos.photo;
            
      }) as Observable<FlickrPhotoModel[]>;
    } 
   
  }           



  private httpRequest(originalParams: IRouteName, paramsReturn: any, _apiName: string, dataCallBack): Observable<any[]> {
    delete originalParams.searchAPI;
    
    var with_headers = this.generateHeaderOptions(originalParams);

    if(!with_headers){ // if no headers available pass empty headers :)
      with_headers = new RequestOptions({}); 
    }

    /// modify original params for local storage
    if(paramsReturn.lastSearch){
      originalParams.lastSearch=  paramsReturn.lastSearch
    }
     
    return this.http.get(paramsReturn.url,with_headers)
      .map((response: any) => {

        var checker = this.errorHandler(response.json(), _apiName);
        if (checker) {
          throw checker as any;
        }

        var d = dataCallBack(response.json()); 
        var checked_data = this.returnMaxAllowed(d);
       // console.log('what is the data',checked_data)
        return checked_data as any;
      })
      .do((dat) => {      
        //var r_data = // manage data output
      //  console.log('what is the new data here',r_data)
        this.setLocalStorage(_apiName,originalParams, dat); // magic happens!
        return dat;
      })
      .catch((error: any) => {
        this.logger.log(error, true)
        return Observable.throw(error || 'Upps error getting data, api or localstorage!');
      });

  }

  // in case of overloads, because we are also storing to localStorage, so no overloading the browser:) 
  returnMaxAllowed(dataModel:Models[],limit:number=10/*per page*/):Models[]{

    var dataLen = dataModel.length;
    var newData = dataModel;

    if(dataLen>limit){
        var reduceBy = dataLen - limit;
        newData = _.dropRight(dataModel,reduceBy);
        console.log('-- modelData reduced by: ',reduceBy);
    }
    
    return newData;
  }


  getFlickerLink(params: IRouteName, apiName: string = 'punkapi'): Observable<any[]> {

    var _paramsReturn = this.apiManager.buildRespCall(apiName, params, this._globals as IMyGlobals);

    if (_paramsReturn.error) {
      var nice_print = (_paramsReturn.error) ? JSON.stringify(_paramsReturn) : _paramsReturn;
      // console.log('what is _paramsReturn!!!!!',nice_print)
      return Observable.throw(`api error for ${apiName}: ${nice_print}`);
    }


    return this.http.get(_paramsReturn.url)
      .map((response: any) => {

        var checker = this.errorHandler(response.json(), apiName);
        if (checker) {
          throw checker as any;
        }

        return response.json().user as any;
      })
      .do((dat) => {
        //var r_data = // manage data output
       // console.log('what is the iser_id data: ', dat)
         this.setLocalStorage(apiName,params, dat); // magic happens!
        return dat;
      })
      .catch((error: any) => {
        this.logger.log(error, true)
        return Observable.throw(error || 'Upps error getting data, api or localstorage!');
      });

  }

  // only output with images
  private checkImages_omdbapi(data: OmdbapiModel[]): OmdbapiModel[] {
    return data.reduce((outp, val, inx) => {
      if (val.Poster.indexOf('N/A') == -1) {
        outp.push(val);
      }
      return outp;
    }, [])
  }

  private generateHeaderOptions(header_val: any):RequestOptions {
    if (!header_val.header_params) return false as any;

    var hData = header_val.header_params
    var headers = new Headers();
    var options;

    for (var key in hData) {
      if (hData.hasOwnProperty(key)) {
        headers.append(key, hData[key]);
      }
    }
    if (!headers) return false as any;
    options = new RequestOptions({ headers: headers });
    return options
  }

}

