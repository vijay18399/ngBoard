
import { fabric } from 'fabric';
import {getStroke} from 'perfect-freehand';


    import {
        FabricEvent,
        FabricPointer,
        FabricPointerEvent,
    } from '../utils/fabric.utils';

export interface perfectHandInterface extends fabric.BaseBrush {

    onMouseDown(pointer: FabricPointer | FabricEvent, ev: FabricEvent): void;
    onMouseMove(pointer: FabricPointer | FabricEvent, ev: FabricEvent): void;
    onMouseUp(ev?: FabricEvent): void;
}

const perfectHandImp = <any>fabric.util.createClass(fabric.BaseBrush, {



    /**
     * Constructor
     * @param {fabric.Canvas} canvas
     * @return {Pointer} Instance of a pencil brush
     */
    initialize: function (canvas: fabric.Canvas) {
        this.canvas = canvas;
        this._points = [];
        this.ctx = this.canvas.contextTop;
   
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

     
    },
    /**
     * Invoked on mouse up
     * @param {Object} ev
     */
    onMouseUp: function (ev?: FabricEvent) {
        this.canvas.clearContext(this.canvas.contextTop);
        this._points = [];
        this.canvas.add(new fabric.Path(this.path,{
         strokeWidth:this.width,
         fill:this.color,
        }))
    },
      /**
   * Draw a smooth path on the topCanvas using quadraticCurveTo
   * @private
   * @param {CanvasRenderingContext2D} [ctx]
   */
  _render() {
     this.canvas.clearContext(this.canvas.contextTop);
     this.path =  this.getSvgPathFromStroke(getStroke(this._points, {
      size: this.width,
      thinning: 0.5,
      smoothing: 0.5,
      streamline: 0.5}));
     let p=  new Path2D(this.path);
     this.ctx.fillStyle = this.color;
     this.ctx.fill(p);
  },
  getSvgPathFromStroke(stroke: any) {
    if (!stroke.length) return ""
  
    const d = stroke.reduce(
      (acc: any, [x0, y0]: any, i: any, arr: any) => {
        const [x1, y1] = arr[(i + 1) % arr.length]
        acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2)
        return acc
      },
      ["M", ...stroke[0], "Q"]
    )
  
    d.push("Z")
    return d.join(" ")
  }

});

/**
 * perfectHand class
 * @class fabric.perfectHand
 * @extends fabric.BaseBrush
 */
const perfectHand: {
    new(canvas: fabric.StaticCanvas): perfectHandInterface;
} = perfectHandImp;

(fabric as any).perfectHand = perfectHand;
export default perfectHand;