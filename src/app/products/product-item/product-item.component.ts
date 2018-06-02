import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BeersModel, FlickrPhotoModel,OmdbapiModel, GettyImages } from '../../_shared/services/models';
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

  productData: FlickrPhotoModel & OmdbapiModel & GettyImages & BeersModel;
  productdataPairs: any = false;

  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private _globals: MyGlobals) {

    _globals.glob.current_page = this.PAGE_DEFAULTS.pageName;   
    this.PAGE_DEFAULTS.pageTitle = "product: "+_globals.glob.selected_apiName;
    ///find page reference against our apiList, in case we reload the page and the data is coming from local storage
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
      this.productData = this.sortData(()=>{
          this.productdataPairs = this.generateKeyArray(this.productData);
      },this.productData);

      // update title
      this.PAGE_DEFAULTS.pageTitle = this.PAGE_DEFAULTS.pageTitle + ' | ' + this.productData.name;
           
    
    } else {
      this.productdataPairs = null;
      this._router.navigate(['/products']);
    }

  }

  /**
   * manage the data output to the pagem we have few api with different model data's
   * we need to return same output for all
   * @param genarete_CB 
   * @param productData 
   */
  sortData(genarete_CB,productData){

    // generate pairs initially before data sort, so we gate original output!  
    genarete_CB();
  
      if(!productData.image_url ){
         productData.image_url = productData.url_m || productData.url_s || productData.Poster;
      }

       productData.name  = productData.name|| productData.title || productData.Title|| productData.ownername;

       if(!productData.tagline ){
        productData.tagline =productData.tags;
      }

      if(!productData.description ){
         productData.description = productData.title;
      }

      // return image image_url instead
      if(productData.display_sizes ){

        var image_url = productData.display_sizes.reduce((outp, item,inx)=>{
              if(item.name=='comp'){
                outp.push(item.uri);
              }
          return outp
        },[])[0] || false;

        if(image_url){
          delete productData.display_sizes;
          productData.image_url = image_url;
        }         

      }
     return productData;   
  }

  /**
   * turn our model data in to [key, val,] pairs for nice json output with nested objects
   * @param obj 
   */
  generateKeyArray(obj: object) {
    var arr_pair = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        arr_pair.push([key, obj[key]])
      }
    }
    return arr_pair || null;
  }

};