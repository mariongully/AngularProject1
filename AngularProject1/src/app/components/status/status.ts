import { Component, Input } from '@angular/core';
import { Instrument } from '../instrument-list/instrument-list';

@Component({
  selector: 'app-status',
  standalone: false,
  templateUrl: './status.html',
  styleUrls: ['../test-api/test-api.css', './status.css']
})
export class StatusComponent {
  @Input() selectedInstrument: Instrument | null = null;
  @Input() token = '';
}
