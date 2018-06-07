
// avoide any console errors
declare var jquery:any;
declare var $ :any; 

import { Component, Input, Output, OnInit, EventEmitter,Renderer,ElementRef  } from '@angular/core';
import { MyGlobals } from './_shared/myglobals';
import { GlobalReuse } from './_shared/global.reuse';
import { EventEmitService } from './_shared/services/eventEmmiter.service';

import { ActivatedRoute, Router } from '@angular/router';
import { LoggerService } from './_shared/services/logger.service';
import { fadeInAnimation } from './_shared/animations';

import {ServerAuthentication} from './_shared/services/server.authentication';

@Component({
  selector: 'app-root', 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [fadeInAnimation],
 
    // attach the fade in animation to the host (root) element of this component
    host: { '[@fadeInAnimation]': '' }

})
export class AppComponent implements OnInit{
  appName = {
    a: '[ Picky ]',
    b: ''
  };

  private removeOldClass:string;
  public currentPageName:string;
  public app_dynamic_title:string;
  public APP_LOADED = false;
  private subscription;
  public sessionExpired:boolean = false;
  public displaySearchInput=false;
  public onAnyEventToComponent;
  constructor(private _globals: MyGlobals, private emmiter: EventEmitService, 
    private _router: Router, private logger: LoggerService,
    private renderer: Renderer, private element: ElementRef,
    private servAuthentication:ServerAuthentication
  ) {


    this.onAnyEventToComponent = emmiter.subscribe(msg => {
      if (msg.bgChange) {
        this.setBackgroundClass(msg.apiName);
      } 
      if(msg.updateTitle){
         this.app_dynamic_title =msg.updateTitle;
      }
    }, (err) => {
         this.logger.log(`what is the err ${err}`,true); 
    }, (complete) => {
     // console.log('what is the complete', complete)
    });  


   
    _router.events.subscribe((val: any) => {
      this.currentPageName=null
      
      /// unsubscripte if not on products to avoid memory leaks!
      if (val.url) {
        if (val.url.indexOf('products') == -1) {
          if (_globals.glob.searchSubscription !== null) {
            _globals.glob.searchSubscription.unsubscribe();
            logger.log(`unsubscribed form searchSubscription`)
          }
        }

      }

      /// page ready last event
      if (val.constructor.name === 'NavigationStart') {

        setTimeout(() => {
          $(window).scrollTop(0);
        }, 500)

        // set current page name value
       

         //console.log('--- what is the current page name ',this.currentPageName)
      }

      if (val.constructor.name === 'NavigationEnd') {
        this.currentPageName =_globals.glob.current_page;
        this.setBackgroundClass(_globals.glob.selected_apiName); // double check

        // check session
        this.checkSession();
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

  checkSession(){

    this.servAuthentication.checkSession().subscribe((data)=>{
       // console.log(data);
        this.sessionExpired = false;
    },(err)=>{
      console.error(err);
      this.sessionExpired = true;
    })
  }

  loggout(){
    this.servAuthentication.logout().subscribe((data)=>{
     // console.log(data);
    },(err)=>{
       console.error(err);
    })
  }

  setBackgroundClass(className: any = false) {
    //console.log('what is his.element.nativeElement',this.element.nativeElement)
    if(this.removeOldClass){
      this.element.nativeElement.classList.remove(this.removeOldClass);
    }
   
    var bgName = new GlobalReuse().findApiNameFromUrl(this._globals.api_support);
    bgName = (className || bgName || this._globals.glob.selected_apiName) + 'BG';

    this.removeOldClass = bgName;  
    this.element.nativeElement.classList.add( bgName );
   
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
    data.eventType = 'onSearch';
    this.emmiter.next(data);
  }
  
  ngOnInit() {
     this.setBackgroundClass();
    this.angularOnLoaded();
   
  }
 
  ngAfterViewInit() {
  }


}


