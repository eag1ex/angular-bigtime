import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

    
  constructor(private _route: ActivatedRoute,
    private _router: Router) {
  }


  ngOnInit() {
  }

  goto(nr:number){
    if(nr==='' || nr===undefined) return;
     if(nr===0) nr = 1
    this._router.navigate(['/products'+'/'+nr]);
  }

}
