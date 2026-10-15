import JSZip from 'jszip';
import { MediaItem } from '../types/instagram';

/**
 * Downloads a single media item directly
 */
export async function downloadSingleMedia(item: MediaItem, customFilename?: string): Promise<void> {
  const isVideo = item.type === 'reel' || item.type === 'story' && item.url.endsWith('.mp4');
  const ext = isVideo ? 'mp4' : 'jpg';
  const filename = customFilename || `insta_${item.type}_${item.id}.${ext}`;

  try {
    const response = await fetch(item.url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);
  } catch {
    // Fallback if direct fetch is blocked by CORS: open in download anchor
    const link = document.createElement('a');
    link.href = item.url;
    link.target = '_blank';
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

/**
 * Downloads an extracted frame canvas directly as high-res PNG or JPEG
 */
export function downloadCanvasFrame(canvas: HTMLCanvasElement, filename: string, format: 'image/png' | 'image/jpeg' = 'image/png'): void {
  const dataUrl = canvas.toDataURL(format, 0.95);
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Downloads audio file
 */
export async function downloadAudioTrack(audioUrl: string, filename: string): Promise<void> {
  try {
    const res = await fetch(audioUrl);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.endsWith('.mp3') ? filename : `${filename}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  } catch {
    const link = document.createElement('a');
    link.href = audioUrl;
    link.target = '_blank';
    link.download = `${filename}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

/**
 * Bulk zip downloader for downloading reels, posts, stories, and highlights at once
 */
export async function downloadBulkAsZip(
  items: MediaItem[],
  username: string,
  onProgress: (percent: number, currentItem: string, stage: string) => void
): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder(`instagram_${username}_media`) || zip;
  const total = items.length;

  for (let i = 0; i < total; i++) {
    const item = items[i];
    const itemNum = String(i + 1).padStart(2, '0');
    const isVideo = item.type === 'reel' || (item.duration && item.duration > 0);
    const ext = isVideo ? 'mp4' : 'jpg';
    const filename = `${item.type}_${itemNum}_${item.id}.${ext}`;
    
    onProgress(
      Math.round(((i) / total) * 85),
      filename,
      `Fetching item ${i + 1} of ${total}: ${item.title.slice(0, 28)}...`
    );

    try {
      const response = await fetch(item.url);
      const blob = await response.blob();
      folder.file(filename, blob);

      // If item has audio info and requested, also save audio metadata/track
      if (item.audio && item.type === 'reel') {
        try {
          const audioRes = await fetch(item.audio.audioUrl);
          const audioBlob = await audioRes.blob();
          folder.file(`audio_${itemNum}_${item.audio.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.mp3`, audioBlob);
        } catch {
          // ignore individual audio failure in zip
        }
      }

      // If item has caption, save text file
      if (item.caption) {
        folder.file(`${item.type}_${itemNum}_caption.txt`, `${item.title}\n\n${item.caption}\n\nLikes: ${item.likes} | Comments: ${item.comments}\nTimestamp: ${item.timestamp}`);
      }
    } catch {
      // If direct fetch fails, generate a placeholder text marker so zip remains consistent
      folder.file(`${filename}.url.txt`, `Direct download URL: ${item.url}\n(Could not stream directly due to CORS restrictions)`);
    }
  }

  onProgress(90, 'Packaging ZIP archive...', 'Compressing all media into bundle...');

  const content = await zip.generateAsync(
    { type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } },
    (metadata) => {
      onProgress(85 + Math.round(metadata.percent * 0.15), 'Finalizing bundle...', `Compressing files (${Math.round(metadata.percent)}%)...`);
    }
  );

  const zipUrl = URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = zipUrl;
  link.download = `instagram_${username}_full_archive_${new Date().toISOString().slice(0, 10)}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => URL.revokeObjectURL(zipUrl), 30000);
}
