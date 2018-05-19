import { NgModule, Component,Input,Output,HostBinding,NO_ERRORS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductComponent } from './product.component';
import { RouterModule } from '@angular/router';
import { ProductItemComponent } from './product-item/product-item.component';



@NgModule({
  schemas: [NO_ERRORS_SCHEMA],
  imports: [
    CommonModule,
   
     RouterModule.forChild([
        { path: 'products', component: ProductComponent },
         { path: 'products/:id',
       //   canActivate: [ ProductGuardService ],
          component: ProductItemComponent }
    ]),

  ],
  declarations: [ProductItemComponent]
})
export class ProductModule { }

