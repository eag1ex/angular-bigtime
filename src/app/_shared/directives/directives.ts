import { ChangeDetectionStrategy, Component, Input, Output, HostBinding, OnInit, ElementRef, EventEmitter } from '@angular/core';


/// not currently used
/////////////////////////////////////////////////////////////////////
@Component({
  selector: '[indexchange]',
  template: '<ng-content></ng-content>',
})
export class indexChangeDirective implements OnInit {
  currentIndex: number;
  constructor(private elm: ElementRef) {
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

  }
}


// just a neat way to return page title on to any component :))
//////////////////////////////////////////////////

@Component({
  selector: 'page-title',
  template: `<h1 class="display-{{titleDisplay}} p-2">{{title}}</h1>`
})
export class PageTitleDirective implements OnInit {

  titleDisplay: number;
  constructor(private elm: ElementRef) {

  }

  @Input() titleName: string;

  @Input()
  title: string;

  @Input()
  display: number;


  ngOnInit() {
    this.titleDisplay = this.display;
  }
};


