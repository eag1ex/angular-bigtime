
export class ApiList {
constructor(){}
  list() {
    return [{
      //
      'name': 'punkapi',
      'api': 'https://api.punkapi.com/v2',
      'prefix': 'beers',
       'apiURL':'', 
      'api_key': '',
      'token': '',
      'secret':'',
      'auth': false,
      'free': true,
      'query_params': {
        'page': 1,
        'per_page': 5,
        'beer_name': ''
      }
    },
    //
     {
      // https://www.flickr.com/services/api/flickr.photos.search.html
      'name': 'flickr',
      'apiURL':'', 
      'api': 'https://api.flickr.com/services/rest',
      'api_key': '1754e3e5724bd7c66c732b835083c8df',
      'secret':'',
      'prefix': '',
      'token': '',
      'auth': true,
      'free': true,
      'query_params':{
                'method': "flickr.photos.search",                        
                'text': "",
                'tags':"portrait,mug",
                'content_type': 1,
                'media': "photos",
                'extras': 'url_s',
                'format': "json",
                'nojsoncallback': 1,
                'orientation': "square",
                'per_page':250
      },
     
    }

  ]}
  ///...
}

