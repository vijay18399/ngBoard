import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatSliderChange, MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ToolService } from '../services/tool.service';
@Component({
  selector: 'tool-settings',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatTabsModule,
    MatCardModule,
    MatSliderModule,
    MatIconModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="container">
      <!-- Settings Icon -->
      <div class="settings-icon" (click)="toggleSettingsMenu()">
        <button mat-icon-button>
          <mat-icon>settings</mat-icon>
        </button>
      </div>
      <mat-card *ngIf="settingsMenuOpen" class="settings-menu">
        <div class="setting-item">
          <mat-slider   (change)="onStrokeWidthChange($event)"  min="5" max="25" step="5" showTickMarks discrete [displayWith]="formatLabel">
            <input  [value]="selectedStrokeWidth" matSliderThumb>
          </mat-slider>
          <span>{{ selectedStrokeWidth }}px</span>
        </div>
        <div class="setting-item">
          <mat-form-field appearance="outline">
            <mat-label>Font Family</mat-label>
            <mat-select name="fontFamily"  [(ngModel)]="selectedFontFamily" (selectionChange)="onFontFamilyChange($event.value)">
              <mat-option *ngFor="let font of fontFamilies" [value]="font">{{ font }}</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      position: relative;
    }

    .settings-icon {
      display: flex;
      justify-content: center;
      margin-bottom: 10px;
    }

    .settings-menu {
      position: absolute;
    width: 250px;
    left: 60px;
    top: 0px;
    padding: 3px 15px;
    background: white;
    gap: 20px;
    }

    .setting-item {
      width: 100%;
      display: flex;
      align-items: center;
      mat-slider{
        width:180px;
      }
      span{
        margin:0px 12px;
      }
    }
  `]
})
export class ToolSettingsComponent implements OnInit, OnDestroy {
  fontFamilies: string[] = ['Chewy-Regular', 'Tahoma', 'sans-serif', 'Times New Roman', 'Courier New', 'Arial', 'Helvetica', 'Lucida Console'];
  selectedFontFamily: string = 'Arial';
  selectedStrokeWidth: number = 5;
  settingsMenuOpen = false;

  constructor(public toolService: ToolService, private elementRef: ElementRef) {}

  ngOnInit() {
    this.toolService.toolProperties$.subscribe(properties => {
      this.selectedStrokeWidth = properties.width ;
      this.selectedFontFamily = properties.fontFamily || 'Arial';
    });
  }
  onStrokeWidthChange(event: any) {
    this.selectedStrokeWidth = Number(event.target.value);
    console.log(event.target.value)
    this.toolService.updateWidth(this.selectedStrokeWidth);
  }
  formatLabel(value: number): string {
    return `${value}`;
  }
  toggleSettingsMenu() {
    this.settingsMenuOpen = !this.settingsMenuOpen;
  }

  onFontFamilyChange(font: string) {
    this.toolService.updateFontFamily(font);
  }
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.settingsMenuOpen = false;
    }
  }

  ngOnDestroy() {
    // Clean up subscriptions if necessary
  }
}
