declare const fabric: any;
import { getStroke } from 'perfect-freehand';
export interface perfectHandInterface extends fabric.BaseBrush {

    onMouseDown(pointer: { x: number; y: number }, ev: any): void;
    onMouseMove(pointer: { x: number; y: number }, ev: any): void;
    onMouseUp(ev?: any): void;
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
        pointer: { x: number; y: number },
        ev: any
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
        pointer: { x: number; y: number },
        ev: any
    ) {
        this._points.push(pointer);
        this._render(this.ctx);
    },
    /**
     * Invoked on mouse up
     * @param {Object} ev
     */
    onMouseUp: function (ev?: any) {
        this.canvas.clearContext(this.canvas.contextTop);
        this._points = [];
        this.canvas.add(new fabric.Path(this.path, {
            strokeWidth: this.width,
            fill: this.color,
        }))
    },
    /**
 * Draw a smooth path on the topCanvas using quadraticCurveTo
 * @private
 * @param {CanvasRenderingContext2D} [ctx]
 */
    _render() {
        this.canvas.clearContext(this.canvas.contextTop);
        var _updatedPoints = this.updatePointsTransformed();
        const zoom = this.canvas.getZoom();
        const scaledWidth = this.width * zoom;
        var path = this.getSvgPathFromStroke(getStroke(_updatedPoints, {
            size: scaledWidth,
            thinning: 0.5,
            smoothing: 0.5,
            streamline: 0.5
        }));
        this.path = this.getSvgPathFromStroke(getStroke(this._points, {
            size: this.width,
            thinning: 0.5,
            smoothing: 0.5,
            streamline: 0.5
        }));
        let p = new Path2D(path);
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
    },
    updatePointsTransformed() {
        const vt = this.canvas.viewportTransform;
        const scale = this.canvas.getZoom();
        const translatedX = vt[4];
        const translatedY = vt[5];
        return this._points.map((point: { x: number, y: number }) => ({
            x: (point.x * scale) + translatedX,
            y: (point.y * scale) + translatedY,
        }));
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




// Optimise the Customised Brush and when zoom happened brush is not working
