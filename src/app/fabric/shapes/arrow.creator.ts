declare const fabric: any;

export interface ArrowCreatorInterface extends fabric.BaseBrush {
    onMouseDown(pointer: { x: number; y: number }, ev: any): void;
    onMouseMove(pointer: { x: number; y: number }, ev: any): void;
    onMouseUp(pointer: { x: number; y: number }, ev: any): void;
}

const ArrowCreatorImp = fabric.util.createClass(fabric.BaseBrush, {
    initialize: function (canvas: fabric.Canvas) {
        this.canvas = canvas;
        this.isDrawing = false;
        this.arrowLine = null;
        this.arrowHead = null;
        this.deltaX = 0;
        this.deltaY = 0;
    },

    onMouseDown: function (pointer: { x: number; y: number }, ev: any) {
        this.startDrawing(pointer, ev);
    },

    onMouseMove: function (pointer: { x: number; y: number }, ev: any) {
        if (this.isDrawing && this.arrowLine && this.arrowHead) {
            this.updateArrow(pointer);
        }
    },

    onMouseUp: function (pointer: { x: number; y: number }, ev: any, uuid: string) {
        this.finalizeArrow(pointer, uuid);
    },

    startDrawing: function (pointer: { x: number; y: number }, ev: any) {
        const points = [pointer.x, pointer.y, pointer.x, pointer.y];

        this.arrowLine = new fabric.Line(points, {
            hoverCursor: 'default',
            hasBorders: false,
            selectable: true,
            fill: this.fill,
            stroke: this.color,
            strokeWidth: this.width,
            originX: 'center',
            originY: 'center',
            transparentCorners: false,
        });

        const centerX = (this.arrowLine.x1 + this.arrowLine.x2) / 2;
        const centerY = (this.arrowLine.y1 + this.arrowLine.y2) / 2;
        this.deltaX = this.arrowLine.left - centerX;
        this.deltaY = this.arrowLine.top - centerY;

        this.arrowHead = new fabric.Triangle({
            left: this.arrowLine.get('x1') + this.deltaX,
            top: this.arrowLine.get('y1') + this.deltaY,
            originX: 'center',
            originY: 'center',
            hoverCursor: 'default',
            hasBorders: false,
            selectable: true,
            angle: -45,
            width: 10,
            height: 10,
            fill: this.fill,
            stroke: this.color,
            strokeWidth: this.width,
        });

        this.canvas.add(this.arrowLine, this.arrowHead);
        this.isDrawing = true;
    },

    updateArrow: function (pointer: { x: number; y: number }) {
        this.arrowLine.set({
            x2: pointer.x,
            y2: pointer.y,
        });

        this.arrowHead.set({
            left: pointer.x + this.deltaX,
            top: pointer.y + this.deltaY,
            angle: this.calculateArrowAngle(
                this.arrowLine.x1,
                this.arrowLine.y1,
                this.arrowLine.x2,
                this.arrowLine.y2
            ),
        });

        this.canvas.renderAll();
    },

    finalizeArrow: function (pointer: { x: number; y: number }, uuid: string) {
        this.isDrawing = false;

        const group = new fabric.Group([this.arrowLine, this.arrowHead], {
            hoverCursor: 'default',
            hasBorders: true,
            selectable: true,
        });

        this.canvas.remove(this.arrowLine, this.arrowHead);
        this.canvas.add(group);
        this.canvas.renderAll();

        this.arrowLine = null;
        this.arrowHead = null;
    },

    calculateArrowAngle: function (x1: number, y1: number, x2: number, y2: number): number {
        const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
        return angle + 90;
    },
});

/**
 * ArrowCreator class
 * @class fabric.ArrowCreator
 * @extends fabric.BaseBrush
 */
const ArrowCreator: {
    new(canvas: fabric.StaticCanvas): ArrowCreatorInterface;
} = ArrowCreatorImp;

(fabric as any).ArrowCreator = ArrowCreator;
export default ArrowCreator;
