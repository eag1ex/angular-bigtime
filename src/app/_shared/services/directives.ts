import { Component,Input,Output,HostBinding,OnInit,ElementRef, EventEmitter  } from '@angular/core';

@Component({
  selector: '[indexchange]',
 template:'<ng-content></ng-content>',
})     


export class indexChangeDirective  implements OnInit {
  currentIndex:number;
  constructor(private elm: ElementRef) 
  {
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
         this.currinx.emit(this.indexNow+1);
      }, 50);
     
  }

  ngOnInit() { 
    //if(this.indexNow>5){
    //  this.currinx.emit(this.indexNow+1);
        //console.log('emitting...')
   // }

  }
}
