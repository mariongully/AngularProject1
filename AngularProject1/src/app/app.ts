
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

// Importe les composants standalone utilisés directement dans le template d'App
import { TestApi } from './components/test-api/test-api.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, // pour *ngIf/*ngFor si utilisés dans app.html
    TestApi,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // utile pour tes web components (awf-*)
})
export class App { };
