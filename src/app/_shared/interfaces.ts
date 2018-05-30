
import { Observable } from 'rxjs/Observable';
import { Models } from './services/models';
export interface IRouteName{
  user_id:any,
  parent_page?(flag: any) : boolean,
  search_by_name?(flag: any) : string,
  paged:any,
  singlePage:any,
  per_page: any, 
  originalName:any,
  searchAPI:any,
  header_params:any,
  perpage:any // or perpage
} 

export interface IMyGlobals{

  glob: {
          searchSubscription: any,
         'punkapi.data': any,
         'flickr.data':any,
         'gettyimages.data':any,
          APP_LOADED:any,
          current_page:string,
          selected_apiName:string
      },

   api_support:Array<any>,
   
   getData(data: any, params : any): Observable<Models[]>;

}


export interface IApiModel {
  name: string;
  api:string;
  apiURL:string;
  prefix:any;
  api_key:any; 
  apikey:any;
  secret:any;
  token:any;
  auth:boolean;
  free:boolean;
  query_params:object,
  header_params:boolean
  ///...
}


 export interface IbuildRespCall{
    url:string,
    error:any,
    message:any
  }
