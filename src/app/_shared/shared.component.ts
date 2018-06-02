import { Component, OnChanges, Input, EventEmitter, Output } from '@angular/core';
//import { LoggerService } from './services/logger.service';
//import { DataService } from './services/data.service';


/**
 * this module is currently not being used
 * but i left it here for future integration
 * 
 */

@Component({
    selector: 'shared',
     template:'<ng-content></ng-content>',
     providers:[]
  //  templateUrl: './shared.component.html',
  //  styleUrls: ['./shared.component.scss']
})
export class SharedComponent implements OnChanges {

  constructor(){

  }
   // @Input() someVal: number;


   // @Output() emitSomeVar: EventEmitter<string> =
       //     new EventEmitter<string>();

    ngOnChanges(): void {
      //  this.someVal 
    }
 
    onClick(): void {       
    }
}
