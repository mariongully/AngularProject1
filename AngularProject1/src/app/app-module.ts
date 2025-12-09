
/**
 * Application Angular en mode standalone : ce fichier est conservé pour compatibilité
 * avec certains outils, mais l'app n'utilise PAS NgModule.
 *
 * Le bootstrap réel se fait via:
 *   - main.ts -> bootstrapApplication(App, appConfig)
 *   - app.config.ts -> providers & importProvidersFrom(...)
 *
 * NE PAS appeler bootstrapModule(AppModule) nulle part.
 */
export { };
