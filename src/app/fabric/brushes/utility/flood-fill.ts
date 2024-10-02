export function drawFill(
  mainCanvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  tolerance:number,
  startX: number,
  startY: number,
  fillR: number,
  fillG: number,
  fillB: number,
  fillA: number,
  imageDataCallback: Function
): void {
  const cWidth = mainCanvas.width;
  const cHeight = mainCanvas.height;
  startX = Math.max(0, Math.min(Math.floor(startX), cWidth));
  startY = Math.max(0, Math.min(Math.floor(startY), cHeight));
  const stack = [[startX, startY]];
  const filledImageData = ctx.createImageData(cWidth, cHeight);
  const id = ctx.getImageData(0, 0, cWidth, cHeight);
  let pixelPos = (startY * cWidth + startX) * 4;
  const startR = id.data[pixelPos + 0];
  const startG = id.data[pixelPos + 1];
  const startB = id.data[pixelPos + 2];
  const startA = id.data[pixelPos + 3];

  // Variables to keep track of the bounding box of the filled region
  let minX = startX;
  let maxX = startX;
  let minY = startY;
  let maxY = startY;

  if (
    Math.abs(fillR - startR) <= tolerance &&
    Math.abs(fillG - startG) <= tolerance &&
    Math.abs(fillB - startB) <= tolerance &&
    Math.abs(fillA - startA) <= tolerance
  ) {
    return;
  }

  while (stack.length) {
    let newPos;
    let x;
    let y;
    let reachLeft;
    let reachRight;
    newPos = stack.pop()!;
    x = newPos[0];
    y = newPos[1];

    pixelPos = (y * cWidth + x) * 4;
    while (shouldFillAt(pixelPos)) {
      y--;
      pixelPos = (y * cWidth + x) * 4;
    }
    reachLeft = false;
    reachRight = false;

    while (true) {
      y++;
      pixelPos = (y * cWidth + x) * 4;

      if (!(y < cHeight && shouldFillAt(pixelPos))) {
        break;
      }

      doFillAt(pixelPos);

      // Update bounding box
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;

      if (x > 0) {
        if (shouldFillAt(pixelPos - 4)) {
          if (!reachLeft) {
            stack.push([x - 1, y]);
            reachLeft = true;
          }
        } else if (reachLeft) {
          reachLeft = false;
        }
      }

      if (x < cWidth - 1) {
        if (shouldFillAt(pixelPos + 4)) {
          if (!reachRight) {
            stack.push([x + 1, y]);
            reachRight = true;
          }
        } else if (reachRight) {
          reachRight = false;
        }
      }

      pixelPos += cWidth * 4;
    }
  }

  // Calculate the width and height of the filled region
  const filledWidth = maxX - minX + 1;
  const filledHeight = maxY - minY + 1;

  // Create a new ImageData object for the filled region
  const croppedImageData = ctx.createImageData(filledWidth, filledHeight);
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const srcPos = (y * cWidth + x) * 4;
      const destPos = ((y - minY) * filledWidth + (x - minX)) * 4;
      croppedImageData.data[destPos + 0] = filledImageData.data[srcPos + 0];
      croppedImageData.data[destPos + 1] = filledImageData.data[srcPos + 1];
      croppedImageData.data[destPos + 2] = filledImageData.data[srcPos + 2];
      croppedImageData.data[destPos + 3] = filledImageData.data[srcPos + 3];
    }
  }

  // Pass the cropped image data to the callback
  imageDataCallback(croppedImageData, minX, minY, filledWidth, filledHeight);

  function shouldFillAt(pixelPos: number): boolean {
    return (
      Math.abs(id.data[pixelPos + 0] - startR) <= tolerance &&
      Math.abs(id.data[pixelPos + 1] - startG) <= tolerance &&
      Math.abs(id.data[pixelPos + 2] - startB) <= tolerance
    );
  }

  function doFillAt(pixelPos: number): void {
    id.data[pixelPos + 0] = fillR;
    id.data[pixelPos + 1] = fillG;
    id.data[pixelPos + 2] = fillB;
    id.data[pixelPos + 3] = fillA;
    filledImageData.data[pixelPos + 0] = fillR;
    filledImageData.data[pixelPos + 1] = fillG;
    filledImageData.data[pixelPos + 2] = fillB;
    filledImageData.data[pixelPos + 3] = fillA;
  }
}
