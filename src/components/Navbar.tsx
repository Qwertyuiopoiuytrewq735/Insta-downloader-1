import React from 'react';
import { Camera, Film, Sparkles, Music, Download, History, ArrowRight } from 'lucide-react';

interface NavbarProps {
  onOpenFrameExtractor: () => void;
  onOpenImageEnhancer: () => void;
  onOpenHistory: () => void;
  onDownloadAll: () => void;
  selectedCount: number;
  totalMediaCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenFrameExtractor,
  onOpenImageEnhancer,
  onOpenHistory,
  onDownloadAll,
  selectedCount,
  totalMediaCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="ig-ring shadow-sm">
              <div className="bg-white p-2 rounded-full flex items-center justify-center">
                <Camera className="w-5 h-5 text-pink-600" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 bg-clip-text text-transparent">
                  InstaFetch
                </span>
                <span className="text-xs font-semibold px-1.5 py-0.5 bg-pink-50 text-pink-700 rounded border border-pink-200/60 uppercase tracking-wider">
                  Pro
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Bulk Reels, Stories & Highlights Downloader
              </p>
            </div>
          </div>

          {/* Quick Tool Links */}
          <div className="hidden md:flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <button
              onClick={onOpenFrameExtractor}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
              title="Extract high-res still frames from any Instagram Reel"
            >
              <Film className="w-4 h-4 text-purple-600" />
              <span>Frame Extractor</span>
            </button>

            <button
              onClick={onOpenImageEnhancer}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
              title="Enhance image clarity, sharpness & Instagram filters"
            >
              <Sparkles className="w-4 h-4 text-pink-500" />
              <span>HD Enhancer</span>
            </button>

            <button
              onClick={onOpenHistory}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
              title="View download history"
            >
              <History className="w-4 h-4 text-slate-500" />
              <span>History</span>
            </button>
          </div>

          {/* Download Action Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenHistory}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              title="History"
            >
              <History className="w-5 h-5" />
            </button>

            <button
              onClick={onDownloadAll}
              className="relative inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-white rounded-xl shadow-md transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download All ({totalMediaCount})</span>
              <span className="sm:hidden">Download All</span>
              {selectedCount > 0 && (
                <span className="ml-1 bg-white/25 px-1.5 py-0.5 rounded-full text-[10px]">
                  {selectedCount} sel
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
