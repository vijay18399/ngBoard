declare const fabric: any;

export interface EllipseCreatorInterface extends fabric.BaseBrush {
    onMouseDown(pointer: { x: number; y: number }, ev: any): void;
    onMouseMove(pointer: { x: number; y: number }, ev: any): void;
    onMouseUp(ev?: any): void;
}

const EllipseCreatorImp = fabric.util.createClass(fabric.BaseBrush, {
    initialize: function (canvas: fabric.Canvas) {
        this.canvas = canvas;
        this.isDrawing = false;
        this.ellipseShape = null;
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
        if (this.isDrawing && this.ellipseShape) {
            this.resizeCircle(pointer);
        }
    },

    onMouseUp: function (ev?: any) {
        this.stopDrawing();
    },

    startDrawing: function (pointer: { x: number; y: number }) {
        this.isDrawing = true;
        this.origX = pointer.x;
        this.origY = pointer.y;
        this.ellipseShape = new fabric.Ellipse({
            left: this.origX,
            top: this.origY,
            originX: 'center',
            originY: 'center',
            angle: 0,
            stroke: this.color,
            strokeWidth: this.width,
            rx: 0, // Initial radius X
            ry: 0, // Initial radius Y
            fill: this.fill,
            transparentCorners: false,
            selectable: true,  // Ensure the object is selectable
            hasControls: true,
            hasBorders: true,
            objectCaching: false,
        });

        this.canvas.add(this.ellipseShape);
    },

    resizeCircle: function (pointer: { x: number; y: number }) {
      let rx = Math.abs(this.origX - pointer.x) / 2;
      let ry = Math.abs(this.origY - pointer.y) / 2;

      if (rx > this.ellipseShape.strokeWidth) {
          rx -= this.ellipseShape.strokeWidth / 2;
      }
      if (ry > this.ellipseShape.strokeWidth) {
          ry -= this.ellipseShape.strokeWidth / 2;
      }

      this.ellipseShape.set({
          rx: rx,
          ry: ry,
      });

      if (this.origX > pointer.x) {
          this.ellipseShape.set({ originX: 'right' });
      } else {
          this.ellipseShape.set({ originX: 'left' });
      }

      if (this.origY > pointer.y) {
          this.ellipseShape.set({ originY: 'bottom' });
      } else {
          this.ellipseShape.set({ originY: 'top' });
      }

      this.canvas.renderAll();
    },

    stopDrawing: function () {
        this.isDrawing = false;
        if (this.ellipseShape) {
            this.ellipseShape.setCoords();
        }
        this.ellipseShape = null;
    },
});

/**
 * EllipseCreator class
 * @class fabric.EllipseCreator
 * @extends fabric.BaseBrush
 */
const EllipseCreator: {
    new(canvas: fabric.StaticCanvas): EllipseCreatorInterface;
} = EllipseCreatorImp;

(fabric as any).EllipseCreator = EllipseCreator;
export default EllipseCreator;
