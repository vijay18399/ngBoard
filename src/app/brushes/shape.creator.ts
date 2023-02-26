import { fabric } from 'fabric';

    import {
        FabricEvent,
        FabricPointer,
        FabricPointerEvent,
    } from '../utils/fabric.utils';

export interface shapeCreatorInterface extends fabric.BaseBrush {
    setShape(shape:string): void;
    onMouseDown(pointer: FabricPointer | FabricEvent, ev: FabricEvent): void;
    onMouseMove(pointer: FabricPointer | FabricEvent, ev: FabricEvent): void;
    onMouseUp(ev?: FabricEvent): void;
}

const shapeCreatorImp = <any>fabric.util.createClass(fabric.BaseBrush, {
    shape : null,
    initialize: function (canvas: fabric.Canvas) {
        this.canvas = canvas;
        this.object = null
        this.oldEnd = null; 
        this.isDown=false;
    },
    setShape: function(shape:string) {
        this.shape = shape;
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
        console.log(this.shape,this.color,this.width,this.kk)
        this.isDown=true;
        switch (this.shape) {
            case 'circle':
                this.object = new fabric.Circle({
                    radius: 0,
                    left: pointer.x,
                    top: pointer.y,
                    stroke:  this.color,
                    strokeWidth: this.width,
                    fill:'transparent'
                });
                break;
            case 'square':
                this.object = new fabric.Rect({
                    left: pointer.x,
                    top: pointer.y,
                    width: 0,
                    height: 0,
                    stroke:  this.color,
                    strokeWidth: this.width,
                    fill:'transparent'
                });
            break;    
            case 'ellipse':
                 this.object = new fabric.Ellipse({
                   left: pointer.x,
                    top: pointer.y,
                    stroke:  this.color,
                    originX: 'left',
                    originY: 'top',
                    strokeWidth: this.width,
                    rx: 0,
                    ry: 0,
                    fill:'transparent'
              });
              break;
              case 'line':
                this.object = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
                    stroke:  this.color,
                    fill:'transparent',
                    strokeWidth: this.width
                  })
               break;
        }
         this.oldEnd  = pointer
         this.canvas.add(this.object); 
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
       if(!this.isDown){
         return; 
       }
       switch (this.shape) {
        case 'circle':
                this.object.set({
                    // width: Math.abs(this.oldEnd.x - pointer.x),
                    // height: Math.abs(this.oldEnd.y-pointer.y),
                    radius: Math.abs(this.calculateDistance(pointer))/2,
                });
                break;
        case 'square':
                this.object.set({
                    width: Math.abs(this.oldEnd.x - pointer.x),
                    height: Math.abs(this.oldEnd.y-pointer.y),
                });
                break;
          case 'ellipse':
                this.object.set({
                    rx: Math.abs(this.oldEnd.x - pointer.x)/2,
                    ry: Math.abs(this.oldEnd.y-pointer.y)/2,
                });
                break;
           case 'line':
                this.object.set({ x2: pointer.x, y2: pointer.y });
                
       }
       this.object.setCoords();
       this.canvas.renderAll();
    },
    calculateDistance: function (pointer: any) {
      return   Math.sqrt( Math.pow((pointer.x-this.oldEnd.x), 2) + Math.pow((pointer.y-this.oldEnd.y), 2) );;
     },
    /**
     * Invoked on mouse up
     * @param {Object} ev
     */
    onMouseUp: function (ev?: FabricEvent) {
        this.isDown=false;
        // this.canvas.setActiveObject(this.object);
     },
   
});

/**
 * shapeCreator class
 * @class fabric.shapeCreator
 * @extends fabric.BaseBrush
 */
const shapeCreator: {
    new(canvas: fabric.StaticCanvas): shapeCreatorInterface;
} = shapeCreatorImp;

(fabric as any).shapeCreator = shapeCreator;
export default shapeCreator;