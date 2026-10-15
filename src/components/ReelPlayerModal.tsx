import React, { useRef, useState, useEffect } from 'react';
import { MediaItem } from '../types/instagram';
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Download, 
  Scissors, 
  Music, 
  Sparkles, 
  Heart, 
  MessageCircle, 
  Share2, 
  Repeat, 
  FastForward,
  Clock
} from 'lucide-react';

interface ReelPlayerModalProps {
  item: MediaItem | null;
  onClose: () => void;
  onDownload: (item: MediaItem) => void;
  onExtractFrames: (item: MediaItem) => void;
  onEnhance: (item: MediaItem) => void;
  onExtractAudio: (item: MediaItem) => void;
}

export const ReelPlayerModal: React.FC<ReelPlayerModalProps> = ({
  item,
  onClose,
  onDownload,
  onExtractFrames,
  onEnhance,
  onExtractAudio,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLooping, setIsLooping] = useState(true);

  useEffect(() => {
    if (item && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [item]);

  if (!item) return null;

  const isVideo = item.type === 'reel' || (item.duration !== undefined && item.duration > 0);

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

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || item.duration || 15);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const cycleSpeed = () => {
    const speeds = [0.5, 1, 1.25, 1.5, 2];
    const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setPlaybackRate(nextSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = nextSpeed;
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = Math.floor(secs % 60);
    return `${mins}:${String(rem).padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-4xl max-h-[92vh] bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-slate-700/80">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-30 p-2 bg-black/60 hover:bg-black/90 text-white rounded-full transition-colors cursor-pointer"
          title="Close modal (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Video Player Column */}
        <div className="relative flex-1 bg-black flex items-center justify-center min-h-[360px] md:min-h-[580px] overflow-hidden group">
          {isVideo ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <video
                ref={videoRef}
                src={item.url}
                className="max-h-[65vh] md:max-h-[82vh] w-auto max-w-full object-contain cursor-pointer"
                loop={isLooping}
                muted={isMuted}
                playsInline
                crossOrigin="anonymous"
                onClick={togglePlay}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
              />

              {/* Center Play Overlay Icon when paused */}
              {!isPlaying && (
                <div 
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/25 cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-md text-white flex items-center justify-center shadow-lg">
                    <Play className="w-7 h-7 fill-white text-white ml-1" />
                  </div>
                </div>
              )}

              {/* Bottom Video Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col gap-2">
                {/* Timeline Bar */}
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max={duration || 15}
                    step="0.05"
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-pink-500"
                  />
                  <span className="text-[11px] font-mono shrink-0 text-slate-300">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                {/* Control Buttons Bar */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={togglePlay}
                      className="p-1 hover:text-pink-400 transition-colors cursor-pointer"
                      title={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                    </button>

                    <button
                      onClick={toggleMute}
                      className="p-1 hover:text-pink-400 transition-colors cursor-pointer"
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={cycleSpeed}
                      className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 font-mono text-[11px] font-bold cursor-pointer"
                      title="Playback Speed"
                    >
                      {playbackRate}x
                    </button>

                    <button
                      onClick={() => setIsLooping(!isLooping)}
                      className={`p-1 transition-colors cursor-pointer ${isLooping ? 'text-pink-400' : 'text-slate-400'}`}
                      title="Toggle Loop"
                    >
                      <Repeat className="w-4 h-4" />
                    </button>
                  </div>

                  <span className="text-[11px] text-slate-400 font-medium">
                    1080 × 1920 HD
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <img
              src={item.url}
              alt={item.title}
              className="max-h-[65vh] md:max-h-[82vh] w-auto max-w-full object-contain"
            />
          )}
        </div>

        {/* Sidebar Info & Action Controls */}
        <div className="w-full md:w-80 p-5 sm:p-6 bg-slate-900 flex flex-col justify-between overflow-y-auto max-h-[45vh] md:max-h-full border-t md:border-t-0 md:border-l border-slate-800">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white uppercase tracking-wider">
                {item.type}
              </span>
              <span className="text-xs text-slate-400">{item.timestamp}</span>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-white mb-2 leading-snug">
              {item.title}
            </h3>

            {/* Audio attribution if present */}
            {item.audio && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 mb-4">
                <Music className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-white truncate">{item.audio.title}</div>
                  <div className="text-[11px] text-slate-400 truncate">{item.audio.artist}</div>
                </div>
              </div>
            )}

            {/* Caption */}
            <div className="text-xs text-slate-300 leading-relaxed max-h-36 overflow-y-auto pr-1 mb-4">
              {item.caption}
            </div>

            {/* Likes & Comments Counter */}
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 mb-6">
              <div className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-pink-500 fill-pink-500/20" />
                <span>{item.likes.toLocaleString()} likes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-sky-400" />
                <span>{item.comments.toLocaleString()} comments</span>
              </div>
            </div>
          </div>

          {/* Action Tools */}
          <div className="space-y-2 pt-4 border-t border-slate-800">
            {/* Download Original */}
            <button
              onClick={() => onDownload(item)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download {isVideo ? '1080p MP4 Video' : 'Full HD Photo'} ({item.fileSizeMb} MB)</span>
            </button>

            {/* Frame Extractor */}
            {isVideo && (
              <button
                onClick={() => onExtractFrames(item)}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-slate-800 hover:bg-slate-700 text-purple-300 hover:text-white font-semibold rounded-xl text-xs border border-purple-500/30 transition-colors cursor-pointer"
              >
                <Scissors className="w-4 h-4 text-purple-400" />
                <span>Inspect & Extract Frames</span>
              </button>
            )}

            {/* Audio Track Extractor */}
            {item.audio && (
              <button
                onClick={() => onExtractAudio(item)}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white font-semibold rounded-xl text-xs border border-amber-500/30 transition-colors cursor-pointer"
              >
                <Music className="w-4 h-4 text-amber-400" />
                <span>Extract Audio Waveform (MP3)</span>
              </button>
            )}

            {/* Image Enhancer */}
            <button
              onClick={() => onEnhance(item)}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-slate-800 hover:bg-slate-700 text-pink-300 hover:text-white font-semibold rounded-xl text-xs border border-pink-500/30 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>Enhance in HD Studio</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
