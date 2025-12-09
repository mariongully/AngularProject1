import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Instrument } from '../instrument-list/instrument-list';
//import { ProjectInfo } from '../project-list/project-list';
import { ProjectInfo } from '@agilent/ui-element/project-selection';
import '@agilent/awf-wc/button';
import '@agilent/awf-wc/input-text';
import { FileSelectorComponent } from '@agilent/ui-element/file-selector';

export interface RunForm {
  resultPath: string;
  resultFileName: string;
  acquisitionMethod: string;
}

@Component({
  selector: 'app-run-panel',
  templateUrl: './run-panel.html',
  standalone: true,
  styleUrls: ['../test-api/test-api.css', '../instrument-list/instrument-list.css'],
  imports: [
    CommonModule, FileSelectorComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RunPanelComponent implements OnChanges {
  @Input() selectedProject: ProjectInfo | null = null;
  @Input() selectedInstrument: Instrument | null = null;
  @Input() token = '';
  @Output() runSubmit = new EventEmitter<RunForm>();

  runInProgress = false;;

  // Champs dérivés
  resultPath: string = '';
  resultFileName = 'test1';
  acquisitionMethod: string = '';
  filteredTypesAcqMethod: string[] = ['.amx'] 
  AcquisitionMethod: string = "Acquisition Method";

  ngOnChanges(): void {
    const projectName = this.selectedProject?.name ?? null;
    this.resultPath = projectName ? `C:\\CDSProjects\\${projectName}\\Results` : '';
    this.acquisitionMethod = projectName ? `C:\\CDSProjects\\${projectName}\\Methods\\dp.amx` : '';
  }


  submit(): void {
    this.runSubmit.emit({
      resultPath: this.resultPath,
      resultFileName: this.resultFileName,
      acquisitionMethod: this.acquisitionMethod
    });
  }

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
}
