import { Component, Input, Output, HostBinding, OnInit, ElementRef, EventEmitter } from '@angular/core';

/////////////////////////////////////////////////////////////////////
@Component({
  selector: '[indexchange]',
  template: '<ng-content></ng-content>',
})
export class indexChangeDirective implements OnInit {
  currentIndex: number;
  constructor(private elm: ElementRef) {

    // to get current attr
    // this.currentIndex = elm.nativeElement.getAttribute('indexchange'); 

    // to set new class
    //this.renderer.setElementClass(event.target,"opened",true);
  }

  @Input()
  indexNow: number;

  @Output()
  currinx = new EventEmitter<number>();


  ngAfterViewInit() {
    setTimeout(() => {
      this.currinx.emit(this.indexNow + 1);
    }, 50);
  }

  ngOnInit() {
    //if(this.indexNow>5){
    //  this.currinx.emit(this.indexNow+1);
    //console.log('emitting...')
    // }

  }
}
//////////////////////////////////////////////////

@Component({
  selector: 'page-title',
  template: PageTitleTemplate(),
})
export class PageTitleDirective implements OnInit {
  titleName: string;
  titleDisplay:number;
  constructor(private elm: ElementRef) {

    //console.log('PageTitleDirective loaded!')
  }

  @Input()
  title: string;

  @Input()
  display: number;


  // 

 ngOnInit() {
  this.titleName = this.title;
  this.titleDisplay = this.display;
  //console.log('what is this.titleName ',this.titleName )

  }
}

function PageTitleTemplate(){
  return `<h1 class="display-{{titleDisplay}}">{{titleName}}</h1>`;
}

