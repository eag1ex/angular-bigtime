import { NgModule,Input,Output,HostBinding,NO_ERRORS_SCHEMA  } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ProductComponent } from './product.component';
import { RouterModule } from '@angular/router';
import { ProductItemComponent } from './product-item/product-item.component';
import { TransactionResolver } from '../_shared/services/transaction.resolver';
import {ApiList} from '../api-list';

var importDynamicRoutes = (() => {
  return new ApiList().list().reduce((outp, val, inx) => {
    if (val.name &&  val.enabled) {
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

var _routesObj = [
  { path: 'products', component: ProductComponent },
  { path: 'products/paged/:paged', component: ProductComponent },
  { path: 'products/paged', redirectTo: 'products', pathMatch: 'full' },
  { path: 'product/**', redirectTo: 'products', pathMatch: 'full' },
  { path: '**', redirectTo: 'products', pathMatch: 'full'}
]
 
var _routes =importDynamicRoutes.concat(_routesObj)
console.log('what are the _routes',_routes)
@NgModule({
  //schemas: [NO_ERRORS_SCHEMA],
  imports: [
    CommonModule, 
    RouterModule.forChild(_routes),
  ],
  // at app.module
  declarations: [
   // ProductComponent,
    
  ]
})


export class ProductModule { }


