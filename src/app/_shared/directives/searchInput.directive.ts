import { Component, Input, Output, HostBinding, OnInit, ElementRef, EventEmitter } from '@angular/core';
import { EventEmitService } from '../services/eventEmmiter.service';

//private emmiter: EventEmitService, 

@Component({
  selector: 'search-input',
  template: template(),
})
export class SearchInputDirective implements OnInit {
  searchtext: string;
  titleDisplay: number;
  searchAction:any;
  public searchAPIcheck: boolean = false;
  constructor(private elm: ElementRef,private onSearchAction: EventEmitService) {

    // we could bind it to on change eventi know, but this give more flexibility to what we want to communicate  and what type of data :)
    this.searchAction = onSearchAction.subscribe(msg => {
      if (msg.eventType == 'BackToDirective') {
        if(msg.reset){
          this.searchtext='';
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

  searchItems(event, searchVal, type) {
    if(this.searchtext==''){
      searchVal='';
    }
    this.onSearch.emit({ event: event, 
                        searchVal: searchVal, 
                        type: type, searchAPIcheck: 
                        this.searchAPIcheck });
  }

  ngOnInit() {
  }
}

function template() {

  return `

    <div class="input-group mb-1 search-wrap">
        <div class="input-group-prepend">
            <div class="input-group-text">
            <input type="checkbox" [checked]="searchAPIcheck" (change)="searchAPIcheck = !searchAPIcheck" />  
            </div>
        </div>


             <input 
            (keydown)="searchItems($event,search.value,'keydown');" 
            (focusout)="searchItems($event,search.value,'focusout');"
      
            [(ngModel)]="searchtext" #search 
             placeholder="search title/name!"
             class="form-control"
             aria-label="Search" 
             type="text"
             >
            
    </div>
     <p class="search-api-check mb-1 p-1 pl-2" [ngClass]="{'show-search-api-check':searchAPIcheck===true}" >Search API!</p>
`;
}
