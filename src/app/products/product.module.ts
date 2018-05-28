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


@NgModule({
  //schemas: [NO_ERRORS_SCHEMA],
  imports: [
    CommonModule, 

    RouterModule.forChild([
      { path: 'products', component: ProductComponent },
      importDynamicRoutes[0],importDynamicRoutes[1],
      {
        path: 'product/:id',
        //   canActivate: [ TransactionResolver ],
        component: ProductItemComponent,
        
        resolve: {
          product: TransactionResolver
        }
      },
      { path: 'products/paged', redirectTo: 'products', pathMatch: 'full' },
      { path: 'product/**', redirectTo: 'products', pathMatch: 'full' },
      { path: '**', redirectTo: 'products', pathMatch: 'full'}
    ]),

  ],
  // at app.module
  declarations: [
   // ProductComponent,
    
  ]
})


export class ProductModule { }


