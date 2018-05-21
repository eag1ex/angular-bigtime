import { Component } from '@angular/core';
import { MyGlobals } from './_shared/myglobals';
import { EventEmitService } from './_shared/services/eventEmmiter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoggerService } from './_shared/services/logger.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],


})
export class AppComponent {
  appName = {
    a: '[ BigTime ]',
    b: 'App'
  };
  
  private subscription;
  constructor(private _globals: MyGlobals, private emmiter: EventEmitService,private _router: Router, private logger:LoggerService) {

      _router.events.subscribe((val:any) => {
        
        /// unsubscripte if not on products to avoid memory leaks!
        if (val.url) {
          console.log('what is val.url',val.url)
          console.log('what is globals.glob.searchSubscription',_globals.glob.searchSubscription)
          if (val.url.indexOf('products') == -1) {
            if (_globals.glob.searchSubscription !== null) {
             // _globals.glob.searchSubscription.unsubscribe();
              logger.log(`unsubscribeed form searchSubscription`)
            }
          }

        }
        // val.constructor.name / val.url
        //  NavigationStart
        // RoutesRecognized
        // GuardsCheckStart
        // ChildActivationStart
        // ActivationStart
        // GuardsCheckEnd
        // ResolveStart
        // ActivationEnd
        // ChildActivationEnd
        // NavigationEnd
     
       // console.log('what is the event', val) 
    });
  }

  /// broadcast this message to product component
    onSearch(data){
          this.emmiter.next(data);
    }


}


