import React, { useRef, useState, useEffect } from 'react';
import { MediaItem, ExtractedFrame } from '../types/instagram';
import { 
  X, 
  Scissors, 
  Camera, 
  Download, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  SkipBack, 
  SkipForward, 
  Play, 
  Pause, 
  Layers, 
  Check, 
  Trash2,
  Maximize2,
  Clock,
  Archive
} from 'lucide-react';
import { downloadCanvasFrame } from '../utils/downloadHelper';
import JSZip from 'jszip';

interface FrameExtractorModalProps {
  item: MediaItem | null;
  onClose: () => void;
  onSendToEnhancer: (dataUrl: string, title: string) => void;
}

export const FrameExtractorModal: React.FC<FrameExtractorModalProps> = ({
  item,
  onClose,
  onSendToEnhancer,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(15);
  const [isPlaying, setIsPlaying] = useState(false);
  const [extractedFrames, setExtractedFrames] = useState<ExtractedFrame[]>([]);
  const [selectedFrame, setSelectedFrame] = useState<ExtractedFrame | null>(null);
  const [isExtractingBurst, setIsExtractingBurst] = useState(false);
  const [burstProgress, setBurstProgress] = useState(0);
  const [exportFormat, setExportFormat] = useState<'image/png' | 'image/jpeg'>('image/png');

  useEffect(() => {
    if (item) {
      setExtractedFrames([]);
      setSelectedFrame(null);
      setCurrentTime(0);
    }
  }, [item]);

  if (!item) return null;

  const isVideo = item.type === 'reel' || (item.duration !== undefined && item.duration > 0);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || item.duration || 15);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const seekTo = (time: number) => {
    if (videoRef.current) {
      const clamped = Math.max(0, Math.min(duration, time));
      videoRef.current.currentTime = clamped;
      setCurrentTime(clamped);
    }
  };

  // Step precise frame (assuming 30fps -> 0.0333s)
  const stepFrame = (direction: -1 | 1) => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
      seekTo(currentTime + direction * (1 / 30));
    }
  };

  const stepSeconds = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
      seekTo(currentTime + seconds);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const captureCurrentFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const w = video.videoWidth || 1080;
    const h = video.videoHeight || 1920;
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, w, h);
    const dataUrl = canvas.toDataURL(exportFormat, 0.95);

    const newFrame: ExtractedFrame = {
      id: `frame_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: currentTime,
      timeFormatted: formatTimeDetailed(currentTime),
      dataUrl,
      width: w,
      height: h,
    };

    setExtractedFrames((prev) => [newFrame, ...prev]);
    setSelectedFrame(newFrame);
  };

  // Automatically captures burst of N frames across video duration
  const extractBurstFrames = async (count: number) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    setIsExtractingBurst(true);
    setBurstProgress(0);
    video.pause();
    setIsPlaying(false);

    const step = duration / (count + 1);
    const captured: ExtractedFrame[] = [];
    const origTime = video.currentTime;

    const w = video.videoWidth || 1080;
    const h = video.videoHeight || 1920;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    for (let i = 1; i <= count; i++) {
      const targetTime = i * step;
      video.currentTime = targetTime;

      // Wait for seeked event
      await new Promise<void>((resolve) => {
        const onSeeked = () => {
          video.removeEventListener('seeked', onSeeked);
          resolve();
        };
        video.addEventListener('seeked', onSeeked);
      });

      if (ctx) {
        ctx.drawImage(video, 0, 0, w, h);
        const dataUrl = canvas.toDataURL(exportFormat, 0.95);
        captured.push({
          id: `burst_${i}_${Date.now()}`,
          timestamp: targetTime,
          timeFormatted: formatTimeDetailed(targetTime),
          dataUrl,
          width: w,
          height: h,
        });
      }

      setBurstProgress(Math.round((i / count) * 100));
    }

    video.currentTime = origTime;
    setExtractedFrames((prev) => [...captured, ...prev]);
    if (captured.length > 0) {
      setSelectedFrame(captured[0]);
    }
    setIsExtractingBurst(false);
  };

  const handleDownloadSingleFrame = (frame: ExtractedFrame) => {
    const ext = exportFormat === 'image/png' ? 'png' : 'jpg';
    const filename = `${item.title.slice(0, 20).replace(/[^a-zA-Z0-9_-]/g, '_')}_frame_${frame.timeFormatted.replace(':', '_')}.${ext}`;
    
    const link = document.createElement('a');
    link.href = frame.dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAllFramesZip = async () => {
    if (extractedFrames.length === 0) return;
    const zip = new JSZip();
    const folder = zip.folder('extracted_frames') || zip;
    const ext = exportFormat === 'image/png' ? 'png' : 'jpg';

    extractedFrames.forEach((frame, idx) => {
      const base64Data = frame.dataUrl.split(',')[1];
      folder.file(`frame_${String(idx + 1).padStart(2, '0')}_${frame.timeFormatted.replace(':', '_')}.${ext}`, base64Data, { base64: true });
    });

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${item.title.slice(0, 20)}_extracted_frames_${extractedFrames.length}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatTimeDetailed = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = (secs % 60).toFixed(2);
    return `${mins}:${parseFloat(rem) < 10 ? '0' : ''}${rem}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="relative z-10 w-full max-w-5xl max-h-[95vh] bg-white text-slate-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-200">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 text-purple-700 rounded-xl">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>Reels Frame Extractor & Inspector</span>
                <span className="text-[11px] font-semibold px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full border border-purple-200">
                  Frame-by-Frame
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Extract high-resolution still images from any video frame with precision scrubbing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Format selector */}
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as any)}
              className="text-xs font-semibold bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 cursor-pointer"
            >
              <option value="image/png">Lossless PNG</option>
              <option value="image/jpeg">High Quality JPG</option>
            </select>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Video Scrubber & Playback */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            {/* Video Container */}
            <div className="relative aspect-[9/16] max-h-[360px] sm:max-h-[420px] mx-auto bg-black rounded-2xl overflow-hidden shadow-md flex items-center justify-center group">
              <video
                ref={videoRef}
                src={item.url}
                className="w-full h-full object-contain cursor-pointer"
                playsInline
                crossOrigin="anonymous"
                onClick={togglePlay}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
              />

              {/* Timecode Badge */}
              <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md text-white text-xs font-mono font-bold px-3 py-1 rounded-lg">
                {formatTimeDetailed(currentTime)}s / {formatTimeDetailed(duration)}s
              </div>
            </div>

            {/* Precision Scrubbing Bar */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>0:00.00</span>
                <span className="font-bold text-slate-800">
                  Current: {formatTimeDetailed(currentTime)} (Approx. Frame {Math.round(currentTime * 30)})
                </span>
                <span>{formatTimeDetailed(duration)}</span>
              </div>

              <input
                type="range"
                min="0"
                max={duration || 15}
                step="0.033"
                value={currentTime}
                onChange={(e) => seekTo(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />

              {/* Stepping and Playback Controls */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => stepSeconds(-1)}
                    className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    title="-1 Second"
                  >
                    <SkipBack className="w-3.5 h-3.5" />
                    <span>-1s</span>
                  </button>

                  <button
                    onClick={() => stepFrame(-1)}
                    className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    title="Previous Frame (1/30s)"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>-1 Frame</span>
                  </button>

                  <button
                    onClick={togglePlay}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlaying ? 'Pause' : 'Play'}</span>
                  </button>

                  <button
                    onClick={() => stepFrame(1)}
                    className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    title="Next Frame (1/30s)"
                  >
                    <span>+1 Frame</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => stepSeconds(1)}
                    className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    title="+1 Second"
                  >
                    <span>+1s</span>
                    <SkipForward className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Primary Capture Action */}
                <button
                  onClick={captureCurrentFrame}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-bold rounded-xl text-xs shadow-md transition-all hover:opacity-95 transform active:scale-95 cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Capture Frame</span>
                </button>
              </div>

              {/* Burst extraction shortcuts */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-200/60 text-xs">
                <span className="text-slate-500 font-medium">Automatic Burst:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => extractBurstFrames(6)}
                    disabled={isExtractingBurst}
                    className="px-2.5 py-1 bg-white hover:bg-purple-50 text-purple-700 border border-purple-200 rounded-lg font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    6 Keyframes
                  </button>
                  <button
                    onClick={() => extractBurstFrames(12)}
                    disabled={isExtractingBurst}
                    className="px-2.5 py-1 bg-white hover:bg-purple-50 text-purple-700 border border-purple-200 rounded-lg font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    12 Keyframes Burst
                  </button>
                </div>
              </div>

              {isExtractingBurst && (
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[11px] text-purple-700 font-semibold">
                    <span>Extracting frames across timeline...</span>
                    <span>{burstProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-200"
                      style={{ width: `${burstProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Captured Frames Gallery & Enhancer Bridge */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Extracted Frames Gallery ({extractedFrames.length})
                </h3>
              </div>

              {extractedFrames.length > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadAllFramesZip}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    title="Download all captured frames in a ZIP"
                  >
                    <Archive className="w-3 h-3 text-slate-500" />
                    <span>Zip All</span>
                  </button>

                  <button
                    onClick={() => {
                      setExtractedFrames([]);
                      setSelectedFrame(null);
                    }}
                    className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                    title="Clear extracted frames"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Active Selected Frame Preview & Enhancer Bridge */}
            {selectedFrame ? (
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-purple-200 space-y-3">
                <div className="relative aspect-[9/16] max-h-[220px] mx-auto rounded-xl overflow-hidden bg-black shadow-inner">
                  <img
                    src={selectedFrame.dataUrl}
                    alt="Captured frame"
                    className="w-full h-full object-contain"
                  />
                  <span className="absolute bottom-2 left-2 bg-black/70 text-white font-mono text-[10px] px-2 py-0.5 rounded-md font-bold">
                    {selectedFrame.timeFormatted}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {/* Download Individual Frame */}
                  <button
                    onClick={() => handleDownloadSingleFrame(selectedFrame)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download {exportFormat === 'image/png' ? 'PNG' : 'JPG'}</span>
                  </button>

                  {/* Send to Image Enhancer */}
                  <button
                    onClick={() => onSendToEnhancer(selectedFrame.dataUrl, `${item.title} Frame @ ${selectedFrame.timeFormatted}`)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-gradient-to-r from-pink-500 to-amber-500 hover:opacity-95 text-white font-bold rounded-xl text-xs shadow-xs transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Send to Enhancer</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-2">
                <Camera className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-600">
                  No frames captured yet
                </p>
                <p className="text-[11px] text-slate-400">
                  Scrub the video timeline and click &ldquo;Capture Frame&rdquo; or run a burst extraction to grab high-res stills.
                </p>
              </div>
            )}

            {/* Extracted Filmstrip Thumbnails */}
            {extractedFrames.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Filmstrip Reel:
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-56 overflow-y-auto p-1">
                  {extractedFrames.map((frame) => {
                    const isCurrent = selectedFrame?.id === frame.id;
                    return (
                      <div
                        key={frame.id}
                        onClick={() => setSelectedFrame(frame)}
                        className={`relative aspect-[9/16] rounded-xl overflow-hidden bg-black shadow-xs cursor-pointer transition-all ${
                          isCurrent
                            ? 'ring-2 ring-purple-600 scale-95 shadow-md'
                            : 'opacity-85 hover:opacity-100 hover:scale-[1.02]'
                        }`}
                      >
                        <img
                          src={frame.dataUrl}
                          alt={frame.timeFormatted}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1 right-1 bg-black/75 text-white font-mono text-[9px] px-1 rounded">
                          {frame.timeFormatted}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
