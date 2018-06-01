import { Component, Input, Output, HostBinding, OnInit, ElementRef, EventEmitter, Renderer } from '@angular/core';
import { EventEmitService } from '../services/eventEmmiter.service';

//private emmiter: EventEmitService, 

@Component({
  selector: 'search-input',
  template: template(),
})
export class SearchInputDirective implements OnInit {
  titleDisplay: number;
  searchAction: any;
  apiName:string;
  loading:boolean = false;
  searchtext: string;
  placeHolder:string;
  haltSearch: boolean; false;
  public searchAPIcheck: boolean = false;
  constructor(private elm: ElementRef, private onSearchAction: EventEmitService, private renderer: Renderer) {


    renderer.listen(elm.nativeElement, 'focusout', (event) => {
      
      
      if (this.searchAPIcheck && this.searchtext.length>2) {
      //  console.log('doHaltAndWait searchElm focusout!');
     //   this.doHaltAndWait();
      }

    });

    renderer.listen(elm.nativeElement, 'keydown', (event) => {
        if (event.keyCode == 13 && this.searchtext.length >2) {
          if(this.searchAPIcheck){
         //    console.log('doHaltAndWait searchElm keydown!');
       //     this.doHaltAndWait();
          }
        }
    });
    //elm.nativeElement.focusout();// does not work

    // we could bind it to on change eventi know, but this give more flexibility to what we want to communicate  and what type of data :)
    this.searchAction = onSearchAction.subscribe(msg => {

      if(msg.apiName){
        this.apiName = msg.apiName;
         this.placeHoldermessage(this.apiName);    
        }

      if (msg.eventType == 'BackToDirective') {
        if (msg.reset) {
        //  console.log('received BackToDirective!')
          this.searchtext = '';
          this.searchAPIcheck = false;
          this.loading=false;
        }
        if(msg.loading){
          this.loading=true;
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


  placeHoldermessage(apiName:any=false){
    apiName = apiName || this.apiName;

     var placeholder = "";
     var whichSearch = (this.searchAPIcheck) ?'API search:': 'search:';

    if(!apiName) {
     this.placeHolder= `${whichSearch} title`;
    }
   
    if(apiName=='punkapi'){
      placeholder=`${whichSearch} beer name`;
    }
    if(apiName=='gettyimages'){
      placeholder=`${whichSearch} title,artist,keyword`;
    }
    if(apiName=='flickr'){
      placeholder=`${whichSearch} title,tags,ownername`;
    }
    if(apiName=='omdbapi'){
      placeholder=`${whichSearch} title, or imdbID:ttxxx`;
    }
    this.placeHolder = placeholder;
  }


  doHaltAndWait() {
   // if (!this.haltSearch) this.haltSearch = true;

    setTimeout(() => {
      this.haltSearch = false;
    }, 500)

    console.log('--- wait, haltsearch!')
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
  liveAPIchange(){
    //toogle which search message :)
    setTimeout(()=>{
      this.placeHoldermessage()  
    },200)
    
  }

  searchItems(event, searchVal, type) {
   // if (this.haltSearch == true) return;
    if (this.searchtext == '') {
      searchVal = '';
    }

    this.onSearch.emit({
      event: event,
      searchVal: searchVal,
      type: type, searchAPIcheck:
      this.searchAPIcheck
    });
  }

  ngOnInit() {
  }
}

function template() {
  
  return `
    <div class="input-group mb-1 search-wrap">
          <div class="sk-circle search-loading-icon" *ngIf='loading===true'>
              <div class="sk-circle1 sk-child"></div>
              <div class="sk-circle2 sk-child"></div>
              <div class="sk-circle3 sk-child"></div>
              <div class="sk-circle4 sk-child"></div>
              <div class="sk-circle5 sk-child"></div>
              <div class="sk-circle6 sk-child"></div>
              <div class="sk-circle7 sk-child"></div>
              <div class="sk-circle8 sk-child"></div>
              <div class="sk-circle9 sk-child"></div>
              <div class="sk-circle10 sk-child"></div>
              <div class="sk-circle11 sk-child"></div>
              <div class="sk-circle12 sk-child"></div>
            </div>


              <div class="input-group-prepend">
                  <div class="input-group-text px-3">
                  <input type="checkbox" [checked]="searchAPIcheck" (change)="liveAPIchange(); searchAPIcheck = !searchAPIcheck" />  
                  </div>
              </div>


             <input 
            (keydown)="searchItems($event,search.value,'keydown');" 
            (focusout)="searchItems($event,search.value,'focusout');"
      
            [(ngModel)]="searchtext" #search 
             [placeholder]="placeHolder"
             class="form-control p-1 ml-3"
             aria-label="Search" 
             type="text">
            
    </div>
     <p class="search-api-check mb-1 p-1 pl-2" [ngClass]="{'show-search-api-check':searchAPIcheck===true}" >Search API!</p>
 `;
}
