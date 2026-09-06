/**
 * Compresses an image (as a data URL) by resizing it to a max dimension
 * and re-encoding it as JPEG. This is what keeps upload + OpenAI vision
 * calls fast — an uncompressed phone photo can be 5-15MB, which is the
 * main cause of slow "analyzing" times.
 *
 * Note: this uses a plain <img> + canvas, which does not always respect
 * EXIF orientation on every browser/device. If you start seeing sideways
 * or upside-down photos after this change, that's the next thing to fix
 * (read the EXIF orientation tag and rotate the canvas before drawing).
 */
export interface CompressOptions {
  /** Longest edge of the resized image, in pixels. */
  maxDimension?: number;
  /** JPEG quality, 0-1. */
  quality?: number;
}

const DEFAULT_OPTIONS: Required<CompressOptions> = {
  maxDimension: 1280,
  quality: 0.82,
};

export function compressImageDataUrl(
  dataUrl: string,
  options: CompressOptions = {}
): Promise<string> {
  const { maxDimension, quality } = { ...DEFAULT_OPTIONS, ...options };

  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const { width, height } = img;
      const scale = Math.min(1, maxDimension / Math.max(width, height));
      const targetWidth = Math.max(1, Math.round(width * scale));
      const targetHeight = Math.max(1, Math.round(height * scale));

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("compressImageDataUrl: could not get canvas 2d context"));
        return;
      }

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      try {
        resolve(canvas.toDataURL("image/jpeg", quality));
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      reject(new Error("compressImageDataUrl: failed to load image for compression"));
    };

    img.src = dataUrl;
  });
}
