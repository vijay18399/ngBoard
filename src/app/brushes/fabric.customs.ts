import { fabric } from 'fabric';

export function setCustoms(color: string, canvas: any) {
  fabric.Object.prototype.set({
    transparentCorners: false,
    cornerColor: color,
    cornerStrokeColor: color,
    borderColor: color,
    cornerSize: 9,
    padding: 0,
    cornerStyle: 'rect',
     borderDashArray: [3, 3],
    
  })
  fabric.Object.prototype.setControlVisible('mtr',false)
  canvas.selectionBorderColor = color;
  var rotateIcon = "data:image/png;base64,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";
  var rotateImg = document.createElement('img');
  rotateImg.src = rotateIcon;
  function renderIcon(icon: HTMLImageElement) {
    return function renderIcon(ctx: any, left: any, top: any, styleOverride: any, fabricObject: any) {
      var size = 15;
      ctx.save();
      ctx.translate(left, top);
      ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
      ctx.drawImage(icon, -size / 2, -size / 2, size, size);
      ctx.restore();
    }
  }
  fabric.Object.prototype.controls['rotateControl'] = new fabric.Control({
    x: 0.5,
    y: 0.5,
    offsetY: 12,
    offsetX: 12,
    cursorStyle: 'pointer',
    actionHandler: fabric.controlsUtils.rotationWithSnapping,
    actionName: 'rotate',
    render: renderIcon(rotateImg)
  });

}

export function deleteObject(eventData: any, transform: any) {
  var target = transform.target;
  var canvas = target.canvas;
  canvas.remove(target);
  canvas.requestRenderAll();
  return true;
}

export function cloneObject(eventData: any, transform: any) {
  var target = transform.target;
  var canvas = target.canvas;
  target.clone(function (cloned: { left: number; top: number; }) {
    cloned.left += 10;
    cloned.top += 10;
    canvas.add(cloned);
  });
  return true;
}