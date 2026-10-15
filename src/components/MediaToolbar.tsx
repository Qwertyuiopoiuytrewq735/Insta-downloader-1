import React from 'react';
import { MediaType } from '../types/instagram';
import { 
  CheckSquare, 
  Square, 
  Download, 
  Film, 
  Image as ImageIcon, 
  Flame, 
  Bookmark, 
  Layers, 
  ArrowUpDown,
  Sparkles
} from 'lucide-react';

interface MediaToolbarProps {
  activeTab: MediaType | 'all';
  onTabChange: (tab: MediaType | 'all') => void;
  counts: {
    all: number;
    reel: number;
    post: number;
    story: number;
    highlight: number;
  };
  selectedCount: number;
  totalFilteredCount: number;
  onToggleSelectAll: () => void;
  isAllSelected: boolean;
  onDownloadSelected: () => void;
  onDownloadAllBundle: () => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export const MediaToolbar: React.FC<MediaToolbarProps> = ({
  activeTab,
  onTabChange,
  counts,
  selectedCount,
  totalFilteredCount,
  onToggleSelectAll,
  isAllSelected,
  onDownloadSelected,
  onDownloadAllBundle,
  sortBy,
  onSortChange,
}) => {
  const tabs = [
    { key: 'all', label: 'All Media', count: counts.all, icon: Layers },
    { key: 'reel', label: 'Reels', count: counts.reel, icon: Film, color: 'text-purple-600' },
    { key: 'post', label: 'Posts', count: counts.post, icon: ImageIcon, color: 'text-blue-600' },
    { key: 'story', label: 'Stories', count: counts.story, icon: Flame, color: 'text-pink-600' },
    { key: 'highlight', label: 'Highlights', count: counts.highlight, icon: Bookmark, color: 'text-amber-600' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 mb-6">
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/90 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key as MediaType | 'all')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : tab.color || 'text-slate-500'}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Actions & Sort Controls */}
        <div className="flex flex-wrap items-center justify-between md:justify-end gap-2.5 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
          {/* Select All Toggle */}
          <button
            onClick={onToggleSelectAll}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            {isAllSelected ? (
              <CheckSquare className="w-4 h-4 text-pink-600" />
            ) : (
              <Square className="w-4 h-4 text-slate-400" />
            )}
            <span>
              {isAllSelected ? 'Deselect All' : `Select All (${totalFilteredCount})`}
            </span>
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-transparent text-xs font-medium text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="likes">Most Liked</option>
              <option value="views">Most Views</option>
              <option value="duration">Longest Duration</option>
            </select>
          </div>

          {/* Download Selected (ZIP) */}
          {selectedCount > 0 && (
            <button
              onClick={onDownloadSelected}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-800 bg-amber-400 hover:bg-amber-500 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Selected ({selectedCount})</span>
            </button>
          )}

          {/* Download All at once (Reels + Posts + Highlights + Stories) */}
          <button
            onClick={onDownloadAllBundle}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white rounded-xl shadow-md transition-all cursor-pointer bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 transform hover:scale-[1.02] active:scale-[0.98]"
            title="Download every Reel, Post, Story, and Highlight album as a complete ZIP bundle"
          >
            <Download className="w-4 h-4" />
            <span>Download All at Once ({counts.all})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
