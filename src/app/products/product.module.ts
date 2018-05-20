import { NgModule, Component,Input,Output,HostBinding,NO_ERRORS_SCHEMA  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductComponent } from './product.component';
import { RouterModule } from '@angular/router';
import { ProductItemComponent } from './product-item/product-item.component';
import { PipeNumber } from '../_shared/pipe.number';
import { SearchPipe } from '../_shared/pipe.search';

import { PageTitleDirective } from '../_shared/directives/directives';


@NgModule({
  schemas: [NO_ERRORS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
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
  declarations: [
    SearchPipe,
    PageTitleDirective,
    PipeNumber,
    ProductComponent,
    ProductItemComponent
  ]
})
export class ProductModule { }

