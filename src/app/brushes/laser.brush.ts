import { fabric } from 'fabric';
import { Point } from 'fabric/fabric-impl';
// const fabric: typeof fabric =
//     typeof fabric === 'undefined' ? require('fabric').fabric : fabric;
 import {
      FabricEvent,
      FabricPointer,
      FabricPointerEvent,
  } from '../utils/fabric.utils';

export interface LaserInterface extends fabric.BaseBrush {

    onMouseDown(pointer: FabricPointer | FabricEvent, ev: FabricEvent): void;
    onMouseMove(pointer: FabricPointer | FabricEvent, ev: FabricEvent): void;
    onMouseUp(ev?: FabricEvent): void;
}

const LaserImp = <any>fabric.util.createClass(fabric.BaseBrush, {



    /**
     * Constructor
     * @param {fabric.Canvas} canvas
     * @return {Pointer} Instance of a pencil brush
     */
    initialize: function (canvas: fabric.Canvas) {
        this.canvas = canvas;
        this._points = [];
        this.ctx = this.canvas.contextTop;
        // Set up the interval timer
        this.interval=null;
          // Set up the flag for whether the line can be removed
        this.canRemove=true;
    },

    /**
     * Invoked inside on mouse down and mouse move
     * @param {Object} pointer
     */
    drawSegment(ctx: CanvasRenderingContext2D, p1: Point, p2: Point) {
        const midPoint = p1.midPointFrom(p2);
        ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
        return midPoint;
      },

    /**
     * Inovoked on mouse down
     * @param {Object} pointer
     * @param {Object} ev
     */
    onMouseDown: function (
        pointer: any,
        ev: FabricEvent
    ) {

        this._points.push(pointer);
        this._render(this.ctx);
        this.interval = setInterval(() => {
            this._points.shift();
            this._render(this.ctx);
          }, 35);
    },
    /**
     * Inovoked on mouse move
     * @param {Object} pointer
     * @param {Object} ev
     */
    onMouseMove: function (
        pointer: any,
        ev: FabricEvent
    ) {
        this._points.push(pointer);
        this._render(this.ctx);

        if(this._points.length>100 && !this.rateIncrease){
          clearInterval(this.interval )
          this.interval = setInterval(() => {
            this._points.shift();
            this._render(this.ctx);
          }, 30);
          this.rateIncrease =true;
          console.log("here")
        }
        if(this._points.length<100 && this.rateIncrease ){
          clearInterval(this.interval )
          this.interval = setInterval(() => {
            this._points.shift();
            this._render(this.ctx);
          }, 60);
          this.rateIncrease =false;
          console.log("here 2")
        }
        // clearInterval(this.interval)
        // this.interval = setInterval(() => {
        //     this._points.shift();
        //     this._render(this.ctx);
        //   }, 1000/this._points.length);
    },
    /**
     * Invoked on mouse up
     * @param {Object} ev
     */
    onMouseUp: function (ev?: FabricEvent) {
        this.canvas.clearContext(this.canvas.contextTop);
        this._points = [];
        clearInterval(this.interval);
    },
      /**
   * Draw a smooth path on the topCanvas using quadraticCurveTo
   * @private
   * @param {CanvasRenderingContext2D} [ctx]
   */
  _render(ctx: CanvasRenderingContext2D) {
     this.canvas.clearContext(this.canvas.contextTop);
    let p1 = this._points[0],
      p2 = this._points[1];
    this._saveAndTransform(ctx);
    ctx.beginPath();
    ctx.strokeStyle=  this.color,
    ctx.fillStyle =  this.color,
    ctx.shadowColor = this.color,
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    //if we only have 2 points in the path and they are the same
    //it means that the user only clicked the canvas without moving the mouse
    //then we should be drawing a dot. A path isn't drawn between two identical dots
    //that's why we set them apart a bit
    if (this._points.length === 2 && p1.x === p2.x && p1.y === p2.y) {
      const width = this.width / 1000;
      p1.x -= width;
      p2.x += width;
    }
    if(p1) ctx.moveTo(p1.x, p1.y); 
    // Set the stroke width based on the position in the array of points
  
    for (let i = 1; i < this._points.length; i++) {
      // we pick the point between pi + 1 & pi + 2 as the
      // end point and p1 as our control point.
      ctx.lineWidth=  (i/this._points.length)*3
      this.drawSegment(ctx, p1, p2);
      ctx.stroke();
      ctx.beginPath();
      let  midPoint = p1.midPointFrom(p2);
      ctx.moveTo(midPoint.x, midPoint.y); 
      p1 = this._points[i];
      p2 = this._points[i + 1];
      
    }
   
    // Draw last line as a straight line while
    // we wait for the next point to be able to calculate
    // the bezier control point
    if(p1) ctx.lineTo(p1.x, p1.y);
    ctx.stroke();
    ctx.restore();
  }

});

/**
 * Laser class
 * @class fabric.Laser
 * @extends fabric.BaseBrush
 */
const Laser: {
    new(canvas: fabric.StaticCanvas): LaserInterface;
} = LaserImp;

(fabric as any).Laser = Laser;
export default Laser;