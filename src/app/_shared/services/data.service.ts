import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch'; //
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/toPromise';

import * as _ from "lodash";
import { BeersModel,FlickrPhotoModel,Models } from './models';
import { LoggerService } from './logger.service';
import { LocalStorageService } from './local-storage.service';
import {ApiManagerService} from './api-manager/api-manager.service';

// interfaces
import { IRouteName } from '../interfaces';



@Injectable({
  providedIn: 'root'
})
export class DataService {
 /// private apiURL = 'https://api.punkapi.com/v2/beers'; now using ApiManagerService
  public beersData: Array<any>;
  constructor(
    private http: Http,
    private logger: LoggerService,
    private lStorage: LocalStorageService,
    private apiManager:ApiManagerService
  ) { }

  

  ///check if we have avaialble localstorage first
  /**
   * LocalStorageService ids
      beers:paged:1 
      beers:item:name:Paradox_Islay 
   */

  checkLocalstorage(params: any): any {
    if (!params) return null;
    var getStorage: any = null;

    //beers:paged:1  << always first page
    if (params.parent_page) {
      getStorage = this.lStorage.getItem(`beers:paged:${1}`);
    }
    // beers:paged:${paged}
    if (params.paged) {
      getStorage = this.lStorage.getItem(`beers:paged:${params.paged}`);
    }

    // beers:item:name:search_by_name
    // beers:item:name:byName
    if (params.byName || params.search_by_name) {
      var searchBy = params.byName || params.search_by_name || false;
      getStorage = this.lStorage.getItem(`beers:item:name:${searchBy}`);
    }
    return getStorage;
  }


  /**
   * this will set local storage for any sub-sequent calls to the same item/data
   * @param params 
   * @param data 
   */
  setLocalStorage(params: any, data: BeersModel[]): boolean {

    if (!params && !data) return false;
    var setStorage: any = false;

    //beers:paged:1  << always first page
    if (params.parent_page) {
      setStorage = this.lStorage.setItem(`beers:paged:${1}`, data);
    }
    // beers:paged:${paged}
    if (params.paged) {
      setStorage = this.lStorage.setItem(`beers:paged:${params.paged}`, data);
    }
    // beers:item:name:search_by_name
    if (params.search_by_name || params.byName) {
      var byName = params.search_by_name || params.byName || false;
      setStorage = this.lStorage.setItem(`beers:item:name:${byName}`, data);
    }

    return setStorage;
  }


  errorHandler(errorData:any, apiName:string):object{
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


  getHttpRequest(params: IRouteName, apiName: string = 'punkapi',globs): Observable<any[]> {

    // remove all storage / for testing
    //this.lStorage.removeAll()

    var checkLocalstorage = this.checkLocalstorage(params);
    if (checkLocalstorage !== false) {
      this.logger.log('getting beers from localstorage!!')
      return checkLocalstorage;
    }

    var _paramsReturn = this.apiManager.buildRespCall(apiName, params,globs);
    
    if (!_paramsReturn || (_paramsReturn as any).error) {
      var nice_print = ( (_paramsReturn as any).error ) ? JSON.stringify(_paramsReturn):_paramsReturn;
     // console.log('what is _paramsReturn!!!!!',nice_print)
      return Observable.throw(`api error for ${apiName}: ${nice_print}`);
    }


    if (apiName == 'punkapi') {
      return this.httpRequest(params, _paramsReturn, apiName) as Observable<BeersModel[]>;
    }

    if (apiName == 'flickr') {
      return this.httpRequest(params, _paramsReturn, apiName) as Observable<FlickrPhotoModel[]>;
    }

  }

  httpRequest(originalParams: IRouteName, paramsReturn: string, _apiName: string): Observable<any[]> {
    return this.http.get(paramsReturn)
      .map((response: any) => {

        var checker = this.errorHandler(response.json(), _apiName);
        if (checker) {
          throw checker as any;
        }
        return response.json() as Models[]
      })
      .do((dat) => {
        console.log('what is the new data here',dat)
        this.setLocalStorage(originalParams, dat); // magic happens!
        return dat;
      })
      .catch((error: any) => {
        this.logger.log(error, true)
        return Observable.throw(error || 'Upps error getting data, api or localstorage!');
      });

  }
}

