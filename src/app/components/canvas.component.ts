import {
  Component,
  Input,
  SimpleChanges,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
declare const fabric: any;
import { ToolService } from '../services/tool.service';
import { HistoryCanvas } from '../fabric/utilities';
@Component({
  selector: 'app-canvas',
  standalone:true,
  template: `
    <div #canvasContainer class="canvas-container">
      <canvas id="fabricCanvas"></canvas>
    </div>
  `,
  styles: [
    `
      .canvas-container {
        width: 100%;
        height: 100%;
        position: relative;
      }

      canvas {
        display: block;
      }
    `,
  ],
})
export class CanvasComponent implements AfterViewInit {
  @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef;
  _canvas!: any;
  loading: boolean = false;
  @Input() page: any;

  constructor(public toolService: ToolService) { }

  ngAfterViewInit() { }

  ngOnChanges(changes: SimpleChanges) {
    this.initFabricCanvas();
  }

  public initFabricCanvas(callback?: Function) {
    if (this._canvas) {
      this._canvas.dispose();
    }

    const containerWidth = this.canvasContainer.nativeElement.offsetWidth;
    const containerHeight = this.canvasContainer.nativeElement.offsetHeight;

    this._canvas = new HistoryCanvas('fabricCanvas', {
      width: containerWidth,
      height: containerHeight,
      backgroundColor: 'white',
      enableRetinaScaling: false,
    });

    this.toolService.initCanvas(this._canvas);

    if (this.page.pageData) {
      this._canvas.offHistory();
      this._canvas.loadFromJSON(this.page.pageData, () => {
        this._canvas.renderAll.bind(this._canvas);
        this._canvas.onHistory();
        callback && callback();
      });
      this.loading = false;
    } else {
      callback && callback();
    }
    // this.addImage('coloring/elephant.jpg')
  }

  public addImage(imageUrl: string) {
    fabric.Image.fromURL(imageUrl, (img: any) => {
      img.set({
        left: window.innerWidth/4,
        top: window.innerHeight/4,
        angle: 0,
        padding: 10,
        cornerSize: 10,
        hasRotatingPoint: true,
        scaleX: 0.25,
        scaleY: 0.25
      });
      this._canvas.add(img);
      this._canvas.setActiveObject(img);
      this.toolService.updateTool('selector');
    });
  }

  public getPageData() {
    return {
      canvasData: this._canvas.toJSON(),
      preview: this._canvas.toDataURL(),
    };
  }

  clearAll() {
    this._canvas.clear();
  }

  ngOnDestroy(): void {
    if (this._canvas) {
      this._canvas.dispose();
      console.log('destroyed');
    }
  }
}
