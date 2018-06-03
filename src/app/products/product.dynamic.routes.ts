
import { TransactionResolver } from '../_shared/services/transaction.resolver';
import {ApiList} from '../api-list';
import { ProductItemComponent } from './product-item/product-item.component';

var importDynamicRoutes = () => {
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
};

export const DynamicRoutes = importDynamicRoutes();

