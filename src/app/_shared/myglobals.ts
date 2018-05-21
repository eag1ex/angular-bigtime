import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Observable';
import { BeersModel } from './services/models';
import { LoggerService } from './services/logger.service';
import { ActivatedRoute, Router } from '@angular/router';

import 'rxjs/add/operator/catch'; //
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class MyGlobals {

    glob = {
        searchSubscription: null,
        beers: null
    };

    constructor(private logger: LoggerService,
            private _router: Router) {

    }

    getData(data: any = false): Observable<BeersModel[]> {


        var _data = data || this.glob.beers;
        if (!_data || data.length<1) {
            this._router.navigate(['/products']);
            this.logger.log('Something bad happened glob.beers, its null',true)
            return Observable.of('Something bad happened glob.beers, its null') as any;
        }

        return Observable.of(data)
            .map((response) => {
                //this.logger.log(`received local data beers in globals`);
                console.log('received local data beers in globals', response)
                return response as BeersModel[]
            })
            .do((d) => {
                return d;
            })
            .catch((error: any) => {
                //this.logger.log(error, true);
                console.log('what is the error', error)
                return Observable.throw('Something bad happened glob.beers; please check the console');
            });

    }

}