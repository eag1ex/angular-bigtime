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
import { BeersModel,FlickrPhotoModel,Models,GettyImages } from './models';
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
  constructor(
    private http: Http,
    private logger: LoggerService,
    private lStorage: LocalStorageService,
    private apiManager:ApiManagerService
  ) { }

  

  ///check if we have avaialble localstorage first
  /**
   * LocalStorageService ids
      apiName:paged:1 
      apiName:item:name:Paradox_Islay 
   */

 
  checkLocalstorage(apiName,params: any): any {
    if (!params) return null;
    var getStorage: any = null;

    //{apiName}:paged:1  << always first page
    if (params.parent_page) {
      getStorage = this.lStorage.getItem(`${apiName}:paged:${1}`);
    }
    // {apiName}:paged:${paged}
    if (params.paged) {
      getStorage = this.lStorage.getItem(`${apiName}:paged:${params.paged}`);
    }

    // {apiName}:item:name:search_by_name
    // {apiName}:item:name:byName
    if (params.byName || params.search_by_name) {
      var searchBy = params.byName || params.search_by_name || false;
      getStorage = this.lStorage.getItem(`${apiName}:item:name:${searchBy}`);
    }
    return getStorage;
  }


  /**
   * this will set local storage for any sub-sequent calls to the same item/data
   * @param params 
   * @param data 
   */
  setLocalStorage(apiName,params: any, data: Models[]): boolean {

    if (!params && !data) return false;
    var setStorage: any = false;

    //{apiName}:paged:1  << always first page
    if (params.parent_page) {
      setStorage = this.lStorage.setItem(`${apiName}:paged:${1}`, data);
    }
    // {apiName}:paged:${paged}
    if (params.paged) {
      setStorage = this.lStorage.setItem(`${apiName}:paged:${params.paged}`, data);
    }
    // {apiName}:item:name:search_by_name
    if (params.search_by_name || params.byName) {
      var byName = params.search_by_name || params.byName || false;
      setStorage = this.lStorage.setItem(`${apiName}:item:name:${byName}`, data);
    }

    return setStorage;
  }


  errorHandler(errorData:any, apiName:string):object{

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


  getHttpRequest(params: IRouteName, apiName: string = 'punkapi',globs:IMyGlobals): Observable<any[]> {

    // remove all storage / for testing
    //this.lStorage.removeAll()

    var checkLocalstorage = this.checkLocalstorage(apiName,params);
    if (checkLocalstorage !== false && checkLocalstorage!==null && !params.searchAPI) {
     // console.log('why is localstorrage not empty',checkLocalstorage)
      this.logger.log(`getting data for ${apiName} from localstorage!!`)
      return checkLocalstorage;
    }

    // delete delete 
     delete  params.searchAPI;
     
    var _paramsReturn = this.apiManager.buildRespCall(apiName, params,globs);
    
    if (_paramsReturn.error) {
      var nice_print = ( _paramsReturn.error ) ? JSON.stringify(_paramsReturn):_paramsReturn;
     // console.log('what is _paramsReturn!!!!!',nice_print)
      return Observable.throw(`api error for ${apiName}: ${nice_print}`);
    }

    if ( apiName == 'gettyimages') {
      (params as any).header_params = this.apiManager.last_gen_api.headers;
      return this.httpRequest(params, _paramsReturn.url, apiName, 
        // MANAGE DATA OUTPUT
        (DATA:GettyImages[])=>{
          return (DATA as any).images
        }) as Observable<GettyImages[]>;
    }
    

    if ( apiName == 'punkapi') {
      return this.httpRequest(params, _paramsReturn.url, apiName, 
        // MANAGE DATA OUTPUT
        (DATA:BeersModel[])=>{
          return DATA;
        }) as Observable<BeersModel[]>;
    }

    if (apiName == 'flickr') {
      return this.httpRequest(params, _paramsReturn.url, apiName,
        // MANAGE DATA OUTPUT
        (DATA:FlickrPhotoModel[])=>{
          return (DATA as any).photos.photo;

      }) as Observable<FlickrPhotoModel[]>;
    } 
   
  }           



  private httpRequest(originalParams: IRouteName, paramsReturn: string, _apiName: string, dataCallBack): Observable<any[]> {

    var with_headers = this.generateHeaderOptions(originalParams);

    if(!with_headers){ // if no headers available pass empty headers :)
      with_headers = new RequestOptions({}); 
    }
    //console.log('what are the with_headers: ',with_headers)
    return this.http.get(paramsReturn,with_headers)
      .map((response: any) => {

        var checker = this.errorHandler(response.json(), _apiName);
        if (checker) {
          throw checker as any;
        }
        
        //console.log('what is the response.json()',response.json())

        return dataCallBack(response.json()) as any;
      })
      .do((dat) => {      
        //var r_data = // manage data output
      //  console.log('what is the new data here',r_data)
        //this.setLocalStorage(_apiName,originalParams, dat); // magic happens!
        return dat;
      })
      .catch((error: any) => {
        this.logger.log(error, true)
        return Observable.throw(error || 'Upps error getting data, api or localstorage!');
      });

  }



  getFlickerLink(params: IRouteName, apiName: string = 'punkapi', globs: IMyGlobals): Observable<any[]> {

    var _paramsReturn = this.apiManager.buildRespCall(apiName, params, globs);

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
        // this.setLocalStorage(originalParams, r_data); // magic happens!
        return dat;
      })
      .catch((error: any) => {
        this.logger.log(error, true)
        return Observable.throw(error || 'Upps error getting data, api or localstorage!');
      });

  }

  generateHeaderOptions(header_val: any):RequestOptions {
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

