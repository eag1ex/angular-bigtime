# Angular 6 BigTime


#### DESCRIPTION
This is a simple but cool application for retrieving Beer information and details. It consists of Product page and Product Detail, it is integrated with a search feature to search LIVE `punkapi.com API` by 'beer_name' and stores any subsequent call in LocalStorage! The app uses ^^Angular 6 CLI^^ along with Bootstrap 4 an Compass.


##### INSTALL NEW Angular 6 CLI and install angular-bigtime!
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
#!python
$/ gem update --system
$/ gem install compass
```
* im not sure is installing compass is required since im using node_modules package;


#### API DOCUMENTATION
#!python
$/ ng new PROJECT-NAME # NEED TO INSTALL ANGULAR CLI 6, FIRST!
$/ ng g component new-cmp # new component
$/ ng g module new-mod # new module
$/ ng g service new-service # new service

```


#### START THE APP
#!python
$/ npm start # alternativly `ng serve`
```

* open you browser in `http://localhost:4200` 
* sometimes node.js will lock the port, you need to kill it with `taskkill /f /im node.exe` or linux `killall node`


#### API DOCUMENTATION
*  how to implement punkapi.com: `https://punkapi.com/documentation/v2`
*  example: `https://api.punkapi.com/v2/beers?page=2&per_page=80`



#### TECHNOLOGY/STACK
* Bootstrap 4 `https://getbootstrap.com/`
* Angular 6 CLI `https://github.com/angular/angular-cli`
* Compass/Sass `http://compass-style.org/reference/compass/`
* RXJS,SASS/COMPASS, Bootstrap 4, Jquery, Lodash, LocalStorage, Rest API


#### TESTING
* Tested and works on Firefox and Chrome/Safari, ( Dont care about IE, but should work fine)


#### TODOS
* Integrade more API solutions for testing.
* Add page login


#### FINAL THOUGHTS
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
