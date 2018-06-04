import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch'; //
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/toPromise';

import * as _ from "lodash";
import { BeersModel, FlickrPhotoModel, Models, GettyImages, OmdbapiModel,Omdbapi_imdbID } from './models';
import { LoggerService } from './logger.service';
import { LocalStorageService } from './local-storage.service';
import { ApiManagerService } from './api-manager/api-manager.service';

// interfaces
import { IRouteName, IMyGlobals } from '../interfaces';



@Injectable({
  providedIn: 'root'
})
export class DataService {
  public punkapiData: Array<any>;
  public _globs: any;
  constructor(
    private http: Http,
    private logger: LoggerService,
    private lStorage: LocalStorageService,
    private apiManager: ApiManagerService
  ) {


  }

  get _globals() {
    return this._globs;
  }

  ///check if we have avaialble localstorage first
  checkLocalstorage(apiName, params: any, single:boolean=false): any {
    if (!params) return null;
    var getStorage: any = null;
    var set_key;
    /*
    var matched= ['parent_page','paged','byName','search_by_name'].filter((item, inx)=>{
       return params.indexOf(item)!==-1;
    }).length> 0 ? matched:false;

    var match_logic = 

    if(matched){
    }
    */
    
    if (params.imdbID && single) set_key = `${apiName}-imdbID:${params.imdbID}`;
    if (params.imdbID && !single) return false;

    //{apiName}:paged:1:lastSearch:example_name  << always first page
    if (params.parent_page) set_key = `${apiName}:paged:${1}`;

    // {apiName}:paged:${paged}:lastSearch:example_name
    if (params.paged) set_key = `${apiName}:paged:${params.paged}`;

    // {apiName}:search_by_name:lastSearch:example_name
    // {apiName}:byName:lastSearch:example_name
    var searchBy = params.byName || params.search_by_name;
    if (searchBy) {
      set_key = `${apiName}:name:${searchBy}`;
    }


    if (params.lastSearch && !single) set_key = set_key + `:lastsearch:${params.lastSearch}`;
   
    //console.log('getStorage ',set_key)

    getStorage = this.lStorage.getItem(set_key);
    return getStorage;
  }


  /**
   * this will set local storage for any sub-sequent calls to the same item/data
   * @param params 
   * @param data 
   */
  setLocalStorage(apiName, params: any, data: Models[], single:boolean=false): boolean {

    if (!params && !data) return false;
    var setStorage: any = false;
    var set_key;
  
    //{apiName}-imdbID:tt0371746  << 
    if (params.imdbID && single) set_key = `${apiName}-imdbID:${params.imdbID}`;
    if (params.imdbID && !single) return false;

    //{apiName}:paged:1:lastSearch:example_search  << always first page
    if (params.parent_page) set_key = `${apiName}:paged:${1}`;

    // {apiName}:paged:${paged}:lastSearch:example_search
    if (params.paged) set_key = `${apiName}:paged:${params.paged}`;

    // {apiName}:item:name:search_by_name:lastSearch:example_search
    if (params.search_by_name || params.byName) {
      var byName = params.search_by_name || params.byName;
      set_key = `${apiName}:name:${byName}`;
    }

    if (params.lastSearch && !single) set_key = set_key + `:lastsearch:${params.lastSearch}`;
    
   // console.log('setStorage ',set_key)
    setStorage = this.lStorage.setItem(set_key, data);
    return setStorage;
  }


  /**
   * mocked error handling for each api error respond 
   * @param errorData 
   * @param apiName 
   */
  errorHandler(errorData: any, apiName: string): object {

    if (apiName == 'omdbapi') {
      if (errorData.Error !== undefined && !errorData.imdbID) {
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

    if (errorData.error) {
      errorData.apiName = apiName
      return errorData;
    }

    if (errorData.length === 0) {
      return {
        error: true,
        message: 'data respons as null',
        apiName: apiName
      }


    } else {
      return false as any;
    }
  }

  /**
   * getHttpRequest(..):Observable
   * rest :get request together with httpRequest(..)
   * we do our call request with this method which works together with "this.apiManage" which handles
   * api rest parse/manipulation to single url string
   * we check for presence of localstorage and return from here in case its available, this is the best way 
   * of handling localstorage i think because it returns the same respons as if it were a call from rest :)
   * We switchcase rest call baseton api requested and manipulate respons arrordingly, every rest resp as an assigned model decorator
   * so we know what to except!
   * 
   */

  getHttpRequest(params: IRouteName, apiName: string = 'punkapi'): Observable<any[]> {

    var _paramsReturn = this.apiManager.buildRespCall(apiName, params, this._globals as IMyGlobals);

    var paramsForLocalStorage = params;
    if(_paramsReturn.lastSearch){
       paramsForLocalStorage.lastSearch = _paramsReturn.lastSearch;
    }
    
    var checkLocalstorage = this.checkLocalstorage(apiName, paramsForLocalStorage);

    if (checkLocalstorage !== false && checkLocalstorage !== null && !params.searchAPI) {
      this.logger.log(`getting data for ${apiName} from localstorage!!`)
     // console.log(`getting data for ${apiName} from localstorage!! `,checkLocalstorage);
      return checkLocalstorage;
    }


    if (_paramsReturn.error) {
      var nice_print = (_paramsReturn.error) ? JSON.stringify(_paramsReturn) : _paramsReturn;
      return Observable.throw(`api error for ${apiName}: ${nice_print}`);
    }

    var RESP: Observable<any[]>;

    switch (apiName) {

      case 'omdbapi':

        RESP = this.httpRequest(params, _paramsReturn, apiName,
          // MANAGE DATA OUTPUT
          (DATA: any) => {
            var d;
            // do we have OmdbapiModel or Omdbapi_imdbID

             /// conditional check
            if (DATA.Search) {
               d = DATA.Search as OmdbapiModel[];
              return this.checkImages_omdbapi(d);
            }

            if (DATA.imdbID || DATA.Title) {
              d = [DATA] as Omdbapi_imdbID[];
              return this.checkImages_omdbapi(d);
            }        
            
          }) as Observable<OmdbapiModel[] & Omdbapi_imdbID[]>;
        break;

      case 'punkapi':

        RESP = this.httpRequest(params, _paramsReturn, apiName,
          // MANAGE DATA OUTPUT
          (DATA: BeersModel[]) => {
            return DATA;
          }) as Observable<BeersModel[]>;
        break;

      case 'gettyimages':

        (params as any).header_params = this.apiManager.last_gen_api.headers;
        RESP = this.httpRequest(params, _paramsReturn, apiName,
          // MANAGE DATA OUTPUT
          (DATA: GettyImages[]) => {
            return (DATA as any).images
          }) as Observable<GettyImages[]>;
        break;

      case 'flickr':

        RESP = this.httpRequest(params, _paramsReturn, apiName,
          // MANAGE DATA OUTPUT
          (DATA: FlickrPhotoModel[]) => {
            return (DATA as any).photos.photo;
          }) as Observable<FlickrPhotoModel[]>;
        break;

      default:
        this.logger.log('apiName not matched so requesting default', true);
        RESP = this.httpRequest(params, _paramsReturn, 'punkapi',
          // MANAGE DATA OUTPUT
          (DATA: BeersModel[]) => {
            return DATA;
          }) as Observable<BeersModel[]>;
      //code block
    }

    return RESP;
  }


  /**
   * extended to getHttpRequest(..)
   *  nice error handling implemented
   * 
   * @param originalParams 
   * @param paramsReturn 
   * @param _apiName 
   * @param dataCallBack 
   */
  private httpRequest(originalParams: IRouteName, paramsReturn: any, _apiName: string, dataCallBack): Observable<any[]> {
    delete originalParams.searchAPI;

    // check for headers if api requires it!
    var with_headers = this.generateHeaderOptions(originalParams);
    if (!with_headers) { // if no headers available pass empty headers :)
      with_headers = new RequestOptions({});
    }

    /// modify original params for local storage
    if (paramsReturn.lastSearch) {
      originalParams.lastSearch = paramsReturn.lastSearch
    }

    return this.http.get(paramsReturn.url, with_headers)
      .map((response: any) => {

        var checker = this.errorHandler(response.json(), _apiName);
        if (checker) {
          throw checker as any;
        }

        var d = dataCallBack(response.json());
        var checked_data = this.returnMaxAllowed(d);
        return checked_data as any;
      })
      .do((dat) => {

        this.setLocalStorage(_apiName, originalParams, dat); // magic happens!
       
        return dat;
      })
      .catch((error: any) => {

        /**
         * error responseson timeout or connection error
         * net::ERR_CONNECTION_RESET
         * Response with status: 0
         */
        if (error.toString()) {
          var err_str = error.toString();
          var checkErr = ['net::ERR_CONNECTION_RESET', 'Response with status: 0'].filter((item, inx) => {
            return err_str.indexOf(item) !== -1;
          })
          if (checkErr.length > 0) {
            return Observable.throw({response:checkErr, message:'possibly no internet connection..'});
          }

        } else {
          this.logger.log(error, true)
          return Observable.throw(error || 'Upps error getting data, api or localstorage!');
        }

      });

  }

  getItemimdbData(params: IRouteName, apiName: string = ''): Observable<Omdbapi_imdbID[]> {

    var _paramsReturn = this.apiManager.buildRespCall(apiName, params, this._globals as IMyGlobals);
    if (_paramsReturn.error) {
      var nice_print = (_paramsReturn.error) ? JSON.stringify(_paramsReturn) : _paramsReturn;
      return Observable.throw(`api error for ${apiName}: ${nice_print}`);
    }

    return this.http.get(_paramsReturn.url)
      .map((response: any) => {

        var checker = this.errorHandler(response.json(), apiName);
        if (checker) {
          throw checker as any;
        }
        return [response.json()] as any;
      })
      .do((dat) => {
        console.log('getItemimdbData ',dat)
        return dat;
      })
      .catch((error: any) => {
        this.logger.log(error, true)
        return Observable.throw(error || 'Upps error getting data, api or localstorage!');
      });
  }

  getFlickerLink(params: IRouteName, apiName: string = ''): Observable<any[]> {

    var _paramsReturn = this.apiManager.buildRespCall(apiName, params, this._globals as IMyGlobals);
    if (_paramsReturn.error) {
      var nice_print = (_paramsReturn.error) ? JSON.stringify(_paramsReturn) : _paramsReturn;
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

        return dat;
      })
      .catch((error: any) => {
        this.logger.log(error, true)
        return Observable.throw(error || 'Upps error getting data, api or localstorage!');
      });

  }


  // in case of overloads, because we are also storing to localStorage, so no overloading the browser:) 
  private returnMaxAllowed(dataModel: Models[], limit: number = 10/*per page*/): Models[] {
    limit = this._globals.items_per_page || limit;
    var dataLen = dataModel.length;
    var newData = dataModel;

    if (dataLen > limit) {
      var reduceBy = dataLen - limit;
      newData = _.dropRight(dataModel, reduceBy);
      console.log('-- modelData reduced by: ', reduceBy);
    }

    return newData;
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

  private generateHeaderOptions(header_val: any): RequestOptions {
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

};

