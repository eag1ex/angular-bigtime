import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
//import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http'; 
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeModule } from './home/home.module';
import { ProductComponent } from './products/product.component';
import { ProductModule } from './products/product.module';
import { HomeComponent } from './home/home.component';
import {DataService} from './services/data.service';
import { LoggerService } from './services/logger.service';
import { indexChangeDirective } from './services/directives';


@NgModule({
  declarations: [
    AppComponent,
    ProductComponent,
    indexChangeDirective
  ],
  imports: [
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
      { path: 'app', redirectTo: 'home', pathMatch: 'full'},
      { path: '**', redirectTo: 'home', pathMatch: 'full'}
 
    ]),
    HomeModule,
    ProductModule
  ],

   providers: [
    DataService,
    LoggerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }