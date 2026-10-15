import React, { useRef, useState, useEffect } from 'react';
import { MediaItem } from '../types/instagram';
import { 
  X, 
  Music, 
  Play, 
  Pause, 
  Download, 
  Volume2, 
  VolumeX, 
  Disc, 
  AudioLines,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { downloadAudioTrack } from '../utils/downloadHelper';

interface AudioExtractorModalProps {
  item: MediaItem | null;
  onClose: () => void;
}

export const AudioExtractorModal: React.FC<AudioExtractorModalProps> = ({
  item,
  onClose,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const [isMuted, setIsMuted] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    if (item && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [item]);

  if (!item) return null;

  const audioData = item.audio || {
    title: `${item.title} (Original Reel Audio)`,
    artist: 'Original Audio',
    audioUrl: 'https://cdn.freesound.org/previews/612/612642_11861866-lq.mp3',
    duration: 30,
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || audioData.duration || 30);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleDownload = async () => {
    const filename = `${audioData.artist.replace(/[^a-zA-Z0-9_-]/g, '_')}_${audioData.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.mp3`;
    await downloadAudioTrack(audioData.audioUrl, filename);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = Math.floor(secs % 60);
    return `${mins}:${String(rem).padStart(2, '0')}`;
  };

  // Generate mock spectrum bars
  const bars = [25, 45, 65, 85, 40, 75, 95, 60, 35, 80, 100, 70, 50, 90, 65, 45, 30, 85, 95, 60, 40, 70, 90, 55, 35, 65, 80, 45];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      {/* Hidden Audio Player */}
      <audio
        ref={audioRef}
        src={audioData.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
        {/* Top Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-xl">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Instagram Audio Ripper
              </h3>
              <p className="text-xs text-slate-500">
                Extract high-bitrate 320kbps MP3 audio track & waveform
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vinyl & Visualizer Body */}
        <div className="p-6 text-center space-y-6">
          {/* Animated Vinyl Disc */}
          <div className="relative mx-auto w-32 h-32 rounded-full p-2 bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-950 shadow-xl flex items-center justify-center">
            <div 
              className={`w-full h-full rounded-full border-4 border-slate-700/60 overflow-hidden flex items-center justify-center ${
                isPlaying ? 'animate-spin [animation-duration:5s]' : ''
              }`}
            >
              <img
                src={item.thumbnailUrl}
                alt={audioData.title}
                className="w-16 h-16 rounded-full object-cover shadow-inner"
              />
            </div>
            {/* Center needle dot */}
            <div className="absolute w-4 h-4 rounded-full bg-amber-400 border-2 border-white shadow-xs" />
          </div>

          {/* Track Titles */}
          <div>
            <h4 className="text-base font-extrabold text-slate-900 truncate max-w-sm mx-auto">
              {audioData.title}
            </h4>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              by {audioData.artist}
            </p>
            <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 bg-amber-50 text-amber-700 rounded-full text-[11px] font-bold border border-amber-200">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>HQ Audio Mastered (320 kbps MP3)</span>
            </div>
          </div>

          {/* Interactive Simulated Waveform Spectrum */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
            <div className="flex items-end justify-center gap-1 h-16 px-2">
              {bars.map((height, i) => {
                const progressRatio = currentTime / (duration || 30);
                const isPassed = (i / bars.length) <= progressRatio;
                return (
                  <div
                    key={i}
                    onClick={() => {
                      const target = (i / bars.length) * duration;
                      if (audioRef.current) {
                        audioRef.current.currentTime = target;
                        setCurrentTime(target);
                      }
                    }}
                    className={`w-2 rounded-full cursor-pointer transition-all ${
                      isPassed
                        ? 'bg-gradient-to-t from-pink-500 to-amber-500'
                        : 'bg-slate-200 hover:bg-slate-300'
                    }`}
                    style={{
                      height: `${isPlaying ? Math.max(15, (height * (0.6 + Math.random() * 0.4))) : height}%`,
                    }}
                  />
                );
              })}
            </div>

            {/* Time Slider */}
            <div className="space-y-1">
              <input
                type="range"
                min="0"
                max={duration || 30}
                step="0.1"
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-pink-600"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-500">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Audio Controls */}
            <div className="flex items-center justify-center gap-4 pt-1">
              <button
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.muted = !isMuted;
                    setIsMuted(!isMuted);
                  }
                }}
                className="p-2 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>
            </div>
          </div>

          {/* Download MP3 Action */}
          <button
            onClick={handleDownload}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-slate-900 hover:bg-black text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            {downloadSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Audio Track Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-amber-400" />
                <span>Download MP3 Audio Track (320kbps)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
