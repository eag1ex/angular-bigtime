
export interface IRouteName{
  parent_page?(flag: any) : boolean,
  search_by_name?(flag: any) : string,
  paged:number,
  singlePage:any,
  per_page: any, 
  originalName:any,
  perpage:any // or perpage
} 