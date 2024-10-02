declare const fabric: any;
export interface TextCreatorInterface extends fabric.BaseBrush {
    onMouseDown(pointer: { x: number; y: number }, ev: any): void;
    onMouseMove(pointer: { x: number; y: number }, ev: any): void;
    onMouseUp(pointer: { x: number; y: number }, ev: any): void;
}

const TextCreatorImp = <any>fabric.util.createClass(fabric.BaseBrush, {


    /**
     * Constructor
     * @param {fabric.Canvas} canvas
     * @return {Pointer} Instance of a pencil brush
     */
    initialize: function (canvas: fabric.Canvas) {
        this.canvas = canvas;
        this.isEditing = false;
    },
    setFontFamily(ff: string) {
        this.fontFamily = ff;
    },
    /**
     * Inovoked on mouse down
     * @param {Object} pointer
     * @param {Object} ev
     */
    onMouseDown: function (
        pointer: any,
        ev: any
    ) {
        this.canvas._objects.forEach((obj: any) => {
            if (obj.type == 'i-text' && obj.text == '') {
                this.canvas.remove(obj)
            }
        });
        if (this.isEditing) {
            var object = this.canvas.findTarget(pointer, true);
            if (object && object.type == 'i-text') {
                this.canvas.setActiveObject(object);
                object.enterEditing();
                return;
            }
        }

        this.fabicText = new fabric.IText('', {
            left: pointer.x,
            top: pointer.y,
            fontFamily: this.fontFamily,
            fill: this.color,
            fontSize: this.width * 10 || 25,
        });

        this.canvas.add(this.fabicText)
        this.canvas.setActiveObject(this.fabicText);
        this.fabicText.enterEditing();
        this.isEditing = true;
    },
    /**
     * Inovoked on mouse move
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

    }

});

/**
 * TextCreator class
 * @class fabric.TextCreator
 * @extends fabric.BaseBrush
 */
const TextCreator: {
    new(canvas: fabric.StaticCanvas): TextCreatorInterface;
} = TextCreatorImp;

(fabric as any).TextCreator = TextCreator;
export default TextCreator;
