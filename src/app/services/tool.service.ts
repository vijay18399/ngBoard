import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import cursorMap from '../config/cursor.config';
import { ArrowCreator, EllipseCreator, LineCreator, RectangleCreator, TriangleCreator } from '../fabric/shapes';
import { perfectHand, Laser, TextCreator, BucketFill } from '../fabric/brushes';
import { PanZoom } from '../fabric/utilities';
declare const fabric: any;
const EraserBrush = (fabric as any).EraserBrush;
@Injectable({
  providedIn: 'root',
})
export class ToolService {
  public canvas!: any;
  private _toolProperties = new BehaviorSubject<any>({
    color: "#000000",
    width: 5,
    tool: 'pencil',
    fontFamily: 'Chewy-Regular',
    theme: 'default',
    shape: 'circle',
    fill: "#90CAF9",
  });

  toolProperties$: Observable<any> = this._toolProperties.asObservable();
  private tool: any;
  private panzoom: any;

  constructor() {
    this.loadCustomFont();
  }

  initCanvas(canvas: fabric.Canvas) {
    this.canvas = canvas;
    this.tool = null;
    this.updateTool(this._toolProperties.value.tool);
  }

  initializeTool(toolInstance: any) {
    this.tool = toolInstance;
    this.tool.color = this._toolProperties.value.color;
    this.tool.width = this._toolProperties.value.width;
    this.tool.fill = this._toolProperties.value.fill;
    this.canvas.freeDrawingBrush = this.tool;
  }

  updateTool(tool: string, prop?: string) {
    this.canvas.off('mouse:wheel');
    this.canvas.off('erasing:end');
    if (this.panzoom) {
      this.panzoom.removeListeners();
      this.panzoom = null;
    }
    if (tool !== 'selector') {
      this.canvas.isDrawingMode = true;
    }

    const toolMap: { [key: string]: any } = {
      pencil: perfectHand,
      laser: Laser,
      eraser: EraserBrush,
      text: TextCreator,
      bucketfill: BucketFill,
    };

    const ToolClass = toolMap[tool];
    if (ToolClass) {
      this.initializeTool(new ToolClass(this.canvas));
      if (tool === 'eraser') {
        this.canvas.on('erasing:end', (object: any) => {
          if (object.targets.length) {
            this.canvas.saveHistory();
          }
        });
      } else if (tool === 'text') {
          var ff = this._toolProperties.getValue().fontFamily
          this.tool.setFontFamily && this.tool.setFontFamily(ff);
      }
    } else if (tool === 'selector') {
      this.canvas.isDrawingMode = false;
      this.canvas.defaultCursor = cursorMap['default'];
      this.canvas.hoverCursor = cursorMap['default'];
      this.canvas.moveCursor = cursorMap['default'];
      return;
    } else if (tool === 'panzoom') {
      this.canvas.isDrawingMode = false;
      this.panzoom = new PanZoom(this.canvas);
    } else {
      this.updateShape(prop);
    }
    this.canvas.freeDrawingCursor = cursorMap[tool] || cursorMap['default'];
    this._toolProperties.next({ ...this._toolProperties.value, tool });
  }

  updateToolProperties(properties: any) {
    this._toolProperties.next({ ...this._toolProperties.value, ...properties });
    this.updateTool(this._toolProperties.value.tool);
  }

  updateColor(color: string) {
    this.updateToolProperties({ color });
  }

  updateFillColor(fill: string) {
    this.updateToolProperties({ fill });
  }

  updateWidth(width: number) {
    this.updateToolProperties({ width });
  }

  updateFontFamily(ff: string) {
    this.updateToolProperties({ fontFamily: ff });
  }
  updateShape(shape: string = 'circle') {
    this._toolProperties.next({ ...this._toolProperties.value, shape, tool: 'shapes' });
    const shapeMap: { [key: string]: any } = {
      circle: EllipseCreator,
      square: RectangleCreator,
      triangle: TriangleCreator,
      line: LineCreator,
      arrow: ArrowCreator,
    };

    const ShapeClass = shapeMap[shape];
    if (ShapeClass) {
      this.initializeTool(new ShapeClass(this.canvas));
    } else {
      console.warn(`Unsupported shape: ${shape}`);
    }
  }

  loadCustomFont() {
    const font = new FontFace('Chewy-Regular', 'url(../../assets/Chewy-Regular.ttf)');
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
      console.log('Custom font loaded');
    }).catch((error) => {
      console.error('Failed to load custom font:', error);
    });
  }
}
