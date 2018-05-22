import { Component, OnInit, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../_shared/services/data.service';
import { LoggerService } from '../_shared/services/logger.service';
import { BeersModel } from '../_shared/services/models';
import { MyGlobals } from '../_shared/myglobals';
import { EventEmitService } from '../_shared/services/eventEmmiter.service';
import * as _ from "lodash";




@Component({
  selector: 'products',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})

export class ProductComponent implements OnInit {
  public indexPerRow: number = 0;
  public beersData: BeersModel[];
  public beersDataLoaded = false;
  public routeName: any;
  public badSearch:any=false;
  public exec_search = false;
  private searchSubscription: any;
  private searchModel: string;
  private searchtext = {
    inx: 0
  }

  // default page settings 
  public PAGE_DEFAULTS = {
    pageTitle: 'Beers.. Drink! Get drunk!',
    pageName:'products',
    perPage: 10,
    paged: 10,
    currentPaged: 1,
    searchAPIcheck: false
  }


  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private dataService: DataService,
    private logger: LoggerService,
    private _globals: MyGlobals,
    private searchEmmiter: EventEmitService

  ) {
    // set pagename globals
    _globals.glob.current_page = this.PAGE_DEFAULTS.pageName;

  

    /**
     *  this event is received from app.component
     */
    this.searchSubscription = searchEmmiter.subscribe(msg => {

      if (_.isObject(msg)) {
        this.PAGE_DEFAULTS.searchAPIcheck = msg.searchAPIcheck;
        this.searchItems(msg.event, msg.searchVal, msg.type, msg.searchAPIcheck);
      }

    }, (err) => {
         this.logger.log(`what is the err ${err}`,true); 
    }, (complete) => {
     // console.log('what is the complete', complete)
    });

    _globals.glob.searchSubscription= this.searchSubscription;

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

        var search_v = (val.length > 2) ? { search_by_name: this.niceName(val.toLowerCase()) } : false; 
        var search_val = search_v as  any;

        if (search_val && searchAPI) {
          search_val.originalName = val;
          this.getBeers(search_val);
          this.logger.log(`searching api results with: ${search_val.search_by_name}`)

        } else if (!search_val) {
          this.logger.log(`you entered no search value, defauling to paged`)
          this.getBeers({ paged: this.PAGE_DEFAULTS.currentPaged, originalName:val });
        }

        this.exec_search = true;

      })
    }


    if (type == 'focusout' && val.length > 2) {

      setTimeout(() => {
        exec();
        this.exec_search = false;

      }, 2000);

      // slow down requests to 2 seconds

    }

    if (type == 'keydown') {
      setTimeout(() => {
        exec();
        this.exec_search = false;
      }, 500)

    }

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
   
    if (nr === '' || nr === undefined) return;
    if (nr === 0) nr = 1;

      setTimeout(()=>{
         this._router.navigate(['/product' + '/' + nr]);
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
   * it returns the correct value for the "getBeers" api request from ngOnInit() call
   */

  fetchEvent(): Promise<object> {
    var paged: any = this._route.snapshot.paramMap.get('paged');
    /// update curent paged for accuricy
    this.PAGE_DEFAULTS.currentPaged = paged || this.PAGE_DEFAULTS.currentPaged;

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

      this.routeName = { paged: parseInt(nr) };
      this.PAGE_DEFAULTS.currentPaged = nr;

      this.getBeers(this.routeName);
    } else {
      this.getBeers(false);
    }
  }

  ngOnInit() {
 
    /// get page param  
    this.fetchEvent().then((whichOrder: any) => {
      if (whichOrder === false) {
        return Promise.reject('no route found!');
      }
      if (whichOrder.paged) {
        this.PAGE_DEFAULTS.currentPaged = parseInt(whichOrder.paged);
      }

      this.routeName = whichOrder;
      this.getBeers(this.routeName);

    }, (err) => {
      this.logger.log(err, true)
      this.routeName = false;
      this.getBeers(this.routeName);
    })
  }


  niceName(str) {
    var nice = this._globals.nicename(str)
    return (str) ? nice : '';
  }

  updateIndex(inx) {
    //console.log('what is the uipdated index ', inx)
  }

  descLimit(str) {
    return (str) ? str.substring(0, 100) : '';
  }

  getBeers(routeName: any) {
    this.badSearch=false;

    this.beersDataLoaded = false;
    console.log('Getting beers ...');

    var params: any = {
      perPage: this.PAGE_DEFAULTS.perPage
    }

    if (routeName.parent_page) {
      params.parent_page = routeName.parent_page;
    }

    else if (routeName.search_by_name) {
      params.search_by_name = routeName.search_by_name;
    }

    else if (routeName.paged) {
      params.paged = routeName.paged;
    }

    else if (routeName.singlePage) {
      params.byName = routeName.singlePage
      delete params.perPage;
    } else {
      this.logger.log('no singlePage or paged params defind', true)
      this.beersDataLoaded = null;
      return false
    }


    this.dataService.getBeers(params).subscribe( 
      data => {
       
        this.beersDataLoaded = true;
        this.beersData = data;
        this._globals.glob.beers = this.beersData;
      },
      (errorMsg: string) => {
        this.beersDataLoaded = null;
        this._globals.glob.beers = this.beersDataLoaded;
  
        // show to client
        this.badSearch = routeName.originalName;
        this.searchModel =''; // reset
      }
    );
  }

}

