import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToolService } from '../services/tool.service';

@Component({
  selector: 'action-controls',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  template: `
  <mat-card class="action-buttons-card">
    <button matTooltip="Undo" class="action-button" [disabled]="!canvas.canUndo()" (click)="canvas.undo(undoRedoCallback)"  aria-label="Undo" >
      <mat-icon>undo</mat-icon>
    </button>

    <button matTooltip="Redo" class="action-button" [disabled]="!canvas.canRedo()" (click)="canvas.redo(undoRedoCallback)"  aria-label="Redo" >
      <mat-icon>redo</mat-icon>
    </button>

    <button matTooltip="Reset View" class="action-button" (click)="reset()"  aria-label="Reset View">
      <mat-icon>fit_screen</mat-icon>
    </button>
</mat-card>
  `,
  styles: [
  `


.action-buttons-card {
    display: flex;
    flex-direction: row;
    gap: 6px;
    align-items: center;
    justify-content: center;
    background-color: white;
  .action-button {
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background-color: transparent;
    color: #004A99;
    cursor:pointer;
    padding: 8px 12px;
    &:disabled {
       color: #c1c1c1;
    }
    mat-icon {
      font-size: 24px;
    }
}
}




  `
  ],
})
export class ActionControlsComponent implements OnInit {
  constructor(public toolService: ToolService) {}

  ngOnInit() {}

  get canvas() {
    return this.toolService.canvas;
  }

  undoRedoCallback() {}

  get zoomPercentage(): string {
    return this.canvas ? Math.round(this.canvas.getZoom() * 100) + '%' : '100%';
  }

  reset() {
    this.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
  }

}

