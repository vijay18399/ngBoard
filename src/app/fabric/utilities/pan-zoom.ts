declare const fabric: any;
import cursorMap from 'src/app/config/cursor.config';

class PanZoom {
  private canvas: fabric.Canvas;
  private isDragging: boolean;
  private lastPosX: number;
  private lastPosY: number;
  private originalSelectableState: boolean[];
  private minZoom: number;
  private maxZoom: number;
  private zoomStartScale: number;

  constructor(canvas: fabric.Canvas, minZoom: number = 0.5, maxZoom: number = 5) {
    this.canvas = canvas;
    this.isDragging = false;
    this.lastPosX = 0;
    this.lastPosY = 0;
    this.originalSelectableState = [];
    this.minZoom = minZoom;
    this.maxZoom = maxZoom;
    this.zoomStartScale = 1;
    this.initialize();
  }

  private initialize() {
    // Disable selection for all objects during pan/zoom
    this.canvas.getObjects().forEach((obj: any) => {
      this.originalSelectableState.push(obj.selectable);
      obj.set({ selectable: false });
    });

    // Set initial cursor for hover and dragging
    this.canvas.hoverCursor = cursorMap['grab'];
    this.canvas.moveCursor = cursorMap['grabbing']; // for consistency during dragging
    this.canvas.renderAll();

    // Add event listeners
    this.addListeners();
  }

  private addListeners() {
    this.canvas.on('mouse:down', this.onMouseDown);
    this.canvas.on('mouse:move', this.onMouseMove);
    this.canvas.on('mouse:up', this.onMouseUp);
    this.canvas.on('mouse:out', this.onMouseUp);  // To handle mouse out
    this.canvas.on('mouse:wheel', this.onMouseWheel);
    this.canvas.on('touch:gesture', this.onTouchGesture);
  }

  private onTouchGesture = (event: any) => {
    if (event.e.touches && event.e.touches.length === 2) {
      const point = new fabric.Point(event.self.x, event.self.y);
      if (event.self.state === 'start') {
        this.zoomStartScale = this.canvas.getZoom();
      }
      const delta = this.zoomStartScale * event.self.scale;
      this.canvas.zoomToPoint(point, delta);
    }
  }

  private onMouseDown = (event: any) => {
    const evt = event.e;
    this.isDragging = true;
    this.lastPosX = evt.clientX || evt.changedTouches[0].clientX;
    this.lastPosY = evt.clientY || evt.changedTouches[0].clientY;
    this.canvas.selection = false;
    this.canvas.setCursor(cursorMap['grabbing']); // Change cursor to grabbing on drag start
    this.canvas.renderAll();
  };

  private onMouseMove = (event: any) => {
    if (this.isDragging) {
      const evt = event.e;
      const vpt = this.canvas.viewportTransform!;
      vpt[4] += (evt.clientX || evt.changedTouches[0].clientX) - this.lastPosX;
      vpt[5] += (evt.clientY || evt.changedTouches[0].clientY) - this.lastPosY;
      this.canvas.requestRenderAll();
      this.lastPosX = evt.clientX || evt.changedTouches[0].clientX;
      this.lastPosY = evt.clientY || evt.changedTouches[0].clientY;
    }else{
      this.canvas.setCursor(cursorMap['grab']);
    }
  };

  private onMouseUp = () => {
    this.isDragging = false;
    this.canvas.selection = true;
    this.canvas.setCursor(cursorMap['grab']);
    this.canvas.renderAll();
  };

  private onMouseWheel = (event: fabric.IEvent) => {
    const evt = event.e as WheelEvent;
    let zoom = this.canvas.getZoom();
    zoom *= 0.999 ** evt.deltaY;
    if (zoom > this.maxZoom) zoom = this.maxZoom;
    if (zoom < this.minZoom) zoom = this.minZoom;

    this.canvas.zoomToPoint({ x: evt.offsetX, y: evt.offsetY }, zoom);
    evt.preventDefault();
    evt.stopPropagation();
  };

  public removeListeners() {
    // Restore original selectable state for all objects
    this.canvas.getObjects().forEach((obj, index) => {
      obj.set({ selectable: this.originalSelectableState[index] });
    });

    // Remove event listeners
    this.canvas.off('mouse:down', this.onMouseDown);
    this.canvas.off('mouse:move', this.onMouseMove);
    this.canvas.off('mouse:up', this.onMouseUp);
    this.canvas.off('mouse:out', this.onMouseUp);
    this.canvas.off('mouse:wheel', this.onMouseWheel);
    this.canvas.off('touch:gesture', this.onTouchGesture);

    // Reset cursor to default
    this.canvas.setCursor('default');
    this.canvas.renderAll();
  }
}

export default PanZoom;
