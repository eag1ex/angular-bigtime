

  //https://api.punkapi.com/v2/beers/?beer_name=cool_beer&page=1&per_page=5
var punkapi = {

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
 https://api.flickr.com/services/rest/?api_key=1754e3e5724bd7c66c732b835083c8df&method=flickr.photos.search&tags=portrait,mug&content_type=1&media=photos&extras=url_s,url_m,date_upload,date_taken,owner_name,last_update,geo,tags,views&format=json&nojsoncallback=1&orientation=square&per_page=100&text=faces&page=5
 

https://api.flickr.com/services/rest/?api_key=1754e3e5724bd7c66c732b835083c8df&method=flickr.photos.search&tags=portrait%2Cmug&content_type=1&media=photos&extras=extras%3Durl_s%2Curl_m%2Cdate_upload%2Cdate_taken%2Cowner_name%2Clast_update%2Ctags%2Cviews%2Ctitle&format=json&nojsoncallback=1&orientation=square&per_page=10&page=1




 */
   
var flickr = {

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
    //media=photos&extras=url_s&format=json&nojsoncallback=1&orientation=square&per_page=100
  }
}

class Presets {
 
  pre(){
    return {
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
  list() {
    return [Object.assign(this.pre(),punkapi),Object.assign(this.pre(),flickr)]}
  ///...
}

