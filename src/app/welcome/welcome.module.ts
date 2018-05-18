import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeComponent } from './welcome.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
   
     RouterModule.forChild([
        { path: 'welcome', component: WelcomeComponent }
    ]),

  ],
  declarations: []
})
export class WelcomeModule { }


