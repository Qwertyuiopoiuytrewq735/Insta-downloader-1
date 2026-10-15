import { EnhancementSettings } from '../types/instagram';

/**
 * Applies sharpening, clarity, color grading, presets and scale onto a target HTML5 Canvas
 */
export function applyImageEnhancements(
  sourceImage: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement,
  targetCanvas: HTMLCanvasElement,
  settings: EnhancementSettings
): void {
  const ctx = targetCanvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;

  const originalWidth = ('videoWidth' in sourceImage ? sourceImage.videoWidth : sourceImage.width) || 800;
  const originalHeight = ('videoHeight' in sourceImage ? sourceImage.videoHeight : sourceImage.height) || 800;

  const scale = settings.scale || 1;
  const targetWidth = Math.round(originalWidth * scale);
  const targetHeight = Math.round(originalHeight * scale);

  targetCanvas.width = targetWidth;
  targetCanvas.height = targetHeight;

  // Smoothing for upscaling
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Apply CSS-based filters first for GPU acceleration
  let filterString = '';

  // Brightness: -50 to +50 -> 0.5 to 1.5
  const brightnessVal = 1 + (settings.brightness / 100);
  filterString += `brightness(${Math.max(0.2, brightnessVal)}) `;

  // Contrast: -50 to +50 -> 0.5 to 1.5
  const contrastVal = 1 + (settings.contrast / 100);
  filterString += `contrast(${Math.max(0.2, contrastVal)}) `;

  // Vibrance / Saturation
  const satVal = 1 + (settings.vibrance / 80);
  filterString += `saturate(${Math.max(0, satVal)}) `;

  // Warmth via sepia/hue
  if (settings.warmth !== 0) {
    if (settings.warmth > 0) {
      filterString += `sepia(${settings.warmth * 0.4}%) hue-rotate(-${settings.warmth * 0.15}deg) `;
    } else {
      filterString += `hue-rotate(${Math.abs(settings.warmth) * 0.3}deg) `;
    }
  }

  // Preset Filters
  switch (settings.preset) {
    case 'valencia':
      filterString += 'sepia(25%) contrast(108%) brightness(108%) saturate(110%) ';
      break;
    case 'clarendon':
      filterString += 'contrast(125%) saturate(125%) brightness(104%) ';
      break;
    case 'juno':
      filterString += 'contrast(115%) saturate(135%) brightness(102%) sepia(10%) ';
      break;
    case 'lark':
      filterString += 'contrast(95%) brightness(110%) saturate(115%) ';
      break;
    case 'gingham':
      filterString += 'brightness(105%) contrast(90%) sepia(20%) ';
      break;
    case 'moon':
      filterString += 'grayscale(100%) contrast(130%) brightness(105%) ';
      break;
    case 'sunset':
      filterString += 'contrast(118%) saturate(140%) sepia(30%) hue-rotate(-12deg) ';
      break;
    default:
      break;
  }

  ctx.filter = filterString.trim() || 'none';
  ctx.drawImage(sourceImage, 0, 0, targetWidth, targetHeight);
  ctx.filter = 'none'; // reset filter for pixel manipulation

  // If sharpness or clarity is enabled, run convolution on pixel data
  if (settings.sharpness > 0 || settings.clarity > 0) {
    try {
      const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight);
      const data = imgData.data;
      const w = targetWidth;
      const h = targetHeight;

      // Copy buffer for convolution
      const copy = new Uint8ClampedArray(data);

      const sharpWeight = (settings.sharpness / 100) * 0.4;
      const clarityWeight = (settings.clarity / 100) * 0.25;

      // Unsharp mask 3x3 kernel
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const idx = (y * w + x) * 4;

          for (let c = 0; c < 3; c++) {
            const center = copy[idx + c];
            const top = copy[((y - 1) * w + x) * 4 + c];
            const bottom = copy[((y + 1) * w + x) * 4 + c];
            const left = copy[(y * w + (x - 1)) * 4 + c];
            const right = copy[(y * w + (x + 1)) * 4 + c];

            // Laplacian edge difference
            const laplacian = 4 * center - (top + bottom + left + right);
            const sharpened = center + laplacian * sharpWeight;

            // Local contrast clarity
            const avgSurround = (top + bottom + left + right) * 0.25;
            const diff = center - avgSurround;
            const claritied = sharpened + diff * clarityWeight;

            data[idx + c] = Math.min(255, Math.max(0, claritied));
          }
        }
      }
      ctx.putImageData(imgData, 0, 0);
    } catch {
      // If cross-origin prevents pixel manipulation, canvas still displays filtered image
    }
  }
}
