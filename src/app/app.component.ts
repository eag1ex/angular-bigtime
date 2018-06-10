


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
  public displaySearchInput = false;
  private removeOldClass:string;
  public currentPageName:string;
  public app_dynamic_title:string;
  public APP_LOADED = false;
  private subscription;
  public sessionExpired:boolean = false;

  public onAnyEventToComponent;
  constructor(private _globals: MyGlobals, private emmiter: EventEmitService, 
    private _router: Router, private logger: LoggerService,
    private renderer: Renderer, private element: ElementRef, 
    private servAuthentication:ServerAuthentication
  ) {


    this.onAnyEventToComponent = emmiter.subscribe(msg => {
      /// just in case app.component swollowed the event first we bubble it down to directive
     
       if(msg.eventType=='BackToDirective'){
         return;
       }

      if (msg.bgChange) {
        this.setBackgroundClass(msg.apiName);
      }

      if(msg.isProductPageName){

       this.displaySearchInput = false;
       this.currentPageName =msg.isProductPageName;
       _globals.glob.current_page = this.currentPageName;

      }

      if(msg.isProductPageName=='products'){
          this.displaySearchInput = true;
      }

      if(msg.updateTitle){
         this.app_dynamic_title =msg.updateTitle;
      }
    }, (err) => {
         this.logger.log(`what is the err ${err}`,true); 
    }, (complete) => {
     // console.log('what is the complete', complete)
    },_globals);

     this._globals.glob.onAnyEventToComponent =  this.onAnyEventToComponent;
    
  
    _router.events.subscribe((val: any) => {

       setTimeout(() => {
          window.scrollTo(0, 0);
        }, 500)

      /// page ready last event
      if (val.constructor.name === 'NavigationStart') {
        // set current page name value
         //console.log('--- what is the current page name ',this.currentPageName)
      }

      if (val.constructor.name === 'NavigationEnd') {

        

        // this dont always work in production for some reason
        if(val.urlAfterRedirects.indexOf('products')!==-1){
        
          this.currentPageName ='products';
          _globals.glob.current_page = this.currentPageName;
           this.displaySearchInput = true;

        }

       // this.currentPageName =_globals.glob.current_page;
        this.setBackgroundClass(_globals.glob.selected_apiName); // double check

        // check session
        this.checkSession();
      }

      if (val.urlAfterRedirects !== undefined) {
        if (val.urlAfterRedirects.indexOf('product-item') !== -1) {
          this.currentPageName = 'single-product';
          _globals.glob.current_page = this.currentPageName;
          this.displaySearchInput = false;
        }

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
    var chekSession =this.servAuthentication.checkSession();
    if(!chekSession) return ;

    chekSession.subscribe((data)=>{
       // console.log(data);
        this.sessionExpired = false;
    },(err)=>{
      console.error(err);
      this.sessionExpired = true;
    })
  }

  loggout(){
    var logout = this.servAuthentication.logout();
    if(!logout) return ;
    logout.subscribe((data)=>{
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
      let doc = document;
      let body = doc.getElementsByTagName('body')[0];
      // remove from loading to loaded
      body.classList.remove("angular-loading");  
      body.classList.remove("angular-loaded");
      body.classList.add("angular-loaded");

    setTimeout(()=>{
      var preloader = doc.getElementById('angular-pre-wrap');
        preloader.classList.remove('displayNone');
        preloader.classList.add('displayNone');  
    },300) 

    // footer 
    var footer = doc.getElementsByTagName('footer')[0];
    footer.classList.add("show");
    this.logger.log('angular loaded');

   setTimeout(()=>{
      this.displaySearchInput = true;
    },2000)

 }
 

  /// broadcast this message to product component
  onSearch(data) {
    data.eventType = 'onSearch';
    this.emmiter.next(data, false);
  }
  
  ngOnInit() {
    this.emmiter.next({apiName:this._globals.glob.selected_apiName, from:"appComponent"}, false);
    this.setBackgroundClass();
    this.angularOnLoaded();
   
  }
 
  ngAfterViewInit() {
  }


}


