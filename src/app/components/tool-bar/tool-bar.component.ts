import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable } from 'rxjs';
import { SHAPES, TOOLS } from '../../constants';
import { ToolService } from '../../services/tool.service';
import { MatSliderModule, MatSliderRangeThumb } from '@angular/material/slider';
import { ColorsPickerComponent } from '../colors-picker.component';
import { FormsModule } from '@angular/forms';
import {  ToolSettingsComponent } from '../tool-settings.component';

@Component({
  selector: 'tool-bar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSliderModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonToggleModule,
    MatMenuModule,
    ColorsPickerComponent,
    ToolSettingsComponent,
    MatSliderModule
  ],
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.scss']
})
export class ToolBarComponent {
  selectedTool: string = '';
  selectedColor!: string ;
  selectedShape: string = '';
  selectedFontFamily: string = '';
  @Output() exportMenu = new EventEmitter<void>();
  @Output() addImage = new EventEmitter<any>();
  tools = TOOLS;
  shapes = SHAPES;
  toolProperties$: Observable<any>;
  colors: string[] = ['#0099D6','#FFE800','#E72853','#EB7418','#783060','#000000'];
  fontFamilies:string[]=['Chewy-Regular','Tahoma','sans-serif','Times New Roman','Courier New','Arial','Helvetica','Lucida Console']
  fontSizes=[10,20,30,40,50,60,80];
  selectedWidth: any;
  constructor(public toolService: ToolService) {
    this.toolProperties$ = this.toolService.toolProperties$;
  }
  ngOnInit() {
    this.toolProperties$.subscribe(properties => {
      this.selectedTool = properties.tool;
      this.selectedShape = properties.shape;
      this.selectedFontFamily = properties.fontFamily;
      this.selectedColor = properties.color;
      this.selectedWidth= properties.width;
    });
  }

  get canvas() {
    return this.toolService.canvas;
  }

  isActive(tool: any, activeTool: string): boolean {
    if (tool && tool.tools && tool.tools.length) {
      return tool.tools.some((t: any) => t.name === activeTool);
    } else {
      return tool.name === activeTool;
    }
  }

  onToolChange(tool: string): void {
    this.toolService.updateTool(tool);
  }


  updateShape(shape: string): void {
    this.selectedShape = shape;
    this.toolService.updateShape(shape);
  }

  undoRedoCallback() {}

  get zoomPercentage(): string {
    return this.canvas ? Math.round(this.canvas.getZoom() * 100) + '%' : '100%';
  }
  get drawingTools() {
    return this.tools.find(toolGroup => toolGroup.group === 'Drawing');
  }
  reset() {
    this.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
  }
  onToolClick(tool: any): void {
    if (tool.group) {
      if(!tool.tools.some((t:any) => t.name === this.selectedTool)){
        this.selectedTool = tool.tools[0].name;
      }
      this.toolService.updateTool(this.selectedTool);
    } else {
      this.selectedTool = tool.name;
      this.toolService.updateTool(tool.name);
    }
  }

  handleFileInput(event: any) {
    let files = event.target.files;
    const file = files.item(0);
    const reader = new FileReader();
    if(!file){
       return;
    }
    reader.readAsDataURL(file);
    reader.onload = () => {
      let imageUrl = reader.result as string;
      this.addImage.emit(imageUrl)
    };
  }
  updateFontFamily(fontFamily: string) {
    this.toolService.updateFontFamily(fontFamily);
  }

  updateColor(color: string) {
    this.toolService.updateColor(color);
  }

  updateWidth(width: number) {
    this.toolService.updateWidth(width);
  }
}
