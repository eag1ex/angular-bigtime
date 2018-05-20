import { Component, OnChanges, Input, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'shared',
     template:'<ng-content></ng-content>',
  //  templateUrl: './shared.component.html',
  //  styleUrls: ['./shared.component.scss']
})
export class SharedComponent implements OnChanges {

   // @Input() someVal: number;


   // @Output() emitSomeVar: EventEmitter<string> =
       //     new EventEmitter<string>();

    ngOnChanges(): void {
      //  this.someVal 
    }

    onClick(): void {       
    }
}
