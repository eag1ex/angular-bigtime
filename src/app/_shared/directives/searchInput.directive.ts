import { Component, Input, Output, HostBinding, OnInit, ElementRef, EventEmitter } from '@angular/core';


@Component({
  selector: 'search-input',
  template: template(),
})
export class SearchInputDirective implements OnInit {
  searchtext: string;
  titleDisplay:number;
  public searchAPIcheck:boolean=false;
  constructor(private elm: ElementRef) {

  }


  @Input()
  display: number;

  @Output()
  onSearch = new EventEmitter<any>();
 

  searchItems(event,searchVal,type){
    this.onSearch.emit({event:event,searchVal:searchVal,type:type,searchAPIcheck:this.searchAPIcheck});
  }  

 ngOnInit() {
  }
}

function template(){

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
             placeholder="search your beer!"
             class="form-control"
             aria-label="Search" 
             type="text"
             >
            
    </div>
     <p class="search-api-check mb-1 p-1 pl-2" [ngClass]="{'show-search-api-check':searchAPIcheck===true}" >Search API!</p>
`;
}
