import { NgModule, Component,Input,Output,HostBinding,NO_ERRORS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductComponent } from './product.component';
import { RouterModule } from '@angular/router';
import { ProductItemComponent } from './product-item/product-item.component';
import { PipeNumber } from '../_shared/pipe.number';



@NgModule({
  schemas: [NO_ERRORS_SCHEMA],
  imports: [
    CommonModule,
   
     RouterModule.forChild([
        { path: 'products', component: ProductComponent },
        { path: 'products/paged/:paged',
       //   canActivate: [ ProductGuardService ],
          component: ProductComponent },
        { path: 'products/:id',
       //   canActivate: [ ProductGuardService ],
          component: ProductItemComponent },  
        { path: 'products/paged', redirectTo: 'products', pathMatch: 'full'},
    ]),

  ],
  declarations: [PipeNumber,ProductComponent,ProductItemComponent]
})
export class ProductModule { }

