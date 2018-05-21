
// angular modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule }    from '@angular/http'; 
import { RouterModule } from '@angular/router';


// app modules
import { HomeModule } from './home/home.module';
import { SharedModule } from './_shared/shared.module';


// app components
import { AppComponent } from './app.component';
import { ProductComponent } from './products/product.component';
import { SharedComponent } from './_shared/shared.component';
import { ProductModule } from './products/product.module';
import { HomeComponent } from './home/home.component';


// pipes
import { PipeNumber } from './_shared/pipe.number';
import { SearchPipe } from './_shared/pipe.search';

// directives
import { PageTitleDirective } from './_shared/directives/directives';
import { indexChangeDirective } from './_shared/directives/directives';
import { SearchInputDirective } from './_shared/directives/searchInput.directive';

// services
import { Globals } from './_shared/Globals';
import { DataService } from './_shared/services/data.service';
import { LoggerService } from './_shared/services/logger.service';
import { EventEmitService } from './_shared/services/eventEmmiter.service';


@NgModule({
  declarations: [
    AppComponent,
    SharedComponent,
    indexChangeDirective,
    SearchInputDirective,
    SearchPipe,
    PageTitleDirective,
    PipeNumber, 
    ProductComponent, 
  ],
  imports: [
    // custom modules
    SharedModule,

    // angular modules
    HttpClientModule,
    HttpModule,
    FormsModule,
    BrowserModule,
      RouterModule.forRoot([
        { path: 'app', component: AppComponent ,
     //   children: [
    //        { path: 'welcome', component: WelcomeComponent },
          //  { path: 'home', component: HomeComponent },
     //   ]
      },
      { path: 'app', redirectTo: 'products', pathMatch: 'full'},
      { path: '**', redirectTo: 'products', pathMatch: 'full'}
 
    ]),
    HomeModule,
    ProductModule
  ],

   providers: [Globals,LoggerService,DataService,EventEmitService],
  bootstrap: [AppComponent]
})
export class AppModule { }