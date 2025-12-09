import { Component, EventEmitter, Input, Output, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
//import { ProjectInfo } from '../project-list/project-list';
import { CommonModule } from '@angular/common';
import { ProjectInfo } from '@agilent/ui-element/project-selection';

export interface Instrument {
  id?: number;
  name: string;
  globalId: string;
  instrumentState?: string;
  stateLoading?: boolean;
}

@Component({
  selector: 'app-instrument-list',
  templateUrl: './instrument-list.html',
  standalone: true,
  styleUrls: ['../test-api/test-api.css', 'instrument-list.css'],
  imports: [
    CommonModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InstrumentListComponent {
  @Input() instruments: Instrument[] = [];
  // Accept null from the parent to match TestApi.selectedProject (Project | null)
  @Input() selectedProject: ProjectInfo | null = null;
  @Output() connect = new EventEmitter<Instrument>();

  projects: ProjectInfo[] = [];

  // Maps instrumentState string to a CSS class (duplicate small helper for isolation)
  getStateClass(state?: string): string {
    if (!state) { return 'state-unknown'; }
    switch ((state || '').toLowerCase()) {
      case 'offline': return 'state-offline';
      case 'idle': return 'state-idle';
      case 'error': return 'state-error';
      case 'notready': return 'state-notready';
      case 'not ready': return 'state-notready';
      default: return 'state-unknown';
    }
  }

  onConnect(instrument: Instrument): void {
    this.connect.emit(instrument);
  }
}
