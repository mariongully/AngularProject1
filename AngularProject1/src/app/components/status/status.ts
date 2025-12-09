import { Component, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Instrument } from '../instrument-list/instrument-list';
import { RunQueueComponent } from '../run-queue/run-queue';
import '@agilent/awf-wc/icon';
import '@agilent/awf-wc/tab-panel';

@Component({
  selector: 'app-status',
  standalone: true,
  templateUrl: './status.html',
  styleUrls: ['../test-api/test-api.css', './status.css'],

  imports: [
    CommonModule,        
    RunQueueComponent    
  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StatusComponent {
  @Input() selectedInstrument: Instrument | null = null;
  @Input() modules: string[] = [];
  @Input() token = '';
}
