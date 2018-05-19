import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeModule } from './home/home.module';
import { ProductComponent } from './products/product.component';
import { ProductModule } from './products/product.module';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductComponent
  ],
  imports: [
    HttpClientModule,
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }