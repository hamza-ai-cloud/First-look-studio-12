export type CropAreaPixels = {
  width: number;
  height: number;
  x: number;
  y: number;
};

export type ImageTransformOptions = {
  rotation?: number;
  flipH?: boolean;
  flipV?: boolean;
};

export async function createCroppedImage(
  imageSrc: string,
  crop: CropAreaPixels,
  fileName = "cropped-image.webp",
  options: ImageTransformOptions = {}
): Promise<File> {
  const image = await loadImage(imageSrc);

  const rotation =
    ((options.rotation ?? 0) % 360 + 360) % 360;

  const flipH = options.flipH ?? false;
  const flipV = options.flipV ?? false;

  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;

  const radians = (rotation * Math.PI) / 180;
  const sin = Math.abs(Math.sin(radians));
  const cos = Math.abs(Math.cos(radians));

  const rotatedWidth = Math.ceil(
    sourceWidth * cos + sourceHeight * sin
  );

  const rotatedHeight = Math.ceil(
    sourceWidth * sin + sourceHeight * cos
  );

  const sourceCanvas = document.createElement("canvas");
  sourceCanvas.width = rotatedWidth;
  sourceCanvas.height = rotatedHeight;

  const sourceContext = sourceCanvas.getContext("2d");

  if (!sourceContext) {
    throw new Error("Could not create image canvas.");
  }

  sourceContext.imageSmoothingEnabled = true;
  sourceContext.imageSmoothingQuality = "high";

  sourceContext.translate(
    rotatedWidth / 2,
    rotatedHeight / 2
  );

  sourceContext.rotate(radians);

  sourceContext.scale(
    flipH ? -1 : 1,
    flipV ? -1 : 1
  );

  sourceContext.drawImage(
    image,
    -sourceWidth / 2,
    -sourceHeight / 2,
    sourceWidth,
    sourceHeight
  );

  const width = Math.max(1, Math.round(crop.width));
  const height = Math.max(1, Math.round(crop.height));

  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = width;
  outputCanvas.height = height;

  const outputContext = outputCanvas.getContext("2d");

  if (!outputContext) {
    throw new Error("Could not create output canvas.");
  }

  outputContext.imageSmoothingEnabled = true;
  outputContext.imageSmoothingQuality = "high";

  outputContext.drawImage(
    sourceCanvas,
    Math.round(crop.x),
    Math.round(crop.y),
    width,
    height,
    0,
    0,
    width,
    height
  );

  const blob = await new Promise<Blob | null>((resolve) =>
    outputCanvas.toBlob(resolve, "image/webp", 0.95)
  );

  if (!blob) {
    throw new Error("Could not create cropped image.");
  }

  return new File([blob], fileName, {
    type: "image/webp",
    lastModified: Date.now(),
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);

    image.onerror = () =>
      reject(
        new Error("Could not load the selected image.")
      );

    image.src = src;
  });
}
