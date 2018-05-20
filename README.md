# AngularBigtime





## Angular CLI 6, how to:

##### INSTALL NEW Angular CLI 6!
#!python
$/ npm uninstall -g @angular/cli # remove old
$/ npm cache verify # clear cache 
$/ npm install -g @angular/cli@next # latest 
```

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
* open you browser in `localhost:4200` 
* sometimes node.js will lock the port, you need to kill it with `taskkill /f /im node.exe` or linux `killall node`


#### API DOCUMENTATION
*  how to implement punkapi.com: `https://punkapi.com/documentation/v2`
*  example: `https://api.punkapi.com/v2/beers?page=2&per_page=80`


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
