declare const fabric: any;

export interface LineCreatorInterface extends fabric.BaseBrush {
    onMouseDown(pointer: { x: number; y: number } | any, ev: any): void;
    onMouseMove(pointer: { x: number; y: number } | any, ev: any): void;
    onMouseUp(ev?: any): void;
}

const LineCreatorImp = fabric.util.createClass(fabric.BaseBrush, {
    initialize: function (canvas: fabric.Canvas) {
        this.canvas = canvas;
        this.isDrawing = false;
        this.lineShape = null;
        this.color = this.color;
        this.width = this.width;
    },

    onMouseDown: function (pointer: { x: number; y: number }, ev: any) {
        this.isDrawing = true;

        const points = [pointer.x, pointer.y, pointer.x, pointer.y];
        this.lineShape = new fabric.Line(points, {
            hoverCursor: 'default',
            hasControls: true,
            hasBorders: true,
            selectable: true,
            fill: this.color,
            stroke: this.color,
            strokeWidth: this.width,
            originX: 'center',
            originY: 'center',
            transparentCorners: false,
            objectCaching: false,
        });

        this.canvas.add(this.lineShape);
    },

    onMouseMove: function (pointer: { x: number; y: number }, ev: any) {
        if (!this.isDrawing || !this.lineShape) return;

        this.lineShape.set({
            x2: pointer.x,
            y2: pointer.y,
        });

        this.lineShape.setCoords();  // Update the line's coordinates

        this.canvas.renderAll();
    },

    onMouseUp: function (ev?: any) {
        this.isDrawing = false;
        if (this.lineShape) {
            this.lineShape.setCoords();  // Ensure the line's bounding box is updated
        }
        this.lineShape = null;
    }
});

/**
 * LineCreator class
 * @class fabric.LineCreator
 * @extends fabric.BaseBrush
 */
const LineCreator: {
    new(canvas: fabric.StaticCanvas): LineCreatorInterface;
} = LineCreatorImp;

(fabric as any).LineCreator = LineCreator;
export default LineCreator;
