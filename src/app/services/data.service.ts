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
  private apiURL = 'https://api.punkapi.com/v2/beers?';
  public beersData: Array<any>;
  constructor(
    private http: Http,
    private logger:LoggerService
  ) { }

  getBeers(params:any=''): Observable<BeersModel[]> {
    if (_.isEmpty(params)) {
      // return Observable.throw('no params for getBeers provided!');
    }
    params={
      q:''
    }
    params.q = `${this.apiURL}page=1&per_page=10`;

    return this.http.get(params.q)
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


/**
 import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';  // <-- import Http & Headers

import { Customer }      from './model';
import { LoggerService } from './logger.service';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch'; // <-- add rxjs operator extensions used here
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/toPromise';

import 'rxjs/add/observable/throw'; // <-- add rxjs Observable extensions used here
 */