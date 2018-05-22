
// avoide any console errors
declare var jquery:any;
declare var $ :any;

import { Component, Input, Output, OnInit, EventEmitter  } from '@angular/core';
import { MyGlobals } from './_shared/myglobals';
import { EventEmitService } from './_shared/services/eventEmmiter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoggerService } from './_shared/services/logger.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],


})
export class AppComponent implements OnInit{
  appName = {
    a: '[ BigTime ]',
    b: 'App'
  };
  public currentPageName:string;
  public APP_LOADED = false;
  private subscription;
  public displaySearchInput=false;

  constructor(private _globals: MyGlobals, private emmiter: EventEmitService, 
    private _router: Router, private logger: LoggerService) {

   
    _router.events.subscribe((val: any) => {
      this.currentPageName=null
      
      /// unsubscripte if not on products to avoid memory leaks!
      if (val.url) {
        if (val.url.indexOf('products') == -1) {
          if (_globals.glob.searchSubscription !== null) {
            _globals.glob.searchSubscription.unsubscribe();
            logger.log(`unsubscribeed form searchSubscription`)
          }
        }

      }

      /// page ready last event
      if (val.constructor.name === 'NavigationEnd') {

        setTimeout(() => {
          $(window).scrollTop(0);
        }, 500)

        // set current page name value
        this.currentPageName =_globals.glob.current_page;

         //console.log('--- what is the current page name ',this.currentPageName)
      }
      // 
      // val.constructor.name / val.url
      // available events
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


  /**
   * manage animation of angular app on initial load!
   */
 angularOnLoaded(){

    this.APP_LOADED=true;
    this._globals.glob.APP_LOADED =this.APP_LOADED;
    $('.angular-preloader-wrap').removeClass('show').addClass('hide',()=>{
      $('#angular-app').removeClass('hide').addClass('show');
    })
    setTimeout(()=>{
      $('.angular-preloader-wrap').addClass('displayNone');
    },300)
    
    // footer
    $('footer').addClass('show');
    this.logger.log('angular loaded');

    setTimeout(()=>{
      this.displaySearchInput = true;
    },2000)

 }
 
  /// broadcast this message to product component
  onSearch(data) {
    this.emmiter.next(data);
  }
  ngOnInit() {
    this.angularOnLoaded();
   
  }
 
   ngAfterViewInit() {
 
  }


}


