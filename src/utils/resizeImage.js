export function resizeImage(file, maxPx = 800, maxBytes = 200 * 1024) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxPx || height > maxPx) {
        if (width > height) { height = Math.round((height * maxPx) / width); width = maxPx; }
        else { width = Math.round((width * maxPx) / height); height = maxPx; }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);

      let quality = 0.85;
      function tryExport() {
        canvas.toBlob((blob) => {
          if (!blob) { reject(new Error("Canvas export failed")); return; }
          if (blob.size <= maxBytes || quality <= 0.4) { resolve(blob); return; }
          quality -= 0.1;
          tryExport();
        }, "image/jpeg", quality);
      }
      tryExport();
    };
    img.onerror = reject;
    img.src = url;
  });
}
