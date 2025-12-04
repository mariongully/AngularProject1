import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';

import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { TestApi } from './components/test-api/test-api.component';
import { InstrumentListComponent } from './components/instrument-list/instrument-list';
import { RunPanelComponent } from './components/run-panel/run-panel';
import { RunQueueComponent } from './components/run-queue/run-queue';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import '@agilent/awf-wc';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ProjectListComponent } from './components/project-list/project-list';
import { StatusComponent } from './components/status/status';

@NgModule({
  declarations: [
    App,
    TestApi,
    InstrumentListComponent,
    RunPanelComponent,
    RunQueueComponent,
    ProjectListComponent,
    StatusComponent,
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
