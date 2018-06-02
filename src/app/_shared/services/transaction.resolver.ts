import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router'; 
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import { MyGlobals } from '../myglobals';
import { DataService } from './data.service';
import { GlobalReuse } from '../global.reuse';

/**
 * this is the data transition layer module/resolver, 
 * it returns the already available request into our next component, so we do not request it again
 * It checks for data available directly from request via MyGlobals, or from local storage 
 * it grabs the route.params.id and match > to find indexOf  [apiName+'.data']
 */


@Injectable()
export class TransactionResolver implements Resolve<any> {
  constructor(
    private _globals: MyGlobals,
    private dService: DataService, 
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {

    var res, final;
    var _id = route.params.id;
    var imdbID_id = route.params.imdbID;
 
    /// this will not work if reloading the page, because the value will be set to preset value for what we are looking for
    var apiNam= this._globals.glob.selected_apiName; 
    var  GReuse = new GlobalReuse();
    var apiByhref= GReuse.findApiNameFromUrl(this._globals.api_support); 

    var apiName = apiByhref||apiNam; // in this order
    var has_imdbID =(imdbID_id)? imdbID_id:false;//GReuse.findInUrl('imdbID') as any;

    if(has_imdbID){
      apiName = 'omdbapi';//'imdbID' //  //${val.name}-imdbID << set in product.module routes
    }  
 
   console.log('route.params.id',has_imdbID)

    /**
     * check for localstorage data
     */
    
    var has_localStorage = this.checkForLocalStorageFirst(apiName,_id,has_imdbID);
    if (has_localStorage !== false) {
      return has_localStorage;
    }
     // else continue with the request from fresh response!

    var selected_api_object = this._globals.glob[apiName+'.data']; 
    var _match = this._globals.stripSpecialChar(_id);   
    var data = selected_api_object || null;

    if (data)  final = this.singleItem(data, _match,has_imdbID);
    else  final = false;

    // the data is retreived from local variable NOT REST!
    res = this._globals.getData(final, { byName: _id,imdbID:has_imdbID });
    return res

  }

  // we can retrieve
  /**
   * 
   * {apiName}:name:byName
   * {apiName}:name:search_by_name
   * {apiName}-imdbID:tt0371746
   */
  checkForLocalStorageFirst(apiName,str: string,has_imdbID:boolean=false) {
    var q = { search_by_name: str, byName: str } as any;
    if(has_imdbID) q.imdbID=has_imdbID
    return this.dService.checkLocalstorage(apiName,q ,true);
  }


  /**
   * get single item from that batch
   * @param data 
   * @param _match 
   */
  singleItem(data, _match,has_imdbID=false): Array<any> {
    var output = data.reduce((output, item, inx) => {
      // because each api has diff keys
      var avail_title = item.name||item.title||item.artist|| item.Title || item.ownername;
      var limit_desc = this._globals.descLimit(avail_title,60);  // has to be the same setting  
      
      if(has_imdbID) {
        avail_title = item.imdbID; //only if on imdbID page
        limit_desc = this._globals.descLimit(avail_title,200);  // has to be the same setting
      }
          
      var itm = this._globals.stripSpecialChar(limit_desc);
      if (itm.indexOf(_match) !== -1) output.push(item);

      return output;
    }, []);

    return (output.length > 0) ? output : false;
  }


}