import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { BG_COLORS, STROKE_COLORS } from '../constants';
import { ToolService } from '../services/tool.service';

@Component({
  selector: 'colors-picker',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatTabsModule,
    MatCardModule,
  ],
  template: `
    <div class="container">
      <div class="selected-color-display" (click)="toggleColorMenu()">
        <div mat-button class="selected-color" [style.background]="selectedFillColor"></div>
        <div mat-button class="selected-color top" [style.background]="selectedStrokeColor"></div>
      </div>

      <mat-card *ngIf="colorMenu" class="colors-menu">
        <mat-tab-group [(selectedIndex)]="isFillTabActive">
          <mat-tab label="Stroke Colors">
            <div class="color-grid">
              <button mat-icon-button *ngFor="let color of strokeColors"
                      class="color-option"
                      [style.background]="color"
                      [class.selected]="color === selectedStrokeColor"
                      (click)="selectStrokeColor(color)">
              </button>
            </div>
          </mat-tab>
          <mat-tab label="Fill Colors">
            <div class="color-grid">
              <button mat-icon-button *ngFor="let color of fillColors"
                      class="color-option"
                      [style.background]="color"
                      [class.selected]="color === selectedFillColor"
                      (click)="selectFillColor(color)">
              </button>
            </div>
          </mat-tab>
        </mat-tab-group>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      position: relative;
    }
    .selected-color-display {
      display: flex;
      gap: 10px;
      cursor: pointer;
      margin-bottom: 20px;
      justify-content: center;
    }
    .selected-color {
      width: 20px;
      height: 20px;
      border-radius: 5px;
      border: 2px solid rgba(0, 0, 0, 0.18);
    }
    .top {
      position: absolute;
      left: 19px;
      top: 8px;
    }
    .colors-menu {
      position: absolute;
      width: 332px;
      padding: 10px;
      left: 60px;
      bottom: 0px;
      padding: 10px;
    }
    .color-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      height: max-content;
      padding: 15px;
      align-items: center;
      justify-content: center;
    }
    .color-option {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 4px solid rgb(0 0 0 / 18%);
    }
    .color-option.selected {
      transform: scale(1.2);
    }
  `]
})
export class ColorsPickerComponent implements OnInit, OnDestroy {
  fillColors = BG_COLORS;
  strokeColors = STROKE_COLORS;
  toolProperties$: any;
  selectedFillColor: string = '';
  selectedStrokeColor: string = '';
  colorMenu = false;
  isFillTabActive = 0;

  constructor(public toolService: ToolService, private elementRef: ElementRef) {
    this.toolProperties$ = this.toolService.toolProperties$;
  }

  ngOnInit() {
    this.toolProperties$.subscribe((properties: any) => {
      this.selectedFillColor = properties.fill ;
      this.selectedStrokeColor = properties.color ;
    });
  }

  toggleColorMenu() {
    this.colorMenu = !this.colorMenu;
  }

  selectFillColor(color: string): void {
    this.selectedFillColor = color;
    this.toolService.updateFillColor(color);
  }

  selectStrokeColor(color: string): void {
    this.selectedStrokeColor = color;
    this.toolService.updateColor(color);
  }

  // Close menu when clicking outside the component
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.colorMenu = false;
    }
  }

  ngOnDestroy() {
    // Clean up any resources or listeners if necessary
  }
}
