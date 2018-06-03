# Picky ( BigTime Search API ()  
#### - [ Developed by Eaglex ](http://eaglex.net)

* This is a premium product, under license, and not for distribution.
#### DESCRIPTION
This is an advanced API Search application which allows to integrade dynamic Restful/API using only client with Angular 6 and (Angular CLI 6). Currently it supports `PunkAPI`, `Getty Images API`, `Flickr API`, and  `OMDB API (Movie DB)`. It can be extended to any number of new image type Restful/API's, and non image for data reference. There are two pages, main products page which can toggle apis,  and the product-itme/single page which lists all of item values in json format.

It has a localstorage integration for any subsequent views to the same page/query. 
API's have feature's to display random results uppon every load. You can filter thru the results, and search the live API as well > then filter thru it. `Please read more about the details below.!`

* Important: You need to register your own api keys to use in development, and purchase for production. 
Demo dev site will be available soon for you to test/run without any registration required. 


#### flickr
Flickr is social media for sharing free/images and selling artwork/images. You can search for different types of artwork in different sizes using their custom filters. 

#### Getty Images
Getty Images is a well known payed service for buying best images you can find, search for all size/type/shape  with custom filters.

#### OMBD API Movie DB
OMBD Is a movie data base where you can search for all generes and type: movie/tv series, and by `imdbID` << from imDB database.


#### PunkAPI
PunkAPI is a fake beer product search API, good for all kinds of testing.


##### INSTALL NEW Angular 6 CLI, and install angular-picky-bigtime!

```
#!python
$/ npm uninstall -g @angular/cli # remove old
$/ npm cache verify # clear cache 
$/ npm install -g @angular/cli@next # latest 

$/ npm install # from the application dir
$/ npm rebuild node-sass # from the application dir
```
* After installing run ^`npm rebuild node-sass`
* and have a look at the `engine` requirements in `package.json`, for any issues;

 
##### OPTIONAL I THINK...
```
#!python
$/ gem update --system
$/ gem install compass
```
* im not sure if installing compass is required since im using node_modules package;


#### NG CODE
```
#!python
$/ ng new PROJECT-NAME # NEED TO INSTALL ANGULAR CLI 6, FIRST!
$/ ng g component new-cmp # new component
$/ ng g module new-mod # new module
$/ ng g service new-service # new service
```


#### START THE APP
```
#!python
$/ npm start # alternativly `ng serve`
```


* open you browser in `http://localhost:4200` 
* sometimes node.js will lock the port, you need to kill it with `taskkill /f /im node.exe` or linux `killall node`


#### API DOCUMENTATION
*  flickr API: `https://www.flickr.com/services/developer/api/` << you need account and api_key to enable flickr for your development purpouses only, need to purchase license to use in production!
*  punkapi: `https://punkapi.com/documentation/v2` << it is free to use, but it has timeout limits, which it will show you.
*  gettyimages API: `https://api.gettyimages.com/swagger/ui/index` and `https://api.gettyimages.com/swagger/ui/index` << you need account and Api-Key to enable gettyimages for your development purpouses only, need to purchase license to use in production!
* OMBD API Movie DB: `https://www.omdbapi.com`  << you need account and apikey to enable omdbapi for your development purpouses only, im not sure about the specifics of the production license, you have to enquire about it your self

#### TECHNOLOGY/STACK
* Bootstrap 4 `https://getbootstrap.com/`
* Angular 6 CLI `https://github.com/angular/angular-cli`
* Compass/Sass `http://compass-style.org/reference/compass/`
* RXJS,SASS/COMPASS, Bootstrap 4, Jquery Light, Lodash, LocalStorage (management, smart storage), Rest API, API-MANAGER, api dynamic integration, dynamic routes
* GettyImages, Flickr, OMBD >> Restful/API client integration, HTTP/As Observalbe, 
* Model Interfaces, API/ Model decorators, data Model decorators, error mock validation
* Live Search, filter Search
* Services: IX/UX animation, @angular/animations, TransactionResolver (product-item data resolver), event emmiters, global services
* @pipe's/filters 
* Progresive modular integration.


#### APP HIERARCHY
```
#!python
    <<<< declaration of services at [AppModule] level;
    [AppComponent] >> < SearchInputDirective > < EventEmitService > < MyGlobals >
        [ProductComponent] >> < ApiManagerService >< DataService > < LocalStorageService > < EventEmitService > < MyGlobals >
            [ProductItemComponent] >> < TransactionResolver > < MyGlobals >

     SASS > all styles live in scss dir.       

```

#### TESTED :)
* Tested and works on Firefox and Chrome/Safari, ( Dont care about IE, but should work fine)
* Runs on all 6, ready to go.

#### TODOS

* integrate script barrel, for easy loading!
* Integrade WebWorkers to streamline style loading, `ng eject` not avaialbe to create webpack.config as yet.


#### (Bugs)
* angular 6 cli when starling for the first time, `` > it is due to dynamic RouterModule.forChild [...] > will integrate an import this should fix the issue.

#### FINAL THOUGHTS
* Let me know your professional feedback, its always welcome.
* Thank you, have fun with it.





**********************
*
*
*
*
*
*
## Angular CLI V 6.0

********************************
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

********************************
