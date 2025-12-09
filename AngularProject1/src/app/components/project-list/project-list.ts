import { Component, EventEmitter, Input, Output, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectSelectionComponent } from '@agilent/ui-element/project-selection';
import { ProjectInfo } from '@agilent/ui-element/project-selection';

//export interface ProjectInfo {
//  id?: number;
//  name: string;
//  globalId: string;
//  description: string;
//  groupId: string;
//}

@Component({
  selector: 'app-project-list',
  standalone: true,
  templateUrl: './project-list.html',
  styleUrls: ['./project-list.css', '../test-api/test-api.css'],
  imports: [
    CommonModule, ProjectSelectionComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProjectListComponent {
  @Input() projects: ProjectInfo[] = [];
  @Input() selectedProject: ProjectInfo | null = null;
  @Output() select = new EventEmitter<ProjectInfo>();

  onSelect(project: ProjectInfo): void {
    this.select.emit(project);
  }

  projectSelected(project: ProjectInfo): void {
    this.selectedProject = project;
    this.select.emit(project);
  }


  isSelected(p: ProjectInfo) {
    return !!this.selectedProject && this.selectedProject.id === p.id;
  }


  //isSelected(project: ProjectInfo): boolean {
  //  if (!this.selectedProject) return false;
  //  // Prefer numeric id comparison when available, otherwise compare globalId
  //  if (typeof project.id === 'number' && typeof this.selectedProject.id === 'number') {
  //    return project.id === this.selectedProject.id;
  //  }
  //  return project.id === this.selectedProject.id;
  //}
}
