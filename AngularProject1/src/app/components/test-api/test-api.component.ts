import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { InstrumentService } from '../../services/instrument.service';
import '@agilent/awf-wc/button';
import '@agilent/awf-wc/input-text';

@Component({
  selector: 'app-test-api',
  templateUrl: './test-api.html',
  standalone:false,
  styleUrls: ['./test-api.css'],
})
export class TestApi {
  isLoading = false;
  message = '';
  token = '';
  instruments: { name: string; globalId: string }[] = [];

  constructor(
    private authService: AuthService,
    private instrumentService: InstrumentService
  ) { }

  start(): void {
    this.isLoading = true;
    this.message = 'Connexion en cours...';

    this.authService.login().subscribe({
      next: (rawToken: string) => {
        this.token = rawToken.replace(/"/g, '');
        this.message = 'Connexion réussie. Récupération des instruments...';

        this.instrumentService.getInstruments(this.token).subscribe({
          next: (data) => {
            this.instruments = data.instruments.map((i: any) => ({
              name: i.name,
              globalId: i.globalId
            }));
            this.message = `${this.instruments.length} instrument(s) trouvé(s).`;
            this.isLoading = false;
          },
          error: (err) => {
            this.message = 'Erreur lors de la récupération des instruments.';
            this.isLoading = false;
            console.error(err);
          }
        });
      },
      error: (err) => {
        this.message = 'Erreur lors de la connexion.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  connectInstrument(instrument: { name: string; globalId: string }): void {
    this.message = `Connexion à l'instrument "${instrument.name}"...`;

    this.instrumentService.initializeInstrument(instrument.globalId, this.token).subscribe({
      next: (res) => {
        this.message = `Instrument "${instrument.name}" initialisé avec succès.`;
        console.log('Réponse :', res);
      },
      error: (err) => {
        this.message = `Erreur lors de la connexion à "${instrument.name}".`;
        console.error(err);
      }
    });
  }
}
