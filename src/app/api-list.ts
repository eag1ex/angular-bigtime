

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
    'method': "flickr.photos.search",// type of query from                        
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
https://api.gettyimages.com/v3/search/images?phrase=dogs&page=1&page_size=1&fields=comp,id,title,collection_name,caption,detail_set
 */

var gettyimages = {
  'enabled':true, // to enable this api, when its working :)
  'name': 'gettyimages',
  'apiURL': '',
  'api': 'https://api.gettyimages.com/v3/search',
  'prefix':'images',
  'header_params':true,
  'Api-Key': '734uv72r6de98em86u5rkwe5',
  'query_params': {                 
    'phrase': "",// what to search
    'fields': 'comp,id,title,collection_name,caption,detail_set,',// what to output
    'page_size': 20,// per page results
    'page': 1
  }
}



class Presets {
 
  pre(){
    return {
        'enabled':false,
        'header_params':false,
        'prefix': false,
        'api_key': false,
        'token': false,
        'secret': false,
        'auth': false,
        'free': true,
    }
  }
}

export class ApiList extends Presets{
constructor(){
  super();
}
  /// in case the predefind api's are not available for current user, we need to validate output some how
  proposedList(){
    return ['punkapi','flickr', 'gettyimages'];
  }

  list() {
    return [Object.assign(this.pre(),punkapi),Object.assign(this.pre(),flickr), Object.assign(this.pre(),gettyimages)]}
  ///...
}

