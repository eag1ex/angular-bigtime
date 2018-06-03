import { NgModule,Input,Output,HostBinding,NO_ERRORS_SCHEMA  } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ProductComponent } from './product.component';
import { RouterModule } from '@angular/router';
import { ProductItemComponent } from './product-item/product-item.component';
import { TransactionResolver } from '../_shared/services/transaction.resolver';
import {ApiList} from '../api-list';

var importDynamicRoutes = (() => {
  return new ApiList().list().reduce((outp, val, inx) => {
    if (val.name =='omdbapi' && val.enabled){
           outp.push({ 
                path: `product/${val.name}/:id`,
                component: ProductItemComponent,
                resolve: {
                  product: TransactionResolver
                }
              })
              outp.push({ 
                path: `product/${val.name}-imdbID/:imdbID`,
                component: ProductItemComponent,
                resolve: {
                  product: TransactionResolver
                }
              })   

               //
    }
    else if (val.name &&  val.enabled) {
     

      outp.push({ 
                path: `product/${val.name}/:id`,
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
 
/**
 * dynamicly loading routes for the generated apis
 * ** sometimes you get a console error when re rendering on change, it is an angular 6 bug
 * to avoid it, will integrage this dynamic loader as an import, should fix the issue
 */
var _routes =importDynamicRoutes.concat(_routesObj)

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


