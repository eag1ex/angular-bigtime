import { Component, OnInit,Input,Output} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { BeersModel } from '../services/models';

@Component({
  selector: 'products',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})

export class ProductComponent implements OnInit {
  public indexPerRow:number = 0;
  public beersData:BeersModel[];
  public beersDataLoaded = false;

  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private dataService: DataService,
  ) {
  }
  //@Input() isIndex: boolean;

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
 
  ngOnInit() { this.getBeers(); }

  niceName(str){
    return (str) ? str.replace(/ /g,"_"):'';
  }
  updateIndex(inx){
    console.log('what is the uipdated index ',inx)
  }
  descLimit(str){
    return (str) ? str.substring(0, 100):'';
  }

  getBeers() {
    this.beersDataLoaded = false;
    console.log('Getting customers ...');

    // this.dataService.getCustomersP().then(  // Promise version
    this.dataService.getBeers().subscribe( // Observable version
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

