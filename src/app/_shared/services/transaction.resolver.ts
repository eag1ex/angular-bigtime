import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import { MyGlobals } from '../myglobals';
import { DataService } from './data.service';
@Injectable()
export class TransactionResolver implements Resolve<any> {
  constructor(
    private _globals: MyGlobals,
     private dService:DataService 
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {

    var res, final;

    var _id = route.params.id;
    var has_localStorage = this.checkForLocalStorageFirst(_id);
    console.log('buzz has local storage??',has_localStorage)
    if(has_localStorage!==false){
      return has_localStorage;
    }

    // else continue with the request!

    var _match = this._globals.stripSpecialChar(_id);
    var data = this._globals.glob.beers || null;

    if (data) {

      final=this.singleItem(data,_match);
      
    } else {
      final = false;
    }

    res = this._globals.getData(final,{byName:_id});
    return res

  }

  // we can retrieve
  /**
   * beers:item:name:byName
   * beers:item:name:search_by_name
   */
  checkForLocalStorageFirst(str:string){
    return this.dService.checkLocalstorage({search_by_name:str,byName:str});
  }


  singleItem(data, _match):Array<any>{
      var output = data.reduce((output, item, inx) => {
        var itm = this._globals.stripSpecialChar(item.name);
        if (itm.indexOf(_match) !== -1) {
          output.push(item);
        }
        return output;
      }, []);
      return (output.length>0)? output:false;
  }

}