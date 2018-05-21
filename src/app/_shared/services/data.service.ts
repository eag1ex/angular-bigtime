import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
//

//import { Observable} from 'rxjs';

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


@Injectable({
providedIn: 'root'
})
export class DataService {
  private apiURL = 'https://api.punkapi.com/v2/beers';
  public beersData: Array<any>;
  constructor(
    private http: Http,
    private logger:LoggerService
  ) { }

  routeParamsReturn(obj):string{
    var results:string;
    if(_.isEmpty(obj)) return '';
    
     console.log('what is Object',obj)
      
    var _switch= (item, _obj):object=> {
      var output: any={}
      switch (item as string) {
        case 'parent_page':
          output.good=`${this.apiURL}?page=1&per_page=${_obj.perPage}`;
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
          this.logger.log('checkRouteParams did not match returning defaults', true);
          output.default = `${this.apiURL}?page=1&per_page=${_obj.perPage}`;     
      }

       return output;
    } 
    
    var not_found_default:string;
    var objKeys = Object.keys(obj)
    for (var i=0; i<objKeys.length;i++){
      var item = objKeys[i];
      console.log('what is the key for switch',item)
        if(item){
          var s:any= _switch(item, obj);
            console.log('what is the switch',s)
             if(s.default){
                console.log('what is default',s.default)
                not_found_default = s.default;
                continue;
             }
            if(s.good){
              console.log('what is good',s.good)
              results = s.good;
              break;
            }
            
        }
    } 

      return results||not_found_default;    
  }
  getBeers(params:object): Observable<BeersModel[]> {

  
    var _paramsReturn = this.routeParamsReturn(params);
    console.log('what is params',params)

    return this.http.get(_paramsReturn)
      .map((response) =>{
        this.logger.log('got getBeers respons')
        return response.json() as BeersModel[]
      }) 
      .do((beers) => {
        return beers;
      })
      .catch((error: any) => {
        this.logger.log(error,true)
        return Observable.throw('Something bad happened with customers; please check the console');
      });

  }
}

