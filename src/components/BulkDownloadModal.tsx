import React from 'react';
import { Download, CheckCircle2, Loader2, X, Archive, Film, Image as ImageIcon, Flame, Bookmark } from 'lucide-react';

interface BulkDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  progressPercent: number;
  currentStage: string;
  currentItem: string;
  isCompleted: boolean;
  itemCounts: {
    total: number;
    reels: number;
    posts: number;
    stories: number;
    highlights: number;
  };
}

export const BulkDownloadModal: React.FC<BulkDownloadModalProps> = ({
  isOpen,
  onClose,
  progressPercent,
  currentStage,
  currentItem,
  isCompleted,
  itemCounts,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-center space-y-6">
        {/* Top Status Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center shadow-md bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 text-white">
          {isCompleted ? (
            <CheckCircle2 className="w-8 h-8 text-white stroke-[2.5]" />
          ) : (
            <Archive className="w-8 h-8 text-white animate-bounce [animation-duration:2s]" />
          )}
        </div>

        <div>
          <h3 className="text-lg font-black text-slate-900 tracking-tight">
            {isCompleted ? 'Download Archive Ready!' : 'Packaging Bulk Media Download'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            {isCompleted
              ? 'All selected Reels, Posts, Stories, and Highlights have been zipped and saved to your device.'
              : 'Fetching high-resolution 1080p/4K streams and bundling into ZIP archive...'}
          </p>
        </div>

        {/* Breakdown Badges */}
        <div className="grid grid-cols-4 gap-2 py-2 px-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
          <div>
            <div className="text-sm font-black text-purple-600">{itemCounts.reels}</div>
            <div className="text-[10px] font-semibold text-slate-500">Reels</div>
          </div>
          <div>
            <div className="text-sm font-black text-blue-600">{itemCounts.posts}</div>
            <div className="text-[10px] font-semibold text-slate-500">Posts</div>
          </div>
          <div>
            <div className="text-sm font-black text-pink-600">{itemCounts.stories}</div>
            <div className="text-[10px] font-semibold text-slate-500">Stories</div>
          </div>
          <div>
            <div className="text-sm font-black text-amber-600">{itemCounts.highlights}</div>
            <div className="text-[10px] font-semibold text-slate-500">Highlights</div>
          </div>
        </div>

        {/* Progress Bar & Status Text */}
        <div className="space-y-2 text-left">
          <div className="flex justify-between text-xs font-bold text-slate-800">
            <span className="truncate pr-2">{currentStage}</span>
            <span className="font-mono text-pink-600 shrink-0">{progressPercent}%</span>
          </div>

          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 transition-all duration-300 shadow-xs"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-400 font-mono truncate">
            {currentItem}
          </p>
        </div>

        {/* Action Button */}
        <div>
          {isCompleted ? (
            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-black text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              Done & Close
            </button>
          ) : (
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin text-pink-600" />
              <span>Please keep this window open...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
