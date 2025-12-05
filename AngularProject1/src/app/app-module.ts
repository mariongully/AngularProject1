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
import '@agilent/ui-template';
import '@agilent/ui-element';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ProjectListComponent } from './components/project-list/project-list';
import { StatusComponent } from './components/status/status';

import { SharedTranslateModule } from '@agilent/common/i18n';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

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

    importProvidersFrom(TranslateModule.forRoot(), SharedTranslateModule.forRoot())
  ],
  bootstrap: [App],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
