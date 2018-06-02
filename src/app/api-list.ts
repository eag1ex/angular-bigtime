
/**
 *  This file implements all APIS, and makes them available in the app, you can disable them individually
 *  you have to follow the schema for each object to make it work, follow already predefind apis as an example,
 *  The pre() method appends all the value requirements that are repeated on each object, to avoid repetition or mistakes,
 *  any values preset in the object will overite the pre();
 */



  //https://api.punkapi.com/v2/beers/?beer_name=cool_beer&page=1&per_page=5
var punkapi = {
  'enabled':true, // to enable this api, when its working :)
  'name': 'punkapi',
  'api': 'https://api.punkapi.com/v2',
  'prefix': 'beers',
  'apiURL': '',
  'query_params': {
    'page': 1,
    'per_page': 5,
    'beer_name': ''
  }
}

/**

https://api.flickr.com/services/rest/?api_key=1754e3e5724bd7c66c732b835083c8df&method=flickr.photos.search&tags=portrait%2Cmug&content_type=1&media=photos&extras=extras%3Durl_s%2Curl_m%2Cdate_upload%2Cdate_taken%2Cowner_name%2Clast_update%2Ctags%2Cviews%2Ctitle&format=json&nojsoncallback=1&orientation=square&per_page=10&page=1
 */
   
var flickr = {
  'enabled':true, // to enable this api, when its working :)
  'name': 'flickr',
  'apiURL': '',
  'api': 'https://api.flickr.com/services/rest',
  'api_key': '1754e3e5724bd7c66c732b835083c8df',
  'query_params': {
    'method': "flickr.photos.search",// flickr.photos.getPopular, flickr.photos.getFavorites                    
    'text': "",// what to search
    'tags': "portrait,mug",// returns byt reference tag
    'content_type': 1,
    'media': "photos",
    'extras': 'url_s,url_m,date_upload,date_taken,owner_name,last_update,tags,views,title',
    'format': "json",
    'nojsoncallback': 1,
    'orientation': "square", // image ratio
    'per_page': 100,
    'page': 1

  }
}


/**
 * GETTYIMAGES
https://api.gettyimages.com/swagger/ui/index

https://api.gettyimages.com/v3/search/images/creative/?file_types=jpg&graphical_styles=photography&license_models=royaltyfree&minimum_size=medium&sort_order=most_popular&fields=comp%2Cid%2Ctitle%2Ccollection_name%2Ccaption%2Cdetail_set%2Cartist%2Ccopyright%2Cdate_created&page=1&page_size=10

*/ 

var gettyimages = {
  'enabled':true, // to enable this api, when its working :)
  'name': 'gettyimages',
  'apiURL': '',
  'api': 'https://api.gettyimages.com/v3/search',
  'prefix':'images/creative',
  'header_params':true,
  'Api-Key': '734uv72r6de98em86u5rkwe5',
  'query_params': {   
    'file_types':'jpg',
    'graphical_styles':'photography',
    'license_models':'royaltyfree',  
    'minimum_size':'medium',
    'sort_order': 'most_popular',       
    'phrase': "",// what to search
    'fields': 'keywords,comp,id,title,collection_name,caption,detail_set,artist,copyright,date_created',// what to output
    'page_size': 20,// per page results
    'page': 1
  }
}


/**
 available params at: https://www.omdbapi.com/?apikey=86d5e34b&s=guardians&type=movie&r=json&page=2&plot=full
 i: A valid IMDb ID (e.g. tt1285016)
 t: movie title
 s: search
 plot: full
 type:movie, series, episode  < can choose only one per query
 page: page number to return
 per_page: NOT_AVAIALBLE ... hmm need to impement limits, but it returns 10 anyway, lets create limit anyway;
 */

var omdbapi = {
  'enabled':true, // to enable this api, when its working :)
  'name': 'omdbapi',
  'apiURL': '',
  'api': 'https://www.omdbapi.com',
  'apikey': '86d5e34b',
  'query_params': {
    'r':'json',
    'plot':'full',                 
    'type': 'movie',
    's': 'brure+lee', //what to search
    'page': 1,
    'i':'' //(e.g. tt1285016)
  }
}

// https://api.themoviedb.org/3/movie/550?api_key=1f346380dee2d7565baf4b508d050741



/**
 * NO YET INTEGRATED
 https://api.themoviedb.org/3/account/favorite/movies?api_key=<<api_key>>&language=en-US&sort_by=created_at.asc&page=1
how to generate session 
https://developers.themoviedb.org/3/authentication/how-do-i-generate-a-session-id
 */
var themoviedb = {
  'enabled':false, // to enable this api, when its working :)
  'name': 'themoviedb',
  'apiURL': '',
  'api': 'https://api.themoviedb.org/3/movie/550',
  'api_key': '1f346380dee2d7565baf4b508d050741',
  'query_params': {
    'r':'json',
    'plot':'full',                 
    'type': 'movie',
    's': 'brure+lee', //what to search
    'page': 1,
    'i':'' //(e.g. tt1285016)
  }
}


class Presets {
 
  pre(unset:any=false){

    var _pre =  {
        'enabled':false,
        'header_params':false,
        'prefix': false,
        'api_key': false,
        'token': false,
        'secret': false,
        'auth': false,
        'free': true,
    } 
    
    if(unset) delete _pre[unset];
    return _pre
  }
}

export class ApiList extends Presets{
constructor(){
  super();
}

/*
  /// in case the predefind api's are not available for current user, we need to validate output some how
  proposedList(){
    return ['punkapi','flickr', 'gettyimages','omdbapi'];
  }
*/

  list() {
    // set the order
    return [Object.assign(this.pre(),punkapi),
            Object.assign(this.pre(),flickr), 
            Object.assign(this.pre(),gettyimages),
            Object.assign(this.pre('api_key'/*unset*/),omdbapi)         
          ]}
  ///...
}

