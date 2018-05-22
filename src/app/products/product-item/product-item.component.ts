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
    pageName: 'single-product'
  }

  productData: BeersModel;
  productdataPairs: any = false;

  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private _globals: MyGlobals) {

    _globals.glob.current_page = this.PAGE_DEFAULTS.pageName;

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

      // update title
      this.PAGE_DEFAULTS.pageTitle = this.PAGE_DEFAULTS.pageTitle + ' | ' + this.productData.name;
      
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