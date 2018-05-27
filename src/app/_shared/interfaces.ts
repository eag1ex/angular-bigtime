
import { Observable } from 'rxjs/Observable';
import { Models } from './services/models';
export interface IRouteName{
  parent_page?(flag: any) : boolean,
  search_by_name?(flag: any) : string,
  paged:number,
  singlePage:any,
  per_page: any, 
  originalName:any,
  perpage:any // or perpage
} 

export interface IMyGlobals{
  glob: {
          searchSubscription: any,
          beers: any,
          APP_LOADED:any,
          current_page:string,
      },
   api_support:Array<any>,
   getData(data: any, params : any): Observable<Models[]>;

}