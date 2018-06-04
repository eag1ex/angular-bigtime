import { Component, Input, Output, HostBinding, OnInit, EventEmitter } from '@angular/core';
import { EventEmitService } from '../services/eventEmmiter.service';

@Component({
  selector: 'search-input',
  templateUrl: './searchInput.directive.html',
})
export class SearchInputDirective implements OnInit {
  titleDisplay: number;
  searchAction: any;
  apiName: string;
  loading: boolean = false;
  searchtext: string;
  placeHolder: string;
  haltSearch: boolean; false;
  public searchAPIcheck: boolean = false;
  constructor(/*private elm: ElementRef, */private onSearchAction: EventEmitService/*, private renderer: Renderer*/) {

    /// 
    /*
    renderer.listen(elm.nativeElement, 'focusout', (event) => {

      if (this.searchAPIcheck && this.searchtext.length > 2) {
        //  console.log('doHaltAndWait searchElm focusout!');
    
      }

    });

    renderer.listen(elm.nativeElement, 'keydown', (event) => {
      if (event.keyCode == 13 && this.searchtext.length > 2) {
        if (this.searchAPIcheck) {
          //    console.log('doHaltAndWait searchElm keydown!');
         
        }
      }
    });
    */

    // we could bind it to on change eventi know, but this give more flexibility to what we want to communicate  and what type of data :)
    this.searchAction = onSearchAction.subscribe(msg => {

      if (msg.apiName) {
        this.apiName = msg.apiName;
        this.placeHoldermessage(this.apiName);
      }

      if (msg.eventType == 'BackToDirective') {
        if (msg.reset) {
          //  console.log('received BackToDirective!')
          this.searchtext = '';
          this.searchAPIcheck = false;
          this.loading = false;
        }
        if (msg.loading) {
          this.loading = true;
        }

        if (msg.dofocusout) {
          //renderer.invokeElementMethod(elm.nativeElement, 'focusout', []);
          // elm.nativeElement.
        }
        //
        //  console.log('did the directive receive onSearchAction?? ', msg)
      }

    }, (err) => {
      console.error('--- onSearchAction error', err)
    }, (complete) => {
      // console.log('what is the complete', complete)
    });
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
      this.placeHoldermessage()
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
    // handle_imdbID
    var emmit_req = {
      event: event,
      searchVal: searchVal,
      type: type, 
      searchAPIcheck:this.searchAPIcheck
    }
    var imdbID = this.handle_imdbID(searchVal);
    (emmit_req as any).imdbID=imdbID;

    this.onSearch.emit(emmit_req);
  }

  ngOnInit() {
  }
};