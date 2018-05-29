import { NgModule,Input,Output,HostBinding,NO_ERRORS_SCHEMA  } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ProductComponent } from './product.component';
import { RouterModule } from '@angular/router';
import { ProductItemComponent } from './product-item/product-item.component';
import { TransactionResolver } from '../_shared/services/transaction.resolver';
import {ApiList} from '../api-list';


var importDynamicRoutes = (() => {
  return new ApiList().list().reduce((outp, val, inx) => {
    if (val.name) {
      outp.push({
                path: `product/${val.name}/:id`,
                //   canActivate: [ TransactionResolver ],
                component: ProductItemComponent,
                resolve: {
                  product: TransactionResolver
                }
              })
    }
    return outp;
  }, []);
})();
importDynamicRoutes.push({ path: 'products', component: ProductComponent });
importDynamicRoutes.push({ path: 'products/paged', redirectTo: 'products', pathMatch: 'full' })
importDynamicRoutes.push({ path: 'product/**', redirectTo: 'products', pathMatch: 'full' })
importDynamicRoutes.push({ path: '**', redirectTo: 'products', pathMatch: 'full'})

@NgModule({
  //schemas: [NO_ERRORS_SCHEMA],
  imports: [
    CommonModule, 
    RouterModule.forChild(importDynamicRoutes),
  ],
  // at app.module
  declarations: [
   // ProductComponent,
    
  ]
})


export class ProductModule { }


