import { NgModule,Input,Output,HostBinding,NO_ERRORS_SCHEMA  } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ProductComponent } from './product.component';
import { RouterModule,Router } from '@angular/router';
import { ProductItemComponent } from './product-item/product-item.component';
import { TransactionResolver } from '../_shared/services/transaction.resolver';

  
var _routesObj = [
  { path: 'products', component: ProductComponent },

   { path: 'product/:apiname/:id', component: ProductItemComponent, resolve: {
                  product: TransactionResolver
                } 
  },

  { path: 'product/:apiname/imdb/:imdbid', component: ProductItemComponent, resolve: {
                  product: TransactionResolver
                } 
  },
  { path: 'products/paged/:paged', component: ProductComponent },
  { path: 'products/paged', redirectTo: 'products', pathMatch: 'full' },
  { path: 'product/**', redirectTo: 'products', pathMatch: 'full' },
  { path: 'product/:apiname', redirectTo: 'products', pathMatch: 'full' },
  { path: 'product/:apiname/imdb', redirectTo: 'products', pathMatch: 'full' },
  { path: '**', redirectTo: 'products', pathMatch: 'full'}
]

@NgModule({
  //schemas: [NO_ERRORS_SCHEMA],
  imports: [
    CommonModule, 
    RouterModule.forChild(_routesObj),
  ],
  // at app.module
  declarations: [
    
   // ProductComponent,
      
  ],
   //entryComponents: [ProductItemComponent] 
})
 

export class ProductModule {  
  constructor(r:Router){
   // r.resetConfig(importDynamicRoutes)
  }
}


