import React, { useState, useEffect, useRef } from 'react';
import { MediaItem } from '../types/instagram';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Scissors, 
  Sparkles, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Heart, 
  Clock 
} from 'lucide-react';

interface StoryViewerModalProps {
  stories: MediaItem[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (item: MediaItem) => void;
  onExtractFrames: (item: MediaItem) => void;
  onEnhance: (item: MediaItem) => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  stories,
  initialIndex = 0,
  isOpen,
  onClose,
  onDownload,
  onExtractFrames,
  onEnhance,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setProgress(0);
  }, [initialIndex, isOpen]);

  const currentStory = stories[currentIndex] || stories[0];
  const isVideo = currentStory?.type === 'story' && currentStory.url.endsWith('.mp4');
  const durationMs = (currentStory?.duration || 6) * 1000;

  useEffect(() => {
    if (!isOpen || !currentStory) return;

    setProgress(0);
    const intervalTime = 50;
    const step = (intervalTime / durationMs) * 100;

    clearInterval(timerRef.current);

    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            handleNext();
            return 0;
          }
          return prev + step;
        });
      }, intervalTime);
    }

    return () => clearInterval(timerRef.current);
  }, [currentIndex, isPaused, isOpen, currentStory]);

  if (!isOpen || !currentStory) return null;

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-sm sm:max-w-md aspect-[9/16] max-h-[92vh] bg-black rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-700">
        {/* Top Story Progress Bars */}
        <div className="absolute top-3 left-3 right-3 z-30 flex items-center gap-1.5">
          {stories.map((s, idx) => (
            <div key={s.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-75"
                style={{
                  width: idx < currentIndex ? '100%' : idx === currentIndex ? `${progress}%` : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Top Header Controls */}
        <div className="absolute top-7 left-4 right-4 z-30 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <img
              src={currentStory.thumbnailUrl}
              alt=""
              className="w-8 h-8 rounded-full border border-white/50 object-cover"
            />
            <div className="text-xs font-bold leading-tight">
              <div>{currentStory.title}</div>
              <div className="text-[10px] text-white/70 font-normal">{currentStory.timestamp}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1.5 bg-black/40 hover:bg-black/60 rounded-full transition-colors cursor-pointer"
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>

            {isVideo && (
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 bg-black/40 hover:bg-black/60 rounded-full transition-colors cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 bg-black/40 hover:bg-black/60 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Media Content */}
        <div 
          className="relative flex-1 bg-black flex items-center justify-center overflow-hidden"
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {isVideo ? (
            <video
              ref={videoRef}
              src={currentStory.url}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted={isMuted}
              playsInline
              crossOrigin="anonymous"
            />
          ) : (
            <img
              src={currentStory.url}
              alt={currentStory.title}
              className="w-full h-full object-cover"
            />
          )}

          {/* Left / Right Tap zones */}
          <div
            onClick={handlePrev}
            className="absolute top-16 left-0 bottom-24 w-1/3 z-20 cursor-pointer"
          />
          <div
            onClick={handleNext}
            className="absolute top-16 right-0 bottom-24 w-1/3 z-20 cursor-pointer"
          />
        </div>

        {/* Bottom Actions & Caption */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/95 via-black/60 to-transparent z-30 space-y-3">
          <p className="text-white text-xs leading-snug line-clamp-2">
            {currentStory.caption}
          </p>

          <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/15">
            <button
              onClick={() => onDownload(currentStory)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Story</span>
            </button>

            {isVideo && (
              <button
                onClick={() => onExtractFrames(currentStory)}
                className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-semibold backdrop-blur-md cursor-pointer"
                title="Extract Frames"
              >
                <Scissors className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => onEnhance(currentStory)}
              className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-semibold backdrop-blur-md cursor-pointer"
              title="Enhance Image"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
