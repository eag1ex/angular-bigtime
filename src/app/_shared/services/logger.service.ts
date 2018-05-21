import { Injectable } from '@angular/core';

@Injectable({
providedIn: 'root'
})
export class LoggerService {
  log(msg: string,err:boolean=false) {
      if(err){
            console.error(`-- ${msg}`); 
      }else{
         console.log(`-- ${msg}`);
      }  
  }
}
