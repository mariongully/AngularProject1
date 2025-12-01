import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';

import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { TestApi } from './components/test-api/test-api.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
//import '@agilent/awf-wc';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  declarations: [
    App,
    TestApi,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    
    //importProvidersFrom(TranslateModule.forRoot(), SharedTranslateModule.forRoot())
  ],
  bootstrap: [App],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
