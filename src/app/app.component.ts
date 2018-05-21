import { Component } from '@angular/core';
import { Globals } from './_shared/Globals';
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
  constructor(private globals: Globals, private emmiter: EventEmitService,private _router: Router, private logger:LoggerService) {

      _router.events.subscribe((val) => {
        
        /// unsubscripte if not on products
        if (val.url) {
          console.log('what is val.url',val.url)
          console.log('what is globals.glob.searchSubscription',globals.glob.searchSubscription)
          if (val.url.indexOf('products') == -1) {
            if (globals.glob.searchSubscription !== null) {
              globals.glob.searchSubscription.unsubscribe();
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


