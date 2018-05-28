import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch'; //
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/toPromise';

import { BeersModel } from './models';
import { LoggerService } from './logger.service';


/**
 * local storage 
 *  todo: not yet implemented storage expiry
 */



/**
 *  LocalStorageService ids:
 * 
    beers:paged:1 
    beers:item:name:example_name 
 */


@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor(private logger: LoggerService) {

      this.removeAll() 

   }
 
  get localStorage() {
    return window.localStorage;
  }

  setItem(id: string, data: BeersModel[]) {
    var data_set = false;
    if (id && data.length > 0) {
      this.localStorage.setItem(id, JSON.stringify(data));
      data_set = true;
      this.logger.log(`local data saved for ${id}`)
    } else {
      data_set = false;
      this.logger.log('local data not saved, you are missing id/data ?', true)
    }
    return data_set;
  } 

  getItem(id): any{
    if(!id) return false
    var item_str = this.localStorage.getItem(id);
    var item = JSON.parse(item_str)

    if (!item) return false;

    return Observable.of(item)
      .map((response) => {
         this.logger.log(`received localstorage data for ${id}`)
        return response as BeersModel[]
      })
      .do((d) => {
        return d;
      })
      .catch((error: any) => {
        return Observable.throw('Something bad happened localstorage getItem;');
      });

  }

  removeItem(id) {
    var item_removed = false;
    this.localStorage.removeItem(id);
    if (!this.localStorage.getItem(id)) {
      item_removed = true;
      this.logger.log(`localstorage removed for ${id}`);
    } else {
      item_removed = false;
    }
    return item_removed;
  }
  removeAll() {
    this.localStorage.clear();
    this.logger.log(`cleared all localstorage!`);
  }
}
