import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BeersModel } from '../../_shared/services/models';
import { MyGlobals } from '../../_shared/myglobals';
@Component({
  selector: 'product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css']
})
export class ProductItemComponent implements OnInit {

  routName: string;

   public PAGE_DEFAULTS = {
    pageTitle: 'Beer!',
    pageName:'single-product'
  }

  productData:BeersModel;
  productdataPairs:any = false;

  constructor(private _route: ActivatedRoute, 
    private _router: Router,
    private _globals:MyGlobals) {
      _globals.glob.current_page = this.PAGE_DEFAULTS.pageName; 
  }
  

   ngOnInit() {
    
    
    const param = this._route.snapshot.paramMap.get('id');
    if (param) {
      this.routName = param;
      const id = +param;
      
    }
     
    var prod = this._route.snapshot.data['product'];
    console.log('-- what is product',prod)
    if(prod.length>0){
       this.productData = prod[0];

        // update title
       this.PAGE_DEFAULTS.pageTitle = this.PAGE_DEFAULTS.pageTitle +' | '+ this.productData.name;
      // generate pairs
       this.productdataPairs=this.generateKeyArray(this.productData);
      console.log('what are the pairs!!',this.productdataPairs)
    }else{
      this.productdataPairs=null;
       this._router.navigate(['/products']);
    } 

  }


  generateKeyArray(obj:object){
    var arr_pair =[];
      for(var key in obj){
          if(obj.hasOwnProperty(key)){
            arr_pair.push([key,obj[key]])
          }
      }

      return arr_pair ||null
  }

}



/*
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { IProduct } from './product';
import { ProductService } from './product.service';

@Component({
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  pageTitle: string = 'Product Detail';
  errorMessage: string;
  product: IProduct;

  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private _productService: ProductService) {
  }

  ngOnInit() {
    const param = this._route.snapshot.paramMap.get('id');
    if (param) {
      const id = +param;
      this.getProduct(id);
    }
  }

  getProduct(id: number) {
    this._productService.getProduct(id).subscribe(
      product => this.product = product,
      error => this.errorMessage = <any>error);
  }

  onBack(): void {
    this._router.navigate(['/products']);
  }

}



*/
