import React, { useState } from 'react';
import { MediaItem } from '../types/instagram';
import { 
  Play, 
  Download, 
  Film, 
  Image as ImageIcon, 
  Flame, 
  Bookmark, 
  Music, 
  Sparkles, 
  Heart, 
  MessageCircle, 
  Check, 
  Maximize2,
  Clock,
  Layers,
  Scissors
} from 'lucide-react';

interface MediaCardProps {
  item: MediaItem;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onPreview: (item: MediaItem) => void;
  onDownload: (item: MediaItem) => void;
  onExtractFrames: (item: MediaItem) => void;
  onEnhance: (item: MediaItem) => void;
  onExtractAudio: (item: MediaItem) => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  item,
  isSelected,
  onToggleSelect,
  onPreview,
  onDownload,
  onExtractFrames,
  onEnhance,
  onExtractAudio,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const isVideo = item.type === 'reel' || (item.duration !== undefined && item.duration > 0);

  const getTypeBadge = () => {
    switch (item.type) {
      case 'reel':
        return { label: 'Reel', icon: Film, color: 'bg-purple-600/90 text-white' };
      case 'story':
        return { label: 'Story', icon: Flame, color: 'bg-pink-600/90 text-white' };
      case 'highlight':
        return { label: item.albumTitle || 'Highlight', icon: Bookmark, color: 'bg-amber-600/90 text-white' };
      case 'post':
      default:
        return item.carouselCount
          ? { label: `Carousel (${item.carouselCount})`, icon: Layers, color: 'bg-blue-600/90 text-white' }
          : { label: 'Photo', icon: ImageIcon, color: 'bg-slate-900/80 text-white' };
    }
  };

  const badge = getTypeBadge();
  const BadgeIcon = badge.icon;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative bg-white rounded-2xl overflow-hidden shadow-xs border transition-all duration-300 flex flex-col ${
        isSelected
          ? 'ring-2 ring-pink-500 border-pink-300 shadow-md scale-[1.01]'
          : 'border-slate-200/80 hover:border-slate-300 hover:shadow-lg'
      }`}
    >
      {/* Media Thumbnail Container */}
      <div 
        className={`relative overflow-hidden bg-slate-950 cursor-pointer ${
          item.type === 'reel' || item.type === 'story'
            ? 'aspect-[9/16]'
            : 'aspect-[4/5] sm:aspect-square'
        }`}
        onClick={() => onPreview(item)}
      >
        <img
          src={item.thumbnailUrl}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Top Type Badge */}
        <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5 pointer-events-none">
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md shadow-sm ${badge.color}`}>
            <BadgeIcon className="w-3 h-3" />
            <span>{badge.label}</span>
          </span>
        </div>

        {/* Selection Checkbox (Top Left) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect(item.id);
          }}
          className={`absolute top-2.5 left-2.5 z-20 w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
            isSelected
              ? 'bg-pink-600 text-white shadow-md'
              : 'bg-black/40 hover:bg-black/60 text-white border border-white/40 backdrop-blur-xs'
          }`}
          title={isSelected ? 'Deselect item' : 'Select item'}
        >
          {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
        </button>

        {/* Duration Badge for Videos */}
        {item.duration && (
          <div className="absolute bottom-2.5 right-2.5 z-10 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-300" />
            <span>0:{String(item.duration).padStart(2, '0')}</span>
          </div>
        )}

        {/* Center Play Button for Videos */}
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-200">
            <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-md text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play className="w-5 h-5 fill-white text-white ml-0.5" />
            </div>
          </div>
        )}

        {/* Hover Overlay with Likes & Comments */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 flex flex-col justify-between transition-opacity duration-200 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div /> {/* Spacer */}

          <div>
            <div className="flex items-center gap-4 text-white text-xs font-bold mb-2">
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4 fill-white text-white" />
                <span>{formatNumber(item.likes)}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4 fill-white text-white" />
                <span>{formatNumber(item.comments)}</span>
              </div>
              {item.views && (
                <div className="flex items-center gap-1 text-slate-300">
                  <span>{formatNumber(item.views)} views</span>
                </div>
              )}
            </div>

            <p className="text-white/90 text-xs line-clamp-2 leading-snug">
              {item.caption}
            </p>
          </div>
        </div>
      </div>

      {/* Info & Action Controls */}
      <div className="p-3 bg-white flex flex-col justify-between gap-2.5 flex-1 border-t border-slate-100">
        <div>
          <h4 className="text-xs font-bold text-slate-900 truncate" title={item.title}>
            {item.title}
          </h4>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-0.5">
            <span>{item.timestamp}</span>
            <span className="font-medium text-slate-600">{item.fileSizeMb} MB</span>
          </div>
        </div>

        {/* Quick Action Buttons Grid */}
        <div className="grid grid-cols-2 gap-1.5 pt-1">
          {/* Direct Download */}
          <button
            onClick={() => onDownload(item)}
            className="flex items-center justify-center gap-1 py-1.5 px-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg text-[11px] font-bold shadow-xs transition-colors cursor-pointer"
            title="Download HD Video/Image"
          >
            <Download className="w-3 h-3" />
            <span>Download</span>
          </button>

          {/* Enhance Image Tool */}
          <button
            onClick={() => onEnhance(item)}
            className="flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-100 hover:bg-pink-50 hover:text-pink-600 text-slate-700 rounded-lg text-[11px] font-semibold border border-slate-200 transition-colors cursor-pointer"
            title="Enhance resolution, clarity & apply filters"
          >
            <Sparkles className="w-3 h-3 text-pink-500" />
            <span>Enhance</span>
          </button>

          {/* Frame Extractor (for videos/reels/stories) */}
          {isVideo ? (
            <button
              onClick={() => onExtractFrames(item)}
              className="flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-100 hover:bg-purple-50 hover:text-purple-600 text-slate-700 rounded-lg text-[11px] font-semibold border border-slate-200 transition-colors cursor-pointer col-span-1"
              title="Inspect & extract individual video frames"
            >
              <Scissors className="w-3 h-3 text-purple-600" />
              <span>Frames</span>
            </button>
          ) : (
            <button
              onClick={() => onPreview(item)}
              className="flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold border border-slate-200 transition-colors cursor-pointer col-span-1"
              title="Preview full size"
            >
              <Maximize2 className="w-3 h-3 text-slate-600" />
              <span>Preview</span>
            </button>
          )}

          {/* Extract Audio (for reels/videos) or View High-Res */}
          {item.audio ? (
            <button
              onClick={() => onExtractAudio(item)}
              className="flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-100 hover:bg-amber-50 hover:text-amber-700 text-slate-700 rounded-lg text-[11px] font-semibold border border-slate-200 transition-colors cursor-pointer"
              title="Extract MP3 audio track & waveform"
            >
              <Music className="w-3 h-3 text-amber-500" />
              <span>Audio</span>
            </button>
          ) : (
            <button
              onClick={() => onDownload(item)}
              className="flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold border border-slate-200 transition-colors cursor-pointer"
              title="Download original file"
            >
              <Download className="w-3 h-3 text-slate-600" />
              <span>Original</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
