declare const fabric: any;
import { drawFill } from './utility/flood-fill';
import { hexToRgb } from './utility/color-utils';

interface BucketFillInterface extends fabric.BaseBrush {
    onMouseDown(pointer: { x: number; y: number }, ev: any): void;
    onMouseMove(pointer: { x: number; y: number }, ev: any): void;
    onMouseUp(pointer: { x: number; y: number }, ev: any): void;
}

const BucketFillImp = <any>fabric.util.createClass(fabric.BaseBrush, {
    initialize: function (canvas: fabric.Canvas) {
        this.canvas = canvas;
        this.tolerance = 0;
    },
    setFill: function (fill: string) {
        this.fill = fill;
    },
    setTolerance: function (tolerance: number) {
      this.tolerance = tolerance;
    },
    onMouseDown: function (pointer: { x: number; y: number }, ev: any) {
        const { x, y } = pointer;
        if (this.fill == 'transparent') this.fill = "#000000";
        this.fillArea(x, y, this.fill, this.canvas);
    },
    getRelativePoint: function (x: number, y: number) {
        const vt = this.canvas.viewportTransform;
        const scale = this.canvas.getZoom();
        const translatedX = vt[4];
        const translatedY = vt[5];
        return {
            x: (x * scale) + translatedX,
            y: (y * scale) + translatedY,
        };
    },
    fillArea: function (x: number, y: number, fillColor: string, canvas: any) {
        var point = this.getRelativePoint(x, y);
        x = point.x;
        y = point.y;
        const lowerCanvas = this.canvas.lowerCanvasEl;
        const context = lowerCanvas.getContext('2d');
        const [fillR, fillG, fillB] = hexToRgb(fillColor);
        const fillA = 255;

        drawFill(lowerCanvas, context, this.tolerance, x, y, fillR, fillG, fillB, fillA, function (imageData: ImageData, minX: number, minY: number, filledWidth: number, filledHeight: number) {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = filledWidth;
            tempCanvas.height = filledHeight;
            const tempContext = tempCanvas.getContext('2d');
            tempContext && (tempContext.imageSmoothingEnabled = true);
            if (tempContext) {
                tempContext.putImageData(imageData, 0, 0);
                const dataURL = tempCanvas.toDataURL();
                const scale = canvas.getZoom();
                fabric.Image.fromURL(dataURL, (img: any) => {
                    var leftOffset = (minX - canvas.viewportTransform[4]) / scale;
                    var topOffset = (minY - canvas.viewportTransform[5]) / scale;
                    img.left = leftOffset;
                    img.top = topOffset;
                    img.scaleX = 1 / scale;
                    img.scaleY = 1 / scale;
                    canvas.add(img);
                });
            }
        });
    },

    /**
     * Invoked on mouse move
     * @param {Object} pointer
     * @param {Object} ev
     */
    onMouseMove: function (
        pointer: { x: number; y: number } | any,
        ev: any
    ) {

    },
    /**
     * Invoked on mouse up
     * @param {Object} ev
     */
    onMouseUp: function (ev?: any) {
    },

});

const BucketFill: {
    new(canvas: fabric.StaticCanvas): BucketFillInterface;
} = BucketFillImp;

(fabric as any).BucketFill = BucketFill;
export default BucketFill;
