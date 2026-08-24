export type CropAreaPixels = {
  width: number;
  height: number;
  x: number;
  y: number;
};

export async function createCroppedImage(
  imageSrc: string,
  crop: CropAreaPixels,
  fileName = "cropped-image.webp"
): Promise<File> {
  const image = await loadImage(imageSrc);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not create image canvas.");
  }

  const width = Math.max(1, Math.round(crop.width));
  const height = Math.max(1, Math.round(crop.height));

  canvas.width = width;
  canvas.height = height;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    image,
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
    canvas.toBlob(resolve, "image/webp", 0.95)
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
      reject(new Error("Could not load the selected image."));

    image.src = src;
  });
}
