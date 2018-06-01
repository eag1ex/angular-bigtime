import { Component, OnInit, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../_shared/services/data.service';
import { LoggerService } from '../_shared/services/logger.service';
import { BeersModel,FlickrPhotoModel,GettyImages,OmdbapiModel } from '../_shared/services/models';
import { MyGlobals } from '../_shared/myglobals';
import { EventEmitService } from '../_shared/services/eventEmmiter.service';
import * as _ from "lodash";
import { slideInOutAnimation,moveIn } from '../_shared/animations';
 
// interfaces
import { IRouteName } from '../_shared/interfaces';


@Component({
  selector: 'products',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
     animations: [slideInOutAnimation,moveIn],
 
    // attach the slide in/out animation to the host (root) element of this component
    host: { '[@slideInOutAnimation]': '' },
    

})
export class ProductComponent implements OnInit {
  state: string = 'large';
  public indexPerRow: number = 0;

  public punkapiData: BeersModel[];
  public flickrData: FlickrPhotoModel[];
  public gettyimagesData: GettyImages[];
  public omdbapiData: OmdbapiModel[];
  public DataLoaded = false;
  public routeName: any;
  public lastSearchBefore:string='';
  public linkLoaded:any=false;
  public exec_search = false;
  private searchSubscription: any;
  private searchModel: string;
  private ErrorData:any = false;
  public available_apis:Array<any>;
  public lastSearch:any=false;
  doingPaged:boolean = false; 
  private searchtext = {
    inx: 0
  }

  // default page settings 
  public PAGE_DEFAULTS = {
    apiName:'punkapi', //flickr
    pageTitle: 'Beers.. Drink! Get drunk!',// 
    pageName:'products',
    per_page: 10,
    paged: 10,
    currentPaged: 1,
    searchAPIcheck: false,
    pageDefault:1
  }


  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private dataService: DataService,
    private logger: LoggerService,
    private _globals: MyGlobals,
    private appEmmiter: EventEmitService

  ) {


    this.PAGE_DEFAULTS.apiName = _globals.glob.selected_apiName;
    this.available_apis = _globals.api_support;
    // set pagename globals
    _globals.glob.current_page = this.PAGE_DEFAULTS.pageName;
    // preset default api name for current component// same for :paged as well
    _globals.glob.selected_apiName = this.PAGE_DEFAULTS.apiName;
  

    /**
     *  this event is received from app.component
     */
    
    this.searchSubscription = appEmmiter.subscribe(msg => {
      if (msg.eventType == 'onSearch') {
        if (_.isObject(msg)) {
          this.PAGE_DEFAULTS.searchAPIcheck = msg.searchAPIcheck;
          this.searchItems(msg.event, msg.searchVal, msg.type, msg.searchAPIcheck);
        }
      }
     

    }, (err) => {
         this.logger.log(`what is the err ${err}`,true); 
    }, (complete) => {
     // console.log('what is the complete', complete)
    });

    
  }

  /**
   * we need this to send data back to directive to reset the field to onpty on loaded data to page
   * @param data 
   */
  onSearchQBackToDirective(data) {
    data.eventType = 'BackToDirective';
    this.appEmmiter.next(data);
  }

  getKeywords(obj){
    return this._globals.getKeywords(obj);
  }  

  /**
   * 
   * search items and negotiate between events 'keydown' and 'focusout'
   * added some user experience logic to delay loading on frequent search event/requests
   * 
   * @param event 
   * @param val 
   * @param type 
   */
  searchItems(event: any = false, val: string, type = '', searchAPI: false) {

    if (this.exec_search === true) {
      console.log('--wait! Still executing')
      return;
    }

    if (!searchAPI) {

      this.searchModel = val; /// search filtering
    }

    var exec = () => {
      return this.whichSearch(type, event, () => {

        var search_v;
       // if(!searchAPI){
           search_v = (val.length > 2) ? { search_by_name: this.niceName(val.toLowerCase()) } : ''; 
      //  }

      //  if(searchAPI){ // specially formater query
       //   search_v = (val.length > 2) ? { search_by_name: encodeURIComponent(val) } : false; 
      //  }
       
        var search_val = search_v as  any;
        if(search_val){
          // to use when hitting this.gotoPaged!
          this.lastSearchBefore = val;
        } 


        if (search_val && searchAPI) {
          search_val.originalName = val;
          search_val.searchAPI = searchAPI;
          this.getMyHttpRequest(search_val,this.PAGE_DEFAULTS.apiName);
          this.logger.log(`searching api results with: ${search_val.search_by_name}`)

        } else if (!search_val) {
          this.logger.log(`you entered no search value, defauling to paged`)
          this.getMyHttpRequest({ paged: this.PAGE_DEFAULTS.currentPaged, originalName:search_val } as any,this.PAGE_DEFAULTS.apiName);
        }

        this.exec_search = true;

      })
    }


    if (type == 'focusout' && val.length > 2) {

      setTimeout(() => {
        exec();   

        this.exec_search = false;

      }, 700);

      // slow down requests to 2 seconds

    }

    if (type == 'keydown') {
      setTimeout(() => {
        exec();
        this.exec_search = false;
      }, 300)
 
    }

  }

get paged_is():any{
  
  return parseInt(this._route.snapshot.paramMap.get('paged')) || false;
}

// request flicker artist link

loadLink(owner){
  this.getFlickerLink({user_id:owner,method:'flickr.urls.getUserPhotos'}as any, this.PAGE_DEFAULTS.apiName);
}


  /**
  * have decided to use 2 events, 
  * keydownand/enter and focusout for ease of use, so we do not have to add the search button
  * 
  * @param event 
  * @param val 
  * @param type 
  */

  whichSearch(type, event, cb) {

    switch (type as string) {
      case 'keydown':

        if (event.keyCode == 13 && this.searchtext.inx < 1) {
          cb();
          setTimeout(() => {
            this.searchtext.inx++;
          }, 500)
        }
        break;

      case 'focusout':

        if (this.searchtext.inx < 1) {
          cb()
          this.searchtext.inx++;
        }
        break;

      // default:
    }

    if (this.searchtext.inx >= 1) {
      this.searchtext.inx = 0;
    }

  }


  goto(nr: any) { 
    
    // preset default api name for current component// same for paged as well
    this._globals.glob.selected_apiName = this.PAGE_DEFAULTS.apiName;

    if (nr === '' || nr === undefined) return;
    if (nr === 0) nr = 1;

      setTimeout(()=>{
         this._router.navigate([`/product/${this.PAGE_DEFAULTS.apiName}` + '/' + nr]);
      },300)
      
  }

  // not using this at moment
  getIndex(i) {
    var perRow = 4;
    this.indexPerRow = i;
    //  console.log('current indexPerRow',this.indexPerRow)

  }

  /**
   * current component logic for route.param values
   * it returns the correct value for the "getMyHttpRequest" api request from ngOnInit() call
   */

  fetchEvent(_paged:any=false): Promise<object> {
    var paged: any = _paged  || this.paged_is|| this.PAGE_DEFAULTS.currentPaged ||this.PAGE_DEFAULTS.pageDefault;
    /// update curent paged for accuricy
  //
    this.PAGE_DEFAULTS.currentPaged = paged;
    // console.log('what is paged', paged)

    paged = (paged) ? { paged } : false;

    /// check against maximum paged allowed
    if (paged) {
      if (paged.paged > this.PAGE_DEFAULTS.paged) {
        paged.paged = this.PAGE_DEFAULTS.paged;
      }
    }

    var singlePage: any = this._route.snapshot.paramMap.get('id');
    singlePage = (singlePage) ? { singlePage } : false;
    var parent_page = { parent_page: true };

    var whichOrder = paged || singlePage || parent_page || false;
    return (whichOrder) ? Promise.resolve(whichOrder) : Promise.reject('param are null!');
  }

  gotoPaged(nr: any) {
    if (nr) {

      (this._globals.payload as any).paged = nr;
      this.routeName = { paged: parseInt(nr) };
      if(this.lastSearch){
        //add last search val to pass to next page
         this.routeName.search_by_name= this.niceName(this.lastSearch.toLowerCase());
      }
      this.PAGE_DEFAULTS.currentPaged = nr;
      this.searchModel ='';
      this.getMyHttpRequest(this.routeName,this.PAGE_DEFAULTS.apiName);
    } else {
      this.getMyHttpRequest(false as any,this.PAGE_DEFAULTS.apiName);
    }
  }

  dofetch(paged:any=false,apiName:any=false) {
    /// get page param  
   
    this.PAGE_DEFAULTS.apiName = apiName || (this._globals.payload as any).apiName || this.PAGE_DEFAULTS.apiName;
    paged = paged || (this._globals.payload as any).paged;

    this.fetchEvent(paged).then((whichOrder: any) => {
      if (whichOrder === false) {
        return Promise.reject('no route found!'); 
      }

      if (whichOrder.paged) {
        this.PAGE_DEFAULTS.currentPaged = whichOrder.paged;
 
      }

      this.routeName = whichOrder;
      //console.log('fetching getMyHttpRequest for apiname ',this.PAGE_DEFAULTS.apiName)
      this.getMyHttpRequest(this.routeName, this.PAGE_DEFAULTS.apiName);

    }, (err) => {
      this.logger.log(err, true)
      this.routeName = false;
      this.getMyHttpRequest(this.routeName, this.PAGE_DEFAULTS.apiName);
    }) 


    this.updateTitle();
    this._globals.glob.searchSubscription= this.searchSubscription;
    this.dataService._globs=this._globals;

    setTimeout(()=>{
      this.appEmmiter.next({bgChange:true, apiName:this.PAGE_DEFAULTS.apiName});
    },100)

  }

  updateTitle(){
    this.PAGE_DEFAULTS.pageTitle =  this.PAGE_DEFAULTS.apiName +' API'  + " | "+  this.PAGE_DEFAULTS.pageName;
    setTimeout(()=>{
      this.appEmmiter.next({updateTitle:this.PAGE_DEFAULTS.pageTitle, apiName:this.PAGE_DEFAULTS.apiName});  
    },100)
    
  }
 
  starOver(startOver=true){
    this.filterTag(this.PAGE_DEFAULTS.apiName, 1);
  }
   


  ngOnInit() {

      this.dofetch();
     // console.log(' doing oninit and fetch')
  }  
   






  filterTag(apiName, paged:number=1){

    if(!apiName) return false;
   // console.log('filterTag what is the apiName',apiName);
    
    this.searchModel ='';

    this.PAGE_DEFAULTS.apiName =apiName;  

    console.log('-- filterTag to fetch for apiName: ',apiName)
    this.lastSearchBefore='';
    /// can call fetch because it will not call oninit, where fetch is also called, no double events
    if(this.paged_is){
      this.dofetch(paged,apiName);
    }else{
      /// not on paged so send payload for oninit
      (this._globals.payload as any).apiName = apiName;
      (this._globals.payload as any).paged = paged;
    }
    // payload
    
    
    this.updateTitle();
    this.searchModel ='';

    
  }

  mCommas(str){
    return str.replace(/ /g, ", ");
  }
 
  niceName(str) {
    var limit_desc = this._globals.descLimit(str,60);  
    var nice = this._globals.nicename(limit_desc);
    return (str) ? nice : '';
  }

  updateIndex(inx) {
    //console.log('what is the uipdated index ', inx)
  }

  niceDate(str){
    var d = new Date(str);
    return d.toString();
  }

  descLimit(str,limit=150,ending='...') {
    return (str) ? str.substring(0, limit)+ending : '';
  }


/**
 * 
 * this.lastSearchBefore; vs this.lastSearch
 * 
 * lastSearch: updates per each call to getMyHttpRequest
 * lastSearchBefore: remembers the search toke place before last :) 
 * 
 * @param routeName 
 * @param apiName 
 * @param cbOnDone  // no used
 */

  getMyHttpRequest(routeName:IRouteName, apiName:string, cbOnDone:any=false) {

    if(routeName.searchAPI){
        this.onSearchQBackToDirective({loading:true}) // tells the search directive to display loading icon, cool!!
    
    }
  
    this.ErrorData = false;
    this.DataLoaded = false;
    this.lastSearch=false;
    console.log('Getting new data ...');

    routeName.per_page = this.PAGE_DEFAULTS.per_page as any;

     if(!routeName) {
      this.logger.log('no singlePage or paged params defind', true)
      this.DataLoaded = null;
      return false
    }

    this.dataService.getHttpRequest(routeName,apiName).subscribe( 
      data => {
     //  console.log('what is the fucking data',data)
        this.DataLoaded = true;
        this[`${apiName}Data`] = data;
       // console.log(`what is ${apiName} data`,this[apiName+'Data']); 

        this._globals.glob[`${apiName}.data`] = data;
        this.searchModel ='';
        this.lastSearch = routeName.originalName || this.lastSearchBefore || this._globals.api_random_search_val;
        this.onSearchQBackToDirective({reset:true}) 

        if(typeof cbOnDone=='function'){
          cbOnDone();
        } 
        
      },
      (errorMsg: any) => {
        this.DataLoaded = null;
        this._globals.glob[`${apiName}.data`] = this.DataLoaded;

        if(typeof errorMsg!=='string'){
          (errorMsg as any).badSearch = routeName.originalName;
          this.lastSearch = routeName.originalName || this.lastSearchBefore;
        }
        
        this.ErrorData =errorMsg;
        // show to client
        
        this.searchModel =''; // reset
        this.onSearchQBackToDirective({reset:true}) 

        if(typeof cbOnDone=='function'){
          cbOnDone();
        }
      }
    );
  }

  getFlickerLink(routeName: IRouteName, apiName: string) {
    this.linkLoaded = 0;
    this.dataService.getFlickerLink(routeName, apiName).subscribe(
      data => {
        this.linkLoaded = 1;

        console.log('getFlickerLink data', data);

        this.updateModelData(data);
        //  console.log('what is the fucking data',data)
        //    this.DataLoaded = true;
        //      this[`${apiName}Data`] = data;
        //console.log('what is punkapiData',this[apiName+'Data']); 

        //        this._globals.glob[`${apiName}.data`] = data;

      },
      (errorMsg: any) => {
        this.linkLoaded = 0;
        console.log('getFlickerLink errorMsg', errorMsg)

      }
    );
  }

  updateModelData(newData){
   var selected_api =  this.PAGE_DEFAULTS.apiName;
    
  var update=this[`${selected_api}Data`].map((item,index)=>{
      if(item.owner.indexOf(newData.nsid)!==-1){
        item.flickerLink = newData.url;
        console.log(`updated user: ${newData.nsid}`)
      }

      return item;
    })

    this._globals.glob[`${selected_api}.data`] = this[`${selected_api}Data`]  = update;
    console.log('what is the updated model',this[`${selected_api}Data`])
  }
}



