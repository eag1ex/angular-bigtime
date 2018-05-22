
// angular modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';


// app modules

import { SharedModule } from './_shared/shared.module';


// app components
import { AppComponent } from './app.component';
import { ProductComponent } from './products/product.component';
import { SharedComponent } from './_shared/shared.component';
import { ProductModule } from './products/product.module';

import { ProductItemComponent } from './products/product-item/product-item.component';

// pipes
import { PipeNumber } from './_shared/pipe.number';
import { SearchPipe } from './_shared/pipe.search';

// directives
import { PageTitleDirective } from './_shared/directives/directives';
import { indexChangeDirective } from './_shared/directives/directives';
import { SearchInputDirective } from './_shared/directives/searchInput.directive';

// services
import { MyGlobals } from './_shared/myglobals';
import { DataService } from './_shared/services/data.service';
import { LoggerService } from './_shared/services/logger.service';
import { EventEmitService } from './_shared/services/eventEmmiter.service';
import { TransactionResolver } from './_shared/services/transaction.resolver';
import { LocalStorageService } from './_shared/services/local-storage.service';


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
    ProductItemComponent
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
      {
        path: 'app', component: AppComponent,
      },
      { path: 'app', redirectTo: 'products', pathMatch: 'full' },
      { path: '**', redirectTo: 'products', pathMatch: 'full' }

    ]),

    ProductModule
  ],

  providers: [MyGlobals, LoggerService, LocalStorageService, TransactionResolver, DataService, EventEmitService],
  bootstrap: [AppComponent]
})
export class AppModule { }