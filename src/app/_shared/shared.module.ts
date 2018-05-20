import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from './services/data.service';
import { LoggerService } from './services/logger.service';
import { indexChangeDirective } from './directives/directives';
import { SharedComponent } from './shared.component';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    SharedComponent,
    indexChangeDirective
  ],
  exports: [
  // modules to share among other
    CommonModule,
    FormsModule
  ],
   providers: [
    DataService,
    LoggerService
  ],
})
export class SharedModule { }




