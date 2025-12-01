import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';

import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { TestApi } from './components/test-api/test-api.component';
import { InstrumentListComponent } from './components/instrument-list/instrument-list';
import { RunPanelComponent } from './components/run-panel/run-panel';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
//import '@agilent/awf-wc';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
//import { RunPanel } from './components/run-panel/run-panel';
//import { Instrument } from './components/instrument-list/instrument-list';

@NgModule({
  declarations: [
    App,
    TestApi,
    InstrumentListComponent,
    RunPanelComponent,
    //RunPanel,
    //Instrument
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
  ],
  bootstrap: [App],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
