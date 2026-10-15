import React, { useState } from 'react';
import { Search, Clipboard, X, ArrowRight, Loader2, Link2, Sparkles } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  currentUsername: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  isLoading,
  currentUsername,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [copiedNotification, setCopiedNotification] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue.trim());
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputValue(text);
        onSearch(text);
        setCopiedNotification(true);
        setTimeout(() => setCopiedNotification(false), 2000);
      }
    } catch {
      // If clipboard permission is denied or unsupported, focus input
      const el = document.getElementById('insta-search-input');
      el?.focus();
    }
  };

  const sampleAccounts = [
    { handle: 'artisan_visuals', label: '🎬 Artisan Cinema' },
    { handle: 'travel_nomad', label: '✈️ Travel & Drone' },
    { handle: 'urban_pulse', label: '👟 Urban Streetwear' },
    { handle: 'culinary_craft', label: '🍳 Chef Recipes' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-4">
      {/* Search Input Box */}
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative flex items-center bg-white rounded-2xl shadow-lg border border-slate-200/80 transition-all duration-300 focus-within:ring-2 focus-within:ring-pink-500/40 focus-within:border-pink-500 hover:border-slate-300 overflow-hidden">
          <div className="pl-4 text-slate-400 group-focus-within:text-pink-600 transition-colors">
            <Link2 className="w-5 h-5" />
          </div>

          <input
            id="insta-search-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Paste Instagram profile link, Reel, Post, or username (e.g. instagram.com/artisan_visuals or @username)"
            className="w-full py-4 pl-3 pr-28 text-sm sm:text-base text-slate-800 placeholder-slate-400 focus:outline-hidden bg-transparent"
            disabled={isLoading}
          />

          <div className="absolute right-2 flex items-center gap-1.5">
            {inputValue && !isLoading && (
              <button
                type="button"
                onClick={() => setInputValue('')}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={handlePaste}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Paste from clipboard"
            >
              <Clipboard className="w-3.5 h-3.5 text-slate-500" />
              <span>Paste</span>
            </button>

            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-bold text-white rounded-xl shadow-md transition-all duration-200 cursor-pointer bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Fetching...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Fetch Page</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Quick Samples & Format Helper */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-400 font-medium">Quick Profiles:</span>
          {sampleAccounts.map((account) => {
            const isActive = currentUsername === account.handle;
            return (
              <button
                key={account.handle}
                type="button"
                onClick={() => {
                  setInputValue(`https://instagram.com/${account.handle}`);
                  onSearch(account.handle);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-pink-100 text-pink-700 font-semibold border border-pink-300 shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {account.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-500">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Supports Profiles, Reels, Stories & Highlight Albums</span>
        </div>
      </div>

      {copiedNotification && (
        <div className="mt-2 text-center text-xs font-medium text-emerald-600 animate-fade-in">
          ✓ Link pasted from clipboard!
        </div>
      )}
    </div>
  );
};
