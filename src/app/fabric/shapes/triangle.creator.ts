declare const fabric: any;

export interface TriangleCreatorInterface extends fabric.BaseBrush {
    onMouseDown(pointer: { x: number; y: number }, ev: any): void;
    onMouseMove(pointer: { x: number; y: number }, ev: any): void;
    onMouseUp(ev?: any): void;
}

const TriangleCreatorImp = fabric.util.createClass(fabric.BaseBrush, {
    initialize: function (canvas: fabric.Canvas) {
        this.canvas = canvas;
        this.isDrawing = false;
        this.triangleShape = null;
        this.origX = 0;
        this.origY = 0;
        this.color = this.color;
        this.width = this.width;
        this.fill = this.fill;
    },

    onMouseDown: function (pointer: { x: number; y: number }, ev: any) {
        this.isDrawing = true;
        this.origX = pointer.x;
        this.origY = pointer.y;

        this.triangleShape = new fabric.Triangle({
            left: this.origX,
            top: this.origY,
            originX: 'center',
            originY: 'center',
            stroke: this.color,
            strokeWidth: this.width,
            fill: this.fill,
            selectable: true,
            transparentCorners: false,
            width: 1,
            height: 1,
            objectCaching: false, // Disable object caching for better interaction
        });

        this.canvas.add(this.triangleShape);
    },

    onMouseMove: function (pointer: { x: number; y: number }, ev: any) {
        if (!this.isDrawing || !this.triangleShape) return;

        const width = Math.abs(this.origX - pointer.x);
        const height = Math.abs(this.origY - pointer.y);

        this.triangleShape.set({
            width: width * 2,
            height: height * 2,
        });

        // Adjust position to ensure proper drawing direction
        if (pointer.x < this.origX) {
            this.triangleShape.set({ left: pointer.x });
        }
        if (pointer.y < this.origY) {
            this.triangleShape.set({ top: pointer.y });
        }

        this.triangleShape.setCoords(); // Update the coordinates of the triangle
        this.canvas.renderAll();
    },

    onMouseUp: function (ev?: any) {
        this.isDrawing = false;
        if (this.triangleShape) {
            this.triangleShape.setCoords(); // Ensure the bounding box is properly updated
        }
        this.triangleShape = null;
    }
});

/**
 * TriangleCreator class
 * @class fabric.TriangleCreator
 * @extends fabric.BaseBrush
 */
const TriangleCreator: {
    new(canvas: fabric.StaticCanvas): TriangleCreatorInterface;
} = TriangleCreatorImp;

(fabric as any).TriangleCreator = TriangleCreator;
export default TriangleCreator;
