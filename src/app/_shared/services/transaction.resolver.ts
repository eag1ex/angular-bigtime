import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import { MyGlobals } from '../myglobals';

@Injectable()
export class TransactionResolver implements Resolve<any> {
  constructor(
    private _globals: MyGlobals
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {

    var res, final;
    var _match = route.params.id.replace(/\_(?=[^_]*\_)/g," ").toLowerCase();
    console.log('what is the match now ha',_match)

    var data = this._globals.glob.beers || null;
    //console.log('TransactionResolver what are the beers?? ',data)
    if (data) {

      // to fixc the problem lets find out if we can send other params instead o the name alone
      // todo/ route doesnt alwasy want to mach due to complicated titles
      final = data.reduce((output, item, inx) => {
        if (item.name.toLowerCase().indexOf(_match) !== -1) {

          output.push(item);
        }else{

        }
        return output;
      }, []);

    } else {
      final = false;
    }
    console.log('TransactionResolver what are the beers of final?? ',final)

    res = this._globals.getData(final);
    return res

  }

}