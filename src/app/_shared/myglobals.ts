import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Observable';
import { BeersModel, FlickrPhotoModel, Models } from './services/models';
import { LoggerService } from './services/logger.service';
import { Router } from '@angular/router';

import { DataService } from './services/data.service';
import 'rxjs/add/operator/catch'; //
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/toPromise';
import { ApiList } from '../api-list';

/// interface 
import { IMyGlobals } from './interfaces';

/**
 * storte variable data across the whole app, cannot use within nested components of services, or you will receive compiler "WARNING in Circular dependency detected"
 * My globals is imported to transaction.resolver >a very important module to pass data to next component
 */



@Injectable()
export class MyGlobals implements IMyGlobals {

    /**
     * collecting data
     */
    glob = {
        items_per_page: 10,
        searchSubscription: null,

        /// stored data before LocalStorage
        'punkapi.data': null,
        'flickr.data': null,
        'gettyimages.data': null,

        APP_LOADED: false,
        current_page: '',
        selected_apiName: 'punkapi'// preset dynamicly changed
    };
    payload: object = {};
    api_random_search_val: any = '';

    api_support: Array<any> = new ApiList().list().reduce((outp, val, inx) => {
        if (val.name && val.enabled) outp.push(val.name);
        return outp;
    }, []);

    constructor(private logger: LoggerService,
        private _router: Router,
        private dataService: DataService) {
        console.log('-- api_support for', this.api_support.toString());
    }

    /**
     *  Mocked up an observable data return
     *  Currently used together with TransactionResolver class to resolve data going to product/:id
     *  the data is retreived from local variable NOT REST!
     * 
     * @param data 
     * @param params 
     */
    getData(data: any = false, params: any = false): Observable<Models[]> {


        var _data = data || this.glob[this.glob.selected_apiName + '.data'];
        if (!_data || data.length < 1) {
            this._router.navigate(['/products']);
            // this.logger.log('Something bad _data is null',true)
            return Observable.of('Something bad happened glob.beers, its null') as any;
        }

        return Observable.of(data)
            .map((response) => {
                //this.logger.log(`received local data beers in globals`);
                return response as Models[];
            })
            .do((d) => {

                if (params) {
                    // magic happens!
                    this.dataService.setLocalStorage(this.glob.selected_apiName, params, data, true);
                }
                return d;
            })
            .catch((error: any) => {
                this._router.navigate(['/products']);
                return Observable.throw('Something bad happened glob.beers; please check the console');
            });

    }

    descLimit(str, limit = 150) {
        return (str) ? str.substring(0, limit) : '';
    }

    /// to moveto new global exportable
    nicename(str): string {
        if (!str) return '';
        var nice = str.replace(/ /g, "_");
        return (str) ? nice : '';
    }

    /**
     *  to use for matching data batch with single item
     * @param str 
     */
    /// to moveto new global exportable 
    stripSpecialChar(str): string {
        if (!str) return '';
        var clean = str.replace(/ /g, "")
            .replace(/[^\w\s\_]/gi, '')
            .replace(/\_(?=[^_]*\_)/g, "")
            .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '')
            .toLowerCase();

        return clean || '';
    }

    getKeywords(itemObj) {
        var d = itemObj.reduce((outp, item, inx) => {
            if (item.text) {
                outp.push(item.text);
            }
            return outp;
        }, []) || '';

        return (d) ? d.toString() : '';
    }

};

