import { Component, EventEmitter, Input, Output } from '@angular/core';

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
  standalone: false,
  styleUrls: ['../test-api/test-api.css']
})
export class InstrumentListComponent {
  @Input() instruments: Instrument[] = [];
  @Output() connect = new EventEmitter<Instrument>();

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
