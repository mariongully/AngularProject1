import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Instrument } from '../instrument-list/instrument-list';
import { Project } from '../project-list/project-list';

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
  @Input() selectedProject: Project | null = null;
  @Input() selectedInstrument: Instrument | null = null;
  @Input() token = '';
  @Output() runSubmit = new EventEmitter<RunForm>();

  runInProgress = false;;

  // Champs dérivés
  resultPath: string = '';
  resultFileName = 'test1';
  acquisitionMethod: string = '';


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
}
