import { Component, Input, Output, HostBinding, OnInit, EventEmitter } from '@angular/core';
import { EventEmitService } from '../services/eventEmmiter.service';
import { MyGlobals } from '../../_shared/myglobals';
@Component({
  selector: 'search-input',
  templateUrl: './searchInput.directive.html',
})
export class SearchInputDirective implements OnInit {
  titleDisplay: number;
  directiveSearchSubscription: any;
  apiName: string;
  loading: boolean = false;
  searchtext: string;
  placeHolder: string;
  displayClickSearch:boolean=false; 
  haltSearch: boolean; false;
  public searchAPIcheck: boolean = false;
  constructor(/*private elm: ElementRef, */
    private onSearchAction: EventEmitService,
    /*, private renderer: Renderer*/
    private globs: MyGlobals
  ) {

     this.apiName = this.globs.glob.selected_apiName; // needed for production build

    // we could bind it to on change eventi know, but this give more flexibility to what we want to communicate  and what type of data :)
    this.directiveSearchSubscription = onSearchAction.subscribe(msg => {

        if (msg.apiName) {
            this.apiName = msg.apiName;
            this.placeHoldermessage(this.apiName);
          }
 
        if (msg.reset) {
          this.searchtext = '';
          this.searchAPIcheck = false;
          this.loading = false;
        }
        if (msg.loading) {
          this.loading = true;
        }

    }, (err) => {
      console.error('--- onSearchAction error', err)
    }, (complete) => {
      // console.log('what is the complete', complete)
    },globs);  
       globs.glob.directiveSearchSubscription = this.directiveSearchSubscription;
  }


  /**
   * display different placeholder texh for each api changeover
   * @param apiName 
   */
  placeHoldermessage(apiName: any = false) {
    apiName = apiName || this.apiName;

    var placeholder = "";
    var whichSearch = (this.searchAPIcheck) ? 'API search:' : 'search:';

    if (!apiName) {
      this.placeHolder = `${whichSearch} title`;
    }

    if (apiName == 'punkapi') {
      placeholder = `${whichSearch} beer name`;
    }
    if (apiName == 'gettyimages') {
      placeholder = `${whichSearch} title,artist,keyword`;
    }
    if (apiName == 'flickr') {
      placeholder = `${whichSearch} title,tags,ownername`;
    }
    if (apiName == 'omdbapi') {
      placeholder = `${whichSearch} title, or imdbID:ttxxx`;
    }
    this.placeHolder = placeholder;

  }


  @Input()
  display: number;

  @Output()
  onSearch = new EventEmitter<any>();

  /**
   * 
   * bind and return searched values and event handle up to app.component > dispatch > product component
   * @param event 
   * @param searchVal 
   * @param type 
   */
  liveAPIchange() {

    setTimeout(() => {
      this.placeHoldermessage();
    }, 200)

  }
// imdbid:tt0371746
  handle_imdbID(searchVal){
    if (this.apiName !=='omdbapi') return false;   

    var _match = 'imdbID:'.toLocaleLowerCase();
    searchVal = searchVal.replace(/ /g, "").toLocaleLowerCase();   
    if(searchVal.length > _match.length){
        var _test =  searchVal.indexOf(_match)!==-1;
        if(_test)  return searchVal.replace(_match,'');
    }
      return false;
  }

  searchItems(event, searchVal, type) { 

    if (this.searchtext == '') {
      searchVal = '';
    }
    if(this.searchtext.length >2){
      this.displayClickSearch = true;
    }else{
      this.displayClickSearch =false;
    }
    // handle_imdbID
    var emmit_req = {
      event: event,
      searchVal: searchVal || this.searchtext,
      type: type, 
      searchAPIcheck:this.searchAPIcheck
    }
    var imdbID = this.handle_imdbID(searchVal);
    (emmit_req as any).imdbID=imdbID;

    this.onSearch.emit(emmit_req);
  }

  ngOnInit() {
     this.apiName = this.globs.glob.selected_apiName; // needed for production build
     this.placeHoldermessage(this.apiName);
  }
};