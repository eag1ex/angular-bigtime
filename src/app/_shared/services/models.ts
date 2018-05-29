
export class BeersModel { //punkapi single output
  // BeersModel single item output
  id: number;
  name: string;
  tagline: string;
  first_brewed:string;
  description:string;
  image_url:string;
  ///...
}
 
export class FlickrPhotoModel {
    // in flickr.photos.search
  //  photos:{
  //    page:number;
//     pages:number;
//      total:number;
    //  photo:[{
        id:string;
        title:string;
        ownername:string;
        tags:string;
        url_s:string;
        url_m:string;
   //   }]
  //  }
}

 
export class GettyImages {

        id:string;
        title:string;
        artist:string;
        caption:string;
        collection_name:string;
        date_created:string;
        display_sizes:Array<{name,uri}>;

}



class pair1 extends BeersModel{
  constructor(){
    super();
  }
}

class pair2 extends pair1{
  constructor(){
    super();
  }
}

class pair3 extends pair2{
  constructor(){
    super();
  }
}

export class Models extends pair3{
  constructor(){
    super();
  }
}


//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
/**
 * // FlickrModel single item output
 {
    "photos": {
        "page": 1,
        "pages": 480019,
        "perpage": 1,
        "total": "480019",
        "photo": [
            {
                "id": "41460977975",
                 "dateupload": "1526698056",
                "lastupdate": "1526699078",
                "datetaken": "2018-05-18 19:44:54",
                "owner": "143239797@N06",
                "title": "Lycoris Radiata",
                "ownername": "Fran Tambasco",
                "tags": "she portrait face softportrait visage",

                "url_s": "https://farm2.staticflickr.com/1723/41460977975_5f0c820776_m.jpg",
                "height_s": "240",
                "width_s": "240",
                "url_m": "https://farm1.staticflickr.com/823/27327193877_7a06d91b86.jpg",
                "height_m": "500",
                "width_m": "500"
            }
        ]
    },
    "stat": "ok"
}
 */


//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

/*
 // BeersModel single item output
[
  {
    "id": 1,
    "name": "Buzz",
    "tagline": "A Real Bitter Experience.",
    "first_brewed": "09/2007",
    "description": "A light, crisp and bitter IPA brewed with English and American hops. A small batch brewed only once.",
    "image_url": "https://images.punkapi.com/v2/keg.png",
    "abv": 4.5,
    "ibu": 60,
    "target_fg": 1010,
    "target_og": 1044,
    "ebc": 20,
    "srm": 10,
    "ph": 4.4,
    "attenuation_level": 75,
    "volume": {
      "value": 20,
      "unit": "liters"
    },
    "boil_volume": {
      "value": 25,
      "unit": "liters"
    },
    "method": {

      "mash_temp": [
        {
          "temp": {
            "value": 64,
            "unit": "celsius"
          },
          "duration": 75
        }
      ],
      "fermentation": {
        "temp": {
          "value": 19,
          "unit": "celsius"
        }
      },
      "twist": null
    },

    "ingredients": {
      "malt": [
        {
          "name": "Maris Otter Extra Pale",
          "amount": {
            "value": 3.3,
            "unit": "kilograms"
          }
        },
        {
          "name": "Caramalt",
          "amount": {
            "value": 0.2,
            "unit": "kilograms"
          }
        },
        {
          "name": "Munich",
          "amount": {
            "value": 0.4,
            "unit": "kilograms"
          }
        }
      ],
      "hops": [
        {
          "name": "Fuggles",
          "amount": {
            "value": 25,
            "unit": "grams"
          },
          "add": "start",
          "attribute": "bitter"
        },
        {
          "name": "First Gold",
          "amount": {
            "value": 25,
            "unit": "grams"
          },
          "add": "start",
          "attribute": "bitter"
        },
        {
          "name": "Fuggles",
          "amount": {
            "value": 37.5,
            "unit": "grams"
          },
          "add": "middle",
          "attribute": "flavour"
        },
        {
          "name": "First Gold",
          "amount": {
            "value": 37.5,
            "unit": "grams"
          },
          "add": "middle",
          "attribute": "flavour"
        },
        {
          "name": "Cascade",
          "amount": {
            "value": 37.5,
            "unit": "grams"
          },
          "add": "end",
          "attribute": "flavour"
        }
      ],
      "yeast": "Wyeast 1056 - American Ale™"
    },

    "food_pairing": [
      "Spicy chicken tikka masala",
      "Grilled chicken quesadilla",
      "Caramel toffee cake"
    ],
    "brewers_tips": "The earthy and floral aromas from the hops can be overpowering. Drop a little Cascade in at the end of the boil to lift the profile with a bit of citrus.",
    "contributed_by": "Sam Mason <samjbmason>"
  }
]
*/



//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

/**
 GETTYIMAGES, single output

{
    "result_count": 334770,
    "images": [
        {
            "id": "847116840",
            "allowed_use": {
                "how_can_i_use_it": "Available for all permitted uses under our |License Terms|.",
                "release_info": "No release required",
                "usage_restrictions": []
            },
            "artist": "kiszon pascal",
            "asset_family": "creative",
            "call_for_image": false,
            "caption": "portrait of an happy old french bulldog smiling and looking at camera . .",
            "collection_code": "FKF",
            "collection_id": 348,
            "collection_name": "Moment",
            "copyright": "pascal kiszon",
            "date_created": "2017-09-12T00:00:00Z",
            "display_sizes": [
                {
                    "is_watermarked": true,
                    "name": "comp",
                    "uri": "https://media.gettyimages.com/photos/portrait-of-a-happy-old-french-bulldog-looking-at-camera-picture-id847116840?b=1&k=6&m=847116840&s=612x612&h=qkU8RseN1O-9UasfmJq8FdHcpULSLeEfHEfh9CwlfWc="
                },
                {
                    "is_watermarked": true,
                    "name": "preview",
                    "uri": "https://media.gettyimages.com/photos/portrait-of-a-happy-old-french-bulldog-looking-at-camera-picture-id847116840?b=1&k=6&m=847116840&s=170667a&h=LjuG2GiMGhhosGCwrm9GO2SHKsJ7CNaeJfFBLis_bck="
                },
                {
                    "is_watermarked": false,
                    "name": "thumb",
                    "uri": "https://media.gettyimages.com/photos/portrait-of-a-happy-old-french-bulldog-looking-at-camera-picture-id847116840?b=1&k=6&m=847116840&s=170x170&h=9z4MzDRQMoTRn3R3yIR9-RnVTetplxDVbeOYS1VahLk="
                }
            ],
            "editorial_segments": [],
            "event_ids": [],
            "graphical_style": "photography",
            "license_model": "royaltyfree",
            "max_dimensions": {
                "height": 4000,
                "width": 6000
            },
            "orientation": "Horizontal",
            "product_types": [],
            "quality_rank": 3,
            "referral_destinations": [
                {
                    "site_name": "gettyimages",
                    "uri": "http://www.gettyimages.com/detail/photo/portrait-of-a-happy-old-french-bulldog-looking-at-royalty-free-image/847116840"
                }
            ],
            "title": "portrait of a happy old french bulldog looking at camera . ."
        }
    ]
}



 */