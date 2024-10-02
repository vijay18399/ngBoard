declare const fabric: any;

export interface RectangleCreatorInterface extends fabric.BaseBrush {
    onMouseDown(pointer: { x: number; y: number }, ev: any): void;
    onMouseMove(pointer: { x: number; y: number }, ev: any): void;
    onMouseUp(pointer: { x: number; y: number }, ev: any): void;
}

const RectangleCreatorImp = fabric.util.createClass(fabric.BaseBrush, {
    initialize: function (canvas: fabric.Canvas) {
        this.canvas = canvas;
        this.isDrawing = false;
        this.squareShape = null;
        this.origX = 0;
        this.origY = 0;
        this.color = this.color;
        this.width = this.width;
        this.fill = this.fill;
    },

    onMouseDown: function (pointer: { x: number; y: number }, ev: any) {
        this.startDrawing(pointer);
    },

    onMouseMove: function (pointer: { x: number; y: number }, ev: any) {
        if (this.isDrawing && this.squareShape) {
            this.resizeSquare(pointer);
        }
    },

    onMouseUp: function (pointer: { x: number; y: number }, ev: any) {
        this.stopDrawing();
    },

    startDrawing: function (pointer: { x: number; y: number }) {
        this.isDrawing = true;
        this.origX = pointer.x;
        this.origY = pointer.y;

        this.squareShape = new fabric.Rect({
            left: this.origX,
            top: this.origY,
            originX: 'left',
            originY: 'top',
            stroke: this.color,
            strokeWidth: this.width,
            fill: this.fill,
            selectable: true,
            width: 1,
            height: 1,
            objectCaching: false, // Disable object caching for better interaction
        });

        this.canvas.add(this.squareShape);
    },

    resizeSquare: function (pointer: { x: number; y: number }) {
        const newWidth = Math.abs(this.origX - pointer.x);
        const newHeight = Math.abs(this.origY - pointer.y);

        if (this.origX > pointer.x) {
            this.squareShape.set({ left: pointer.x });
        }
        if (this.origY > pointer.y) {
            this.squareShape.set({ top: pointer.y });
        }

        this.squareShape.set({
            width: newWidth,
            height: newHeight,
        });

        this.squareShape.setCoords(); // Update the coordinates of the rectangle
        this.canvas.renderAll();
    },

    stopDrawing: function () {
        this.isDrawing = false;
        if (this.squareShape) {
            this.squareShape.setCoords(); // Ensure the bounding box is properly updated
        }
        this.squareShape = null;
    },
});

/**
 * RectangleCreator class
 * @class fabric.RectangleCreator
 * @extends fabric.BaseBrush
 */
const RectangleCreator: {
    new(canvas: fabric.StaticCanvas): RectangleCreatorInterface;
} = RectangleCreatorImp;

(fabric as any).RectangleCreator = RectangleCreator;
export default RectangleCreator;
