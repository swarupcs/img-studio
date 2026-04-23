/**
 * Shared image processing utilities.
 * Used by both client-side store actions and server-side API routes.
 */

/** Convert a data-URL to a Blob */
export function dataURLtoBlob(dataurl: string): Blob {
  const arr = dataurl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * Resize a data-URL image if it exceeds the given size limit.
 * First tries WebP compression to preserve dimensions, then scales down.
 */
export async function resizeImageIfNeeded(
  dataurl: string,
  maxSizeMB: number = 4.5,
): Promise<string> {
  const blob = dataURLtoBlob(dataurl);
  const maxBytes = maxSizeMB * 1024 * 1024;
  if (blob.size <= maxBytes) return dataurl;

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(dataurl);

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Try WebP compression first to preserve dimensions
      let newDataUrl = canvas.toDataURL('image/webp', 0.9);
      let newBlob = dataURLtoBlob(newDataUrl);

      if (newBlob.size <= maxBytes) {
        return resolve(newDataUrl);
      }

      // If still too big, scale down dimensions
      let scale = Math.sqrt(maxBytes / newBlob.size) * 0.95;

      const attemptResize = () => {
        canvas.width = Math.floor(img.width * scale);
        canvas.height = Math.floor(img.height * scale);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        newDataUrl = canvas.toDataURL('image/webp', 0.9);
        newBlob = dataURLtoBlob(newDataUrl);

        if (newBlob.size <= maxBytes) {
          resolve(newDataUrl);
        } else {
          scale *= 0.9;
          if (scale < 0.1) return resolve(newDataUrl);
          attemptResize();
        }
      };
      attemptResize();
    };
    img.onerror = () => resolve(dataurl);
    img.src = dataurl;
  });
}

/** Extract the MIME type from a data-URL (defaults to image/png) */
export function getMimeType(dataUrl: string): string {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,/);
  return match ? match[1] : 'image/png';
}

/** Strip the data-URL prefix, returning the raw base64 content */
export function cleanBase64Image(dataUrl: string): string {
  return dataUrl.replace(/^data:(.*);base64,/, '');
}

/** Convert a File to a base64 string */
export async function fileToBase64(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer).toString('base64');
}
