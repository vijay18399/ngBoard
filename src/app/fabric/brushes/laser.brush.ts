import { Point } from 'fabric/fabric-impl';
declare const fabric: any;
import { drainPoints, drawLaserPen, setColor } from 'laser-pen';
import { hexToRgb } from './utility/color-utils';

export interface LaserInterface extends fabric.BaseBrush {
  onMouseDown(pointer: { x: number; y: number }, ev: any): void;
  onMouseMove(pointer: { x: number; y: number }, ev: any): void;
  onMouseUp(ev?: any): void;
}

const LaserImp = <any>fabric.util.createClass(fabric.BaseBrush, {
  initialize: function (canvas: fabric.Canvas) {
    this.canvas = canvas;
    this._points = [];
    this.ctx = this.canvas.contextTop;
    this.isDrawing = false;
    this.setColor(this.color);
  },
  setColor: function (hex: string){
    const [r,g,b] = hexToRgb(this.color)
    setColor(r,g,b)
  },
  draw: function() {
    this._clearCanvas();
    const vt = this.canvas.viewportTransform;
    const scale = this.canvas.getZoom();
    const translatedX = vt[4];
    const translatedY = vt[5];
    var points =  this._points.map((point: { x: number, y: number , time : Date }) => ({
      x: (point.x * scale) + translatedX,
      y: (point.y * scale) + translatedY,
      time : point.time
     }));
    var mouseTrack = drainPoints(points);
    if (mouseTrack.length >= 3) {
      drawLaserPen(this.ctx, mouseTrack);
    }
  },

  onMouseDown: function (pointer: any, ev: any) {
    this.isDrawing = true;
    this._points.push({ ...pointer, time: Date.now() });
    this.animate();
  },

  onMouseMove: function (pointer: any, ev: any) {
    if (this.isDrawing) {
      this._points.push({ ...pointer, time: Date.now() });
    }
  },

  onMouseUp: function (ev?: any) {
    this.isDrawing = false;
    this._points = [];
    this._clearCanvas();
  },

  animate: function() {
    if (!this.isDrawing) return;
    this.draw();
    requestAnimationFrame(this.animate.bind(this));
  },

  _clearCanvas: function() {
    if (this.canvas && this.canvas.contextTop) {
      this.canvas.clearContext(this.canvas.contextTop);
    }
  }
});
const Laser: {
  new(canvas: fabric.StaticCanvas): LaserInterface;
} = LaserImp;

(fabric as any).Laser = Laser;
export default Laser;
