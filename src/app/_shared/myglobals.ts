import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Observable';
import { BeersModel } from './services/models';
import { LoggerService } from './services/logger.service';
import {Router } from '@angular/router';

import { DataService } from './services/data.service';
import 'rxjs/add/operator/catch'; //
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class MyGlobals {
    
    /**
     * collecting data
     */
    glob = {
        searchSubscription: null,
        beers: null,
        APP_LOADED:false,
        current_page:'',
    };

    
    constructor(private logger: LoggerService,
            private _router: Router,
            private dataService:DataService) {
                 
    }

    /**
     *  Mocked up an observable data return
     *  Currently used together with TransactionResolver class to resolve data going to product/:id
     * 
     * @param data 
     * @param params 
     */
    getData(data: any = false, params:any=false): Observable<BeersModel[]> {


        var _data = data || this.glob.beers;
        if (!_data || data.length<1) {
            this._router.navigate(['/products']);
           // this.logger.log('Something bad happened glob.beers, its null',true)
            return Observable.of('Something bad happened glob.beers, its null') as any;
        }

        return Observable.of(data)
            .map((response) => {
                //this.logger.log(`received local data beers in globals`);
                return response as BeersModel[]
            })
            .do((d) => {

                if(params){
                    this.dataService.setLocalStorage(params,data); // magic happens!
                }
               
                return d;
            })
            .catch((error: any) => {
                this._router.navigate(['/products']);
                return Observable.throw('Something bad happened glob.beers; please check the console');
            });

    }


    nicename(str):string{
        if(!str) return '';
        var nice = str.replace(/ /g, "_");
        return (str) ? nice : '';
    }
    
    /**
     *  to use for matching data batch with single item
     * @param str 
     */
    stripSpecialChar(str):string{
        if(!str) return '';
       var clean= str.replace(/ /g, "")
                .replace(/[^\w\s\_]/gi, '')
                .replace(/\_(?=[^_]*\_)/g,"")
                .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '')
                .toLowerCase();

        return clean||'';
    }

}