import { Injectable } from '@angular/core';
import { fabric } from 'fabric';
import perfectFreeHand from '../brushes/perfectHand.brush';
import ClickEraser from '../brushes/eraser.brush';
import Laser from '../brushes/laser.brush';
import PanZoom from '../brushes/pan.brush';
import Pointer from '../brushes/pointer.brush';
import shapeCreator from '../brushes/shape.creator';
import TextCreator from '../brushes/text.creator';
import cursorMap from '../config/cursor.config';
@Injectable({
  providedIn: 'root'
})
export class ToolService {
  _canvas!: fabric.Canvas;
  properties = {
    color: "#000000",
    width: 5,
    tool: 'pencil',
    fontFamily:'Times New Roman',
    theme : 'default'
  }
  tool: any;
  constructor() {
  }

  initCanvas(canvas: fabric.Canvas) {
    this._canvas = canvas;
    this.tool = null;
    this.updateTool(this.properties.tool);
  }
  updateTool(tool: string,fontFamily?:string) {
    this._canvas.isDrawingMode = true;
    this._canvas.off('mouse:wheel');
   console.log(tool)
    switch (tool) {
      case 'perfect':
        this.tool= new perfectFreeHand(this._canvas);
        break;
      case 'pencil':
        this.tool= new fabric.PencilBrush(this._canvas);
        break;
      case 'selector':
        this._canvas.isDrawingMode = false;
        this.properties.tool = tool;
        return;
        break;
      case 'pointer':
        this.tool = new Pointer(this._canvas);
        break;
      case 'laser':
        this.tool = new Laser(this._canvas);
        break;
      case 'eraser':
        this.tool =  new ClickEraser(this._canvas);
        break;
      case 'text':
        this.tool = new TextCreator(this._canvas);
        this.tool.setFontFamily(fontFamily|| 'Tahoma')
        break;
      case 'panzoom':
        this._canvas.freeDrawingCursor =  `grab`;
        this.tool = new PanZoom(this._canvas);
        break;
      default:
        this.tool = new shapeCreator(this._canvas);
        this.tool.setShape(tool)
        break;

    }
    this.tool.color = this.properties.color;
    this.tool.width = this.properties.width;
    this._canvas.freeDrawingBrush = this.tool;
    if(cursorMap.hasOwnProperty(tool)){
        this._canvas.freeDrawingCursor = cursorMap[tool];
    }else{
      this._canvas.freeDrawingCursor = 'default';
    }
    this.properties.tool = tool;
  }
  updateColor(color: string) {
    this.properties.color = color;
    this._canvas.freeDrawingBrush.color = this.properties.color;
  }
  updateWidth(width: number) {
    this.properties.width = width;
    this._canvas.freeDrawingBrush.width = this.properties.width;
  }
  updatefontFamily(ff:string){
    this.properties.fontFamily = ff;
  }

}
