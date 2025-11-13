/**
 * Utility function to get cropped image as blob
 */
export default async function getCroppedImg(
  imageSrc: string,
  pixelCrop: any,
  rotation = 0
): Promise<Blob> {
  const image = new Image();
  image.src = imageSrc;

  return new Promise((resolve, reject) => {
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Canvas context not available"));
        return;
      }

      const maxSize = Math.max(image.naturalWidth, image.naturalHeight);
      const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

      // set each dimensions to double largest dimension to allow for a safe area for the
      // image to rotate in without being clipped by canvas context
      canvas.width = safeArea;
      canvas.height = safeArea;

      // translate canvas context to a central location on image to allow rotating around the center.
      ctx.translate(safeArea / 2, safeArea / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-safeArea / 2, -safeArea / 2);

      // draw rotated image and store data.
      ctx.drawImage(
        image,
        safeArea / 2 - image.naturalWidth / 2,
        safeArea / 2 - image.naturalHeight / 2
      );

      const data = ctx.getImageData(0, 0, safeArea, safeArea);

      // set canvas width to final desired crop size - this will clear existing context
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      // paste generated rotated image with correct offsets for x,y crop values.
      ctx.putImageData(
        data,
        Math.round(0 - safeArea / 2 + image.naturalWidth / 2 - pixelCrop.x),
        Math.round(0 - safeArea / 2 + image.naturalHeight / 2 - pixelCrop.y)
      );

      // As Base64 string
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to create blob"));
        }
      }, "image/jpeg", 0.95);
    };

    image.onerror = () => {
      reject(new Error("Failed to load image"));
    };
  });
}
