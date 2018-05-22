import { NgModule,Input,Output,HostBinding,NO_ERRORS_SCHEMA  } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ProductComponent } from './product.component';
import { RouterModule } from '@angular/router';
import { ProductItemComponent } from './product-item/product-item.component';
import { TransactionResolver } from '../_shared/services/transaction.resolver';

@NgModule({
  //schemas: [NO_ERRORS_SCHEMA],
  imports: [
    CommonModule, 

    RouterModule.forChild([
      { path: 'products', component: ProductComponent },
      {
        path: 'products/paged/:paged',
        //   canActivate: [ ProductGuardService ],
        component: ProductComponent,
      },
      {
        path: 'product/:id',
        //   canActivate: [ TransactionResolver ],
        component: ProductItemComponent,
        
        resolve: {
          product: TransactionResolver
        }
      },
      { path: 'products/paged', redirectTo: 'products', pathMatch: 'full' },
      { path: 'product/:id', redirectTo: 'products', pathMatch: 'full'},
      { path: '**', redirectTo: 'products', pathMatch: 'full'}
    ]),

  ],
  // at app.module
  declarations: [
   // ProductComponent,
    
  ]
})
export class ProductModule { }

