import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataService } from './services/data.service';
import { LoggerService } from './services/logger.service';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
   
  ],
  exports: [
  // modules to share among other
    CommonModule,
  ],
   providers: [
   // DataService,
   // LoggerService
  ],
})
export class SharedModule { }




