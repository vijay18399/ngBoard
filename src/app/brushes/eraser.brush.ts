import { fabric } from 'fabric';
// const fabricjs: typeof fabric =
//     typeof fabric === 'undefined' ? require('fabric').fabric : fabric;

import {
    FabricEvent,
    FabricPointer,
    FabricPointerEvent,
} from '../utils/fabric.utils';

export interface ClickEraserInterface extends fabric.BaseBrush {

    onMouseDown(pointer: FabricPointer | FabricEvent, ev: FabricEvent): void;
    onMouseMove(pointer: FabricPointer | FabricEvent, ev: FabricEvent): void;
    onMouseUp(ev?: FabricEvent): void;
}

const ClickEraserImp = <any>fabric.util.createClass(fabric.BaseBrush, {


    /**
     * Constructor
     * @param {fabricjs.Canvas} canvas
     * @return {Pointer} Instance of a pencil brush
     */
    initialize: function (canvas: fabric.Canvas) {
        this.canvas = canvas;
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
        var object = this.canvas.findTarget(pointer,true);
        if(object){
        console.log(object,object.type)
        this.canvas.remove(object)
        }
    },
    /**
     * Inovoked on mouse move
     * @param {Object} pointer
     * @param {Object} ev
     */
    onMouseMove: function (
        pointer: FabricPointer | FabricEvent,
        ev: FabricEvent
    ) { 
        // this.canvas.freeDrawingCursor = 'pointer';
    },
    /**
     * Invoked on mouse up
     * @param {Object} ev
     */
    onMouseUp: function (ev?: FabricEvent) {
        // this.canvas.freeDrawingCursor = 'pointer';
     },
   
});

/**
 * ClickEraser class
 * @class fabricjs.ClickEraser
 * @extends fabricjs.BaseBrush
 */
const ClickEraser: {
    new(canvas: fabric.StaticCanvas): ClickEraserInterface;
} = ClickEraserImp;

(fabric as any).ClickEraser = ClickEraser;
export default ClickEraser;