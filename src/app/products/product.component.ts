import { Component, OnInit, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../_shared/services/data.service';
import { LoggerService } from '../_shared/services/logger.service';
import { BeersModel, FlickrPhotoModel, GettyImages, OmdbapiModel,Omdbapi_imdbID } from '../_shared/services/models';
import { MyGlobals } from '../_shared/myglobals';
import { EventEmitService } from '../_shared/services/eventEmmiter.service';
import * as _ from "lodash";
import { slideInOutAnimation, moveIn } from '../_shared/animations';

// interfaces
import { IRouteName } from '../_shared/interfaces';


@Component({
  selector: 'products',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  animations: [slideInOutAnimation, moveIn],

  // attach the slide in/out animation to the host (root) element of this component
  host: { '[@slideInOutAnimation]': '' },
})

export class ProductComponent implements OnInit {
  state: string = 'large';
  private getHttpRequestSubscription:any=null;
  public in_clipboard:any={};
  public indexPerRow: number = 0;
  is_imdbID:boolean = false;
  public punkapiData: BeersModel[];
  public flickrData: FlickrPhotoModel[];
  public gettyimagesData: GettyImages[];
  public omdbapiData: OmdbapiModel[];
  public DataLoaded = false;
  public routeName: any;
  public lastSearchBefore: string = '';
  public linkLoaded: any = false;
  public exec_search = false;
  private searchSubscription: any;
  private searchModel: string;
  public ErrorData: any = false;
  public available_apis: Array<any>;
  public lastSearch: any = false;
  doingPaged: boolean = false;
  private searchtext = {
    inx: 0
  }

  // default page settings 
  public PAGE_DEFAULTS = {
    apiName: 'punkapi', //flickr
    pageTitle: 'Beers.. Drink! Get drunk!',// gets overriten
    pageName: 'products',
    per_page: 10,
    paged: 10,
    currentPaged: 1,
    searchAPIcheck: false,
    pageDefault: 1
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


    /**
     *  this event is received from app.component < SearchInputDirective > product.component
     *  Because our search-input is integrated outsite of this component scope we have to reveice 
     *  event transmitted data to update the results
     */

    this.searchSubscription = appEmmiter.subscribe(msg => {

      if(msg.eventType=='BackToDirective'){
         return;
      }
      if (msg.eventType == 'onSearch') {
        if (_.isObject(msg)) {
         // console.log('what is onSearch msg',msg)
          this.PAGE_DEFAULTS.searchAPIcheck = msg.searchAPIcheck;
          this.searchItems(msg.event, msg.searchVal, msg.type, msg.searchAPIcheck, msg.imdbID);
          // imdbID
        }
      }

    }, (err) => {
      this.logger.log(`what is the err ${err}`, true);
    }, (complete) => {
      // console.log('what is the complete', complete)
    },_globals);
    this._globals.glob.searchSubscription = this.searchSubscription;


  }

  /**
   * we need this to send data back to directive to reset the field to onpty on loaded data to page
   * @param data 
   */
  onSearchQBackToDirective(data) {
    data.eventType = 'BackToDirective';
    data.apiName = this.PAGE_DEFAULTS.apiName;
    data.from ='productComponent';
    this.appEmmiter.next(data,false);
  }

  getKeywords(obj) {
    return this._globals.getKeywords(obj);
  }

  /**
   * 
   * search items and negotiate between events 'keydown' and 'focusout'
   * added some user experience logic to delay loading on frequent search event/requests
   *  We ar using 2 events onEnter and keydown/focus within one element, to avoid doubling up, i created 
   * a delay for this issue.
   * 
   * 
   * @param event 
   * @param val 
   * @param type 
   */
  searchItems(event: any = false, val: string, type = '', searchAPI: false,imdbID:boolean=false) {


    if (this.exec_search === true) {
      console.log('--wait! Still executing')
      return;
    }

    if (!searchAPI) this.searchModel = val; /// search filtering

    var exec = () => {
      return this.whichSearch(type, event, () => {

        var search_v;
        search_v = (val.length > 2) ? { search_by_name: this.niceName(val.toLowerCase()) } : '';

        var search_val = search_v as any;

        // to use when hitting this.gotoPaged!
        if (search_val) this.lastSearchBefore = val;

        if (search_val && searchAPI) {

          search_val.originalName = val;
          search_val.searchAPI = searchAPI;
          if(imdbID) {
            search_val.imdbID = imdbID; 
            delete  search_val.originalName;
            delete search_val.search_by_name;
          }

          this.getMyHttpRequest(search_val, this.PAGE_DEFAULTS.apiName);
          this.logger.log(`searching api results with: ${search_val.search_by_name || search_val.imdbID}`)

        } else if (!search_val) {
          this.logger.log(`you entered no search value, defauling to paged`)
          this.getMyHttpRequest({ paged: this.PAGE_DEFAULTS.currentPaged, originalName: search_val } as any, this.PAGE_DEFAULTS.apiName);
        }
        this.exec_search = true;

      })
    }

     if (type == 'click' && val.length > 2) {
           exec();
            setTimeout(() => {
              this.exec_search = false;
            },500)
           
     }

    if (type == 'focusout' && val.length > 2) {

      setTimeout(() => {
        exec();
        this.exec_search = false;
      }, 700);
      // slow down requests
    }

    if (type == 'keydown') {
      setTimeout(() => {
        exec();
        this.exec_search = false;
      }, 300)
    }

  }

  get paged_is(): any {
    return parseInt(this._route.snapshot.paramMap.get('paged')) || false;
  }


  /** 
   * request flickr artist link 
   * there is no avaialble request together with artist link so i integrated standalone on click
   * 
   * */
  loadLink(owner) {
    this.getFlickerLink({ user_id: owner, method: 'flickr.urls.getUserPhotos' } as any, this.PAGE_DEFAULTS.apiName);
  }


  /**
   *  wirks together with "searchItems()"
  * have decided to use 2 events, 
  * keydownand/enter and focusout for ease of use, so we do not have to add the search button
  * 
  * @param event 
  * @param val 
  * @param type 
  */

  private whichSearch(type, event, cb) {

    switch (type as string) {
      case 'click':
            this.searchtext.inx++;
            cb();
          break;
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

    if (this.searchtext.inx >= 1) this.searchtext.inx = 0;

  }

  copyToclipb(selectorId){
  this.in_clipboard = {};
   this._globals.copyToclipBoard(selectorId,(is_)=>{
    if(is_) this.in_clipboard[selectorId] = true;
    else this.in_clipboard[selectorId] = true;
   });
  }

  /**
   * goes to product-item.component page
   * @param nr 
   */
  goto(nr: any,imdbID:boolean=false) {

    if (nr === '' || nr === undefined) return;
    if (nr === 0) nr = 1;
   
    nr = nr.replace(/ /g, ""); //just in case strip spaces

    setTimeout(() => {
      var append = (imdbID)? 'imdb/':'';

        var _gotourl = `/product-item/${this.PAGE_DEFAULTS.apiName}/${append}`  + nr; 
       // console.log('what is the goto url ',_gotourl)
      this._router.navigate([_gotourl]);
      
    }, 300)
    this.appEmmiter.next({},'unsubscribe',['directiveSearchSubscription','searchSubscription'])
  }

  // not using this at moment
  getIndex(i) {
    var perRow = 4;
    this.indexPerRow = i;
    //  console.log('current indexPerRow',this.indexPerRow)

  }

  /**
   * current component logic to route.param values
   * for the "getMyHttpRequest" api request from ngOnInit() /or dofeth() call
   */

  private fetchEvent(_paged: any = false): Promise<object> {
    var paged: any = _paged || this.paged_is || this.PAGE_DEFAULTS.currentPaged || this.PAGE_DEFAULTS.pageDefault;
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

    // this is a backup integration, but it does nothing to this component
    var singlePage: any = this._route.snapshot.paramMap.get('id');
    singlePage = (singlePage) ? { singlePage } : false;
    /////////////

    var parent_page = { parent_page: true };

    var whichOrder = paged || parent_page || singlePage || false;
    return (whichOrder) ? Promise.resolve(whichOrder) : Promise.reject('param are null!');
  }

  /**
   * takes you to products/paged/:id 
   * saves payload in case we go to product-item, and we save the last state.
   * @param nr 
   */
  gotoPaged(nr: any) {
    if (nr) {
      (this._globals.payload as any).paged = nr;
      this.routeName = { paged: parseInt(nr) };
      this.lastSearch = this.lastSearch || (this._globals.payload as any).lastSearch;
      if (this.lastSearch) {
        //add last search val to pass to next page
        this.routeName.search_by_name = this.niceName(this.lastSearch.toLowerCase());
      }
      this.PAGE_DEFAULTS.currentPaged = nr;
      this.searchModel = '';
      this.getMyHttpRequest(this.routeName, this.PAGE_DEFAULTS.apiName);
    } else {
      this.getMyHttpRequest(false as any, this.PAGE_DEFAULTS.apiName);
    }
  }


  /**
   * dofetch works together with 'fetchEvent()'
   * and evecutes the payload logic, then it runs the httprequest for that payload
   * dofetch() is called in 2 places, oninit and from filterTag()
   * Here we also update page globals and send variable data with this.appEmmiter.next to app.component
   * @param paged 
   * @param apiName 
   */
  dofetch(paged: any = false, apiName: any = false) {

    /// unsubscribe from previous this.getHttpRequestSubscription
    if(this.getHttpRequestSubscription){
      this.getHttpRequestSubscription.unsubscribe();
    }
    
   /// get page param  
    this.PAGE_DEFAULTS.apiName = apiName || (this._globals.payload as any).apiName || this.PAGE_DEFAULTS.apiName;
    paged = paged || (this._globals.payload as any).paged;


    this.fetchEvent(paged).then((whichOrder: any) => {
      if (whichOrder === false) {
        return Promise.reject('no route found!');
      }

      if (whichOrder.paged) this.PAGE_DEFAULTS.currentPaged = whichOrder.paged;

      this.routeName = whichOrder;
      this.getMyHttpRequest(this.routeName, this.PAGE_DEFAULTS.apiName);

    }, (err) => {
      this.logger.log(err, true)
      this.routeName = false;
      this.getMyHttpRequest(this.routeName, this.PAGE_DEFAULTS.apiName);
    })

    var updateTitle = this.updateTitle();
    this.dataService._globs = this._globals;

    setTimeout(() => {
      this.appEmmiter.next({ updateTitle:updateTitle,bgChange: true, apiName: this.PAGE_DEFAULTS.apiName, isProductPageName:this.PAGE_DEFAULTS.pageName,from:'productComponent' },false);
    }, 100)

  }

  updateTitle() {
    this.PAGE_DEFAULTS.pageTitle = this.PAGE_DEFAULTS.apiName + ' API' + " | " + this.PAGE_DEFAULTS.pageName; 
    return this.PAGE_DEFAULTS.pageTitle;
  }

  /**
   * when there is an error on page we hit reset
   * @param startOver 
   */
  starOver(startOver = true) {
    this.filterTag(this.PAGE_DEFAULTS.apiName, 1);
  }



  ngOnInit() {
    this.dofetch();
    // console.log(' doing oninit and fetch')
  }


  /**
   * filterTag  swithes the api view to another, on main product.component it sets the payload for onInit to call dofetch
   * and when on products/paged/... it can then call dofetch manually
   * @param apiName 
   * @param paged 
   */
  filterTag(apiName, paged: number = 1) {


    this.searchModel = '';
    this.PAGE_DEFAULTS.apiName = apiName;
    console.log('-- filterTag to fetch for apiName: ', apiName)
    this.lastSearchBefore = '';
    /// can call fetch because it will not call oninit, where fetch is also called, no double events
    if (this.paged_is) {
      this.dofetch(paged, apiName);
    } else {
     
      /// not on paged so send payload for oninit
      (this._globals.payload as any).apiName = apiName;
      (this._globals.payload as any).paged = paged;
    }

    this.updateTitle();
    this.searchModel = '';
  }

  mCommas(str) {
    return str.replace(/ /g, ", ");
  }

  niceName(str) {
    var limit_desc = this._globals.descLimit(str, 60);
    var nice = this._globals.nicename(limit_desc);
    return (str) ? nice : '';
  }

  updateIndex(inx) {
    //console.log('what is the uipdated index ', inx)
  }

  niceDate(str) {
    var d = new Date(str);
    return d.toString();
  }

  descLimit(str, limit = 150, ending = '...') {
    return (str) ? str.substring(0, limit) + ending : '';
  }


  /**
   * getMyHttpRequest()
   * our call to restAPI service/ observable method from services class
   * 
   * lastSearch: updates per each call to getMyHttpRequest
   * lastSearchBefore: remembers the search toke place before last :) 
   * 
   * @param routeName 
   * @param apiName 
   * @param cbOnDone  // no used
   */

  getMyHttpRequest(routeName: IRouteName, apiName: string) {


    // tells the search directive to display loading icon, cool!!
    if (routeName.searchAPI) this.onSearchQBackToDirective({ loading: true })

    
    this.is_imdbID = (routeName.imdbID)? true:false;  
    this.ErrorData = false;
    this.DataLoaded = false;
    this.lastSearch = false;
    console.log('Getting new data ...');

    routeName.per_page = this.PAGE_DEFAULTS.per_page as any;

    if (!routeName) {
      this.logger.log('no singlePage or paged params defind', true)
      this.DataLoaded = null;
      return false
    }

    this.getHttpRequestSubscription = this.dataService.getHttpRequest(routeName, apiName).subscribe(
      data => {

      
        this.DataLoaded = true; // show results
        if(this.is_imdbID){

              this[`${apiName}imdbIDData`] = data; // dirty, dynamic setting
              //console.log(`what is ${apiName} data`,this[apiName+'Data']); 
              this._globals.glob[`${apiName}imdbID.data`] = data;
        }else{           
              this[`${apiName}Data`] = data; // dirty, dynamic setting
              this._globals.glob[`${apiName}.data`] = data; 
        }

      

        this.searchModel = ''; // reset filter
        /// remember our serch queries
        this.lastSearch = routeName.originalName || this.lastSearchBefore || this._globals.api_random_search_val;
        (this._globals.payload as any).lastSearch = this.lastSearch;
        
        this.onSearchQBackToDirective({ reset: true })

      },
      (errorMsg: any) => {
        this.DataLoaded = null;
        this._globals.glob[`${apiName}.data`] = this.DataLoaded;

        if (typeof errorMsg !== 'string') {
          (errorMsg as any).badSearch = routeName.originalName;
          this.lastSearch = routeName.originalName || this.lastSearchBefore;
        }

        this.ErrorData = errorMsg; // display error on page
        this.searchModel = ''; // reset filter
        this.onSearchQBackToDirective({ reset: true })
      }
    );
  }

  /**
   * (click)=loadLink
   * Stand alone get request to flickr artist page url
   * it updates our model as well and returns the value on product-item page,only if you request it.
   * this is retrie
   * @param routeName 
   * @param apiName 
   */
  getFlickerLink(routeName: IRouteName, apiName: string) {

    this.dataService.getFlickerLink(routeName, apiName).subscribe(
      data => {
        this.updateModelData(data,'flickerLink');
      },
      (errorMsg: any) => {
        console.log('getFlickerLink errorMsg', errorMsg)
      }
    );
  }

  getimdbData(imdbID){
      var payload = { imdbID: imdbID, s: imdbID } as any;
       this.dataService.getItemimdbData(payload,'omdbapi').subscribe(
      data => {

        this.updateModelData(data[0],'imdbID',(newData)=>{
            this._globals.glob[`omdbapiimdbID.data`] = newData;
        }); 
      
      },
      (errorMsg: any) => {
         console.log('errorMsg getimdbData',errorMsg)
      }
    );
  }



  private updateModelData(newData, key,cb:any=false) {
    var selected_api = this.PAGE_DEFAULTS.apiName;

    var update = this[`${selected_api}Data`].map((item, index) => {
      var inxOf;

      if (selected_api == 'flickr') {
        inxOf = item.owner.indexOf(newData.nsid) !== -1;
        if (inxOf) item[key] = newData.url;
      }
      if (selected_api == 'omdbapi') {
        inxOf = item[key].indexOf(newData[key]) !== -1;
        if (inxOf) {
          item = newData;
          if(typeof cb==='function') cb([item]) 
        }
      }

      if (inxOf) console.log(`updated item: ${item.nsid || item.Title}`)
     
      return item;
    })

    this._globals.glob[`${selected_api}.data`] = this[`${selected_api}Data`] = update;

  }
};

