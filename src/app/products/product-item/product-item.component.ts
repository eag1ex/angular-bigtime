import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BeersModel, Models } from '../../_shared/services/models';
import { MyGlobals } from '../../_shared/myglobals';
import { GlobalReuse } from '../../_shared/global.reuse';


@Component({
  selector: 'product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css']
})
export class ProductItemComponent implements OnInit {

  routName: string;

  public PAGE_DEFAULTS = {
    pageTitle: 'Beer!',
    pageName: 'single-product',
    apiName:''
  }

  productData: Models;
  productdataPairs: any = false;

  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private _globals: MyGlobals) {

    _globals.glob.current_page = this.PAGE_DEFAULTS.pageName;
    
    this.PAGE_DEFAULTS.pageTitle = "product: "+_globals.glob.selected_apiName;
    
    var apiByhref= new GlobalReuse().findApiNameFromUrl(this._globals.api_support);
    this.PAGE_DEFAULTS.apiName = apiByhref || _globals.glob.selected_apiName;
  }


  ngOnInit() {


    const param = this._route.snapshot.paramMap.get('id');
    if (param) {
      this.routName = param;
      const id = +param;

    }

    var prod = this._route.snapshot.data['product'];
    if (prod.length > 0) {
      this.productData = prod[0];
      
      /// check and update data keys
      if(!this.productData.image_url ){
         this.productData.image_url = (this.productData as any).url_m;

      }

       if(!this.productData.tagline ){
         this.productData.tagline = (this.productData as any).tags;

      }

      if(!this.productData.description ){
         this.productData.description = (this.productData as any).title;

      }
  
      // update title
      this.PAGE_DEFAULTS.pageTitle = this.PAGE_DEFAULTS.pageTitle + ' | ' + (this.productData.name || (this.productData as any).title);
      
      // generate pairs, quick fix
      this.productdataPairs = this.generateKeyArray(this.productData);
    
    } else {
      this.productdataPairs = null;
      this._router.navigate(['/products']);
    }

  }


  generateKeyArray(obj: object) {
    var arr_pair = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {


        arr_pair.push([key, obj[key]])
      }
    }

    return arr_pair || null;
  }

}