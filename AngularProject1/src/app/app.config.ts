
import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedTranslateModule } from '@agilent/common/i18n';
// Si tu utilises le Router standalone :
import { provideRouter } from '@angular/router';
//import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    //provideRouter(routes), // décommente si tu as défini des routes standalone

    // Modules basés sur NgModule, fournis via importProvidersFrom
    importProvidersFrom(
      HttpClientModule,
      FormsModule,
      TranslateModule.forRoot(),
      SharedTranslateModule.forRoot()
    ),

    // Si tu as besoin de gérer des Web Components (awf-*)
    // tu n'ajoutes pas schemas ici ; place plutôt CUSTOM_ELEMENTS_SCHEMA
    // sur le composant racine App (ou composants concernés).
  ],
}
