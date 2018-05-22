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
import { BeersModel } from './models';
import { LoggerService } from './logger.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiURL = 'https://api.punkapi.com/v2/beers';
  public beersData: Array<any>;
  constructor(
    private http: Http,
    private logger: LoggerService,
    private lStorage: LocalStorageService
  ) { }

  /**
   * used to manage what url should be returned to rest service based on the obj/params
   * obj:
   *    parent_page:
   *    paged
   *    search_by_name
   *    byName 
   */
  routeParamsReturn(obj): string {
    var results: string;
    if (_.isEmpty(obj)) return '';


    var _switch = (item, _obj): object => {
      var output: any = {}
      switch (item as string) {
        case 'parent_page':
          output.good = `${this.apiURL}?page=1&per_page=${_obj.perPage}`;
          break;
        case 'paged':
          output.good = `${this.apiURL}?page=${_obj.paged}&per_page=${_obj.perPage}`;
          break;

        case 'search_by_name':
          output.good = `${this.apiURL}?beer_name=${_obj.search_by_name}&per_page=${_obj.perPage}`;
          break;

        case 'byName':
          output.good = `${this.apiURL}?beer_name=${_obj.byName}`;
          break;
        default:

          output.default = `${this.apiURL}?page=1&per_page=${_obj.perPage}`;
      }

      return output;
    }



    var not_found_default: string;
    var objKeys = Object.keys(obj) //  convers object keys to array
    // run switch per each key in the objKey to find any match 
    for (var i = 0; i < objKeys.length; i++) {
      var item = objKeys[i];

      if (item) {
        var s: any = _switch(item, obj);

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
      this.logger.log('checkRouteParams did not match returning defaults', true);
    }

    return results || not_found_default;
  }


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
    if (params.search_by_name) {
      setStorage = this.lStorage.setItem(`beers:item:name:${params.search_by_name}`, data);
    }
    // beers:item:name:byName
    if (params.byName) {
      setStorage = this.lStorage.setItem(`beers:item:name:${params.byName}`, data);
    }
    return setStorage;
  }




  getBeers(params: object): Observable<BeersModel[]> {

    // remove all storage / for testing
    //this.lStorage.removeAll()

    var checkLocalstorage = this.checkLocalstorage(params);
    if (checkLocalstorage !== false) {
      this.logger.log('getting beers from localstorage!!')
      return checkLocalstorage;
    }
    var _paramsReturn = this.routeParamsReturn(params);

    return this.http.get(_paramsReturn)
      .map((response: any) => {
        // check for empty respons
        var checker = response.json();
        if (checker.length === 0 || !checker) {
          throw ('no results returned!') as any;
        }

        // this.logger.log('got getBeers respons')
        return response.json() as BeersModel[]
      })
      .do((beers) => {

        this.setLocalStorage(params, beers); // magic happens!
        return beers;
      })
      .catch((error: any) => {
        this.logger.log(error,true)
        return Observable.throw('Upps error getting data, api or localstorage!');
      });

  }
}

