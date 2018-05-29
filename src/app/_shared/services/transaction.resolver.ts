import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import { MyGlobals } from '../myglobals';
import { DataService } from './data.service';
import { GlobalReuse } from '../global.reuse';

@Injectable()
export class TransactionResolver implements Resolve<any> {
  constructor(
    private _globals: MyGlobals,
    private dService: DataService
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {

    var res, final;

    /// this will not work if reloading the page, because the value will be set to preset value for what we are looking for
    var apiNam= this._globals.glob.selected_apiName;
    var apiByhref= new GlobalReuse().findApiNameFromUrl(this._globals.api_support);

    var apiName = apiNam || apiByhref;

    /**
     * check for localstorage data
     */
    var _id = route.params.id;
    var has_localStorage = this.checkForLocalStorageFirst(apiName,_id);

    if (has_localStorage !== false) {
      return has_localStorage;
    }
     // else continue with the request from fresh response!

    var selected_api_object = this._globals.glob[apiName+'.data']; 
    var _match = this._globals.stripSpecialChar(_id);   
    var data = selected_api_object || null;

    if (data) {
    //  console.log('what is the match',_match)
      final = this.singleItem(data, _match);

    } else {
      final = false;
    }
    // the data is retreived from local variable NOT REST!
    res = this._globals.getData(final, { byName: _id });
    return res

  }

  // we can retrieve
  /**
   * {apiName}:item:name:byName
   * {apiName}:item:name:search_by_name
   */
  checkForLocalStorageFirst(apiName,str: string) {
    return this.dService.checkLocalstorage(apiName,{ search_by_name: str, byName: str });
  }


  /**
   * get single item from that batch
   * @param data 
   * @param _match 
   */
  singleItem(data, _match): Array<any> {
    var output = data.reduce((output, item, inx) => {
      var limit_desc = this._globals.descLimit(item.name||item.title||item.artist|| item.ownername,60);  // has to be the same setting
    
      var itm = this._globals.stripSpecialChar(limit_desc);
      if (itm.indexOf(_match) !== -1) {
          console.log('what is limit_desc',limit_desc)
       console.log('what is _match',_match)
        output.push(item);
      }
      return output;
    }, []);

    return (output.length > 0) ? output : false;
  }


}