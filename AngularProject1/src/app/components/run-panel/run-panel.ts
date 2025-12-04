import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Instrument } from '../instrument-list/instrument-list';

export interface RunForm {
  resultPath: string;
  resultFileName: string;
  acquisitionMethod: string;
}

@Component({
  selector: 'app-run-panel',
  templateUrl: './run-panel.html',
  standalone: false,
  styleUrls: ['../test-api/test-api.css']
})
export class RunPanelComponent implements OnChanges {
  @Input() selectedInstrument: Instrument | null = null;
  @Input() initialResultPath = 'C:\\CDSProjects\\DataPlayerProject\\Results';
  @Input() initialResultFileName = 'test1';
  @Input() initialAcquisitionMethod = 'C:\\CDSProjects\\DataPlayerProject\\Methods\\dp.amx';
  @Input() runInProgress = false;
  @Input() token = '';
  @Output() runSubmit = new EventEmitter<RunForm>();

  resultPath = this.initialResultPath;
  resultFileName = this.initialResultFileName;
  acquisitionMethod = this.initialAcquisitionMethod;

  ngOnChanges(changes: SimpleChanges): void {
    // initialize local fields when parent provides defaults
    //if (changes.initialResultPath && !changes.initialResultPath.firstChange) {
    //  this.resultPath = this.initialResultPath;
    //}
    //if (changes.initialResultFileName && !changes.initialResultFileName.firstChange) {
    //  this.resultFileName = this.initialResultFileName;
    //}
    //if (changes.initialAcquisitionMethod && !changes.initialAcquisitionMethod.firstChange) {
    //  this.acquisitionMethod = this.initialAcquisitionMethod;
    //}
  }

  submit(): void {
    this.runSubmit.emit({
      resultPath: this.resultPath,
      resultFileName: this.resultFileName,
      acquisitionMethod: this.acquisitionMethod
    });
  }
}
