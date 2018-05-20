import { Component, OnInit,Input,Output} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../_shared/services/data.service';
import { LoggerService } from '../_shared/services/logger.service';
import { BeersModel } from '../_shared/services/models';

@Component({
  selector: 'products',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})

export class ProductComponent implements OnInit {
  public indexPerRow:number = 0;
  public beersData:BeersModel[];
  public beersDataLoaded = false;
  public routeName:any;
  public PAGE_DEFAULTS = {
    perPage:10,
    paged:10,
    currentPaged:1
  }

  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private dataService: DataService,
    private logger:LoggerService
  ) {
  }

  

  goto(nr: any) {

    if (nr === '' || nr === undefined) return;
    if (nr === 0) nr = 1
    this._router.navigate(['/products' + '/' + nr]);
  }
  
  getIndex(i){
    var perRow = 4;
    this.indexPerRow = i;
  //  console.log('current indexPerRow',this.indexPerRow)
   
  }
 
   fetchEvent(): Promise<object> {
     var paged:any = this._route.snapshot.paramMap.get('paged');
     paged = (paged)? {paged}:false;    
     var singlePage:any = this._route.snapshot.paramMap.get('id');
     singlePage = (singlePage)? {singlePage}:false;
     var parent_page = {parent_page:true};

     var whichOrder = paged||singlePage||parent_page||false;
     return (whichOrder) ? Promise.resolve(whichOrder):Promise.reject('param are null!');
 }

 gotoPaged(nr:any){
   if(nr){
     
     this.routeName = {paged:parseInt(nr)};
     this.PAGE_DEFAULTS.currentPaged =nr;

     this.getBeers(this.routeName);
   }else{
     this.getBeers(false);
   }
 }

  ngOnInit() {
     //PAGE_DEFAULTS
  
   /// get page param  
    this.fetchEvent().then((whichOrder:any)=>{
      if(whichOrder===false){
        return Promise.reject('no route found!');
      }
      if(whichOrder.paged){
        this.PAGE_DEFAULTS.currentPaged =parseInt(whichOrder.paged);
      }
    
      this.routeName = whichOrder;
      this.getBeers(this.routeName);

    },(err)=>{
      this.logger.log(err,true)
      this.routeName=false;
      this.getBeers(this.routeName);
    })
  }


  niceName(str){
    return (str) ? str.replace(/ /g,"_"):'';
  }
  updateIndex(inx){
    console.log('what is the uipdated index ',inx)
  }
  descLimit(str){
    return (str) ? str.substring(0, 100):'';
  }

  getBeers(routeName:any) {
    this.beersDataLoaded = false;
    console.log('Getting beers ...');

       var params:any = {
         perPage:this.PAGE_DEFAULTS.perPage
       }
      
      if(routeName.parent_page){
        params.parent_page = routeName.parent_page;
       // we are all good, already set defaults
        console.log('we are at parent_page')
      }  

      else if(routeName.paged){
        params.paged = routeName.paged;   
      }

      else if(routeName.singlePage){
        params.byName = routeName.singlePage
        delete params.perPage;
      }else{
         this.logger.log('no singlePage or paged params defind',true)
        this.beersDataLoaded = null;
        return false
      }
     

    this.dataService.getBeers(params).subscribe( // Observable version
      data => {
        this.beersDataLoaded = true;
        console.log('got data from this.dataService.getBeers',data)
       this.beersData = data;
      },
      (errorMsg: string) => {
        this.beersDataLoaded = null;
        console.error(errorMsg); // Don't use alert!
      }
    );
  }

}

