import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface Project {
  id?: number;
  name: string;
  globalId: string;
}

@Component({
  selector: 'app-project-list',
  standalone: false,
  templateUrl: './project-list.html',
  styleUrls: ['./project-list.css', '../test-api/test-api.css']
})
export class ProjectListComponent {
  @Input() projects: Project[] = [];
  @Input() selectedProject: Project | null = null;
  @Output() select = new EventEmitter<Project>();

  onSelect(project: Project): void {
    this.select.emit(project);
  }

  isSelected(project: Project): boolean {
    if (!this.selectedProject) return false;
    // Prefer numeric id comparison when available, otherwise compare globalId
    if (typeof project.id === 'number' && typeof this.selectedProject.id === 'number') {
      return project.id === this.selectedProject.id;
    }
    return project.globalId === this.selectedProject.globalId;
  }
}
