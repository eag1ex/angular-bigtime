declare var APP_URL:any;

import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch'; //
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { LocalStorageService } from './local-storage.service';

@Injectable({
    providedIn: 'root'
})
export class ServerAuthentication {

    constructor(private http: Http, private storage:LocalStorageService) {
        // check APP_URL
        if(APP_URL.indexOf('<%=APP_URL%>')!==-1){
            APP_URL = false;
        }
       
    }
    
    logout() {
        if(!APP_URL) return false as any;
        var url = APP_URL +'/signout';
        return this.httpRequest(url);
    }

    checkSession() {
        if(!APP_URL) return false as any;
        var url  = APP_URL+'/checkSession';
        return this.httpRequest(url)
    }

    private httpRequest(url:any=false): Observable<any[]> {
       // this.storage.getItem('auth-token');
      //  var headers = new Headers();
     //   headers.append('Authorization', token);
  //      headers.append('Content-Type', 'application/json');
   //     var options = new RequestOptions({ headers: headers });

        return this.http.get(url)
            .map((response: any) => {

                return response.json() as any;
            })
            .do((dat) => {
                return dat;
            })
            .catch((error: any) => {
              //  console.error('ServerAuthentication ',error)
                return Observable.throw(error || 'Upps error getting data, api or localstorage!');
            });
    }
}
