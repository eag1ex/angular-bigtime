
export class ApiList {
constructor(){}
  list() {
    return [{
      //https://api.punkapi.com/v2/beers/?beer_name=cool_beer&page=1&per_page=5
      'name': 'punkapi',
      'api': 'https://api.punkapi.com/v2',
      'prefix': 'beers',
      'apiURL':'', 
      'api_key': false,
      'token': false,
      'secret':false,
      'auth': false,
      'free': true,
      'query_params': {
        'page': 1,
        'per_page': 5,
        'beer_name': ''
      }
    },


/**
 https://api.flickr.com/services/rest/?api_key=1754e3e5724bd7c66c732b835083c8df&method=flickr.photos.search&tags=portrait,mug&content_type=1&media=photos&extras=url_s,url_m,date_upload,date_taken,owner_name,last_update,geo,tags,views&format=json&nojsoncallback=1&orientation=square&per_page=100&text=faces&page=5
 */
     {
 
      'name': 'flickr',
      'apiURL':'', 
      'api': 'https://api.flickr.com/services/rest',
      'api_key': '1754e3e5724bd7c66c732b835083c8df',
      'secret':'',
      'prefix': false,
      'token': false,
      'auth': true,
      'free': true,
      'query_params':{
                'method': "flickr.photos.search",// type of query from                        
                'text': "",// what to search
                'tags':"portrait,mug",// returns byt reference tag
                'content_type': 1,
                'media': "photos",
                'extras': 'extras=url_s,url_m,date_upload,date_taken,owner_name,last_update,tags,   views',
                'format': "json",
                'nojsoncallback': 1,
                'orientation': "square", // image ratio
                'perpage':250,
                'page':1
                //media=photos&extras=url_s&format=json&nojsoncallback=1&orientation=square&per_page=100
      },
     
    }

  ]}
  ///...
}

