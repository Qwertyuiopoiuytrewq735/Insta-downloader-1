import React from 'react';
import { MediaItem } from '../types/instagram';
import { X, History, Download, Trash2, CheckCircle2, Film, Image as ImageIcon } from 'lucide-react';

export interface HistoryEntry {
  id: string;
  title: string;
  type: string;
  timestamp: string;
  url: string;
  fileSizeMb: number;
}

interface DownloadHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryEntry[];
  onClearHistory: () => void;
  onRedownload: (entry: HistoryEntry) => void;
}

export const DownloadHistoryDrawer: React.FC<DownloadHistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onRedownload,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md h-full bg-white shadow-2xl flex flex-col border-l border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-pink-600" />
            <h3 className="text-base font-bold text-slate-900">Download History</h3>
            <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
              {history.length}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 transition-colors"
                title="Clear all history"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="py-16 text-center space-y-3 text-slate-400">
              <History className="w-10 h-10 mx-auto text-slate-300 stroke-[1.5]" />
              <p className="text-sm font-semibold text-slate-600">No downloads yet</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Any Reels, Posts, Stories, extracted frames or bulk packages you download will appear here for fast re-access.
              </p>
            </div>
          ) : (
            history.map((entry) => (
              <div
                key={entry.id}
                className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/80 transition-colors flex items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.2 bg-white text-slate-700 rounded border border-slate-200 uppercase">
                      {entry.type}
                    </span>
                    <span className="text-[11px] text-slate-400">{entry.timestamp}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 truncate" title={entry.title}>
                    {entry.title}
                  </h4>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {entry.fileSizeMb} MB
                  </span>
                </div>

                <button
                  onClick={() => onRedownload(entry)}
                  className="p-2 bg-white hover:bg-pink-50 text-slate-700 hover:text-pink-600 rounded-xl border border-slate-200 shadow-xs transition-colors cursor-pointer shrink-0"
                  title="Download again"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
