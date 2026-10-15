import React from 'react';
import { InstagramProfile, HighlightAlbum } from '../types/instagram';
import { CheckCircle2, ExternalLink, Flame, Bookmark, Download, Layers, PlayCircle, Eye } from 'lucide-react';

interface ProfileHeaderProps {
  profile: InstagramProfile;
  selectedHighlight: string | null;
  onSelectHighlight: (albumTitle: string | null) => void;
  onViewStory: () => void;
  onDownloadAllHighlights: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  selectedHighlight,
  onSelectHighlight,
  onViewStory,
  onDownloadAllHighlights,
}) => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-2 pb-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/90 relative overflow-hidden">
        {/* Subtle decorative gradient top banner */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500" />

        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 sm:gap-8">
          {/* Avatar with Interactive Story Ring */}
          <div className="relative group shrink-0 mx-auto md:mx-0">
            <button
              onClick={onViewStory}
              className={`p-1 rounded-full transition-transform transform group-hover:scale-105 cursor-pointer ${
                profile.hasActiveStories
                  ? 'bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600'
                  : 'bg-slate-200'
              }`}
              title="Click to view Active Stories"
            >
              <div className="p-0.5 bg-white rounded-full">
                <img
                  src={profile.avatarUrl}
                  alt={profile.username}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover shadow-inner"
                />
              </div>
            </button>

            {profile.hasActiveStories && (
              <span className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1 uppercase tracking-wider">
                <Flame className="w-3 h-3 text-amber-300 fill-amber-300" />
                <span>Story</span>
              </span>
            )}
          </div>

          {/* Profile Bio & Stats */}
          <div className="flex-1 min-w-0 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1.5">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                @{profile.username}
              </h1>

              {profile.isVerified && (
                <div title="Verified Instagram Page">
                  <CheckCircle2 className="w-5 h-5 text-sky-500 fill-sky-500/20" />
                </div>
              )}

              {profile.category && (
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                  {profile.category}
                </span>
              )}
            </div>

            <div className="text-sm font-semibold text-slate-800 mb-2">
              {profile.fullName}
            </div>

            {/* Bio text */}
            <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed max-w-2xl mb-3">
              {profile.bio}
            </p>

            {/* External URL */}
            {profile.externalUrl && (
              <a
                href={profile.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-pink-600 hover:text-pink-700 transition-colors mb-4 group"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="group-hover:underline">{profile.externalUrl}</span>
              </a>
            )}

            {/* Numerical Statistics */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 pt-3 border-t border-slate-100">
              <div className="text-center md:text-left">
                <div className="text-lg font-black text-slate-900">{profile.stats.postsCount}</div>
                <div className="text-[11px] font-medium text-slate-500">Posts</div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-lg font-black text-purple-600">{profile.stats.reelsCount}</div>
                <div className="text-[11px] font-medium text-slate-500">Reels</div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-lg font-black text-pink-600">{profile.stats.storiesCount}</div>
                <div className="text-[11px] font-medium text-slate-500">Stories</div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-lg font-black text-amber-600">{profile.stats.highlightsCount}</div>
                <div className="text-[11px] font-medium text-slate-500">Highlights</div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-lg font-black text-slate-900">{profile.stats.followersCount}</div>
                <div className="text-[11px] font-medium text-slate-500">Followers</div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-lg font-black text-slate-900">{profile.stats.followingCount}</div>
                <div className="text-[11px] font-medium text-slate-500">Following</div>
              </div>
            </div>
          </div>
        </div>

        {/* Highlights Album Section */}
        {profile.highlights && profile.highlights.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900">Curated Story Highlights</h3>
                <span className="text-xs text-slate-400">({profile.highlights.length} albums)</span>
              </div>

              <div className="flex items-center gap-2">
                {selectedHighlight && (
                  <button
                    onClick={() => onSelectHighlight(null)}
                    className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                  >
                    Clear Filter
                  </button>
                )}
                <button
                  onClick={onDownloadAllHighlights}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 px-3 py-1.5 rounded-lg border border-pink-200 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download All Highlights</span>
                </button>
              </div>
            </div>

            {/* Highlight Carousel */}
            <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
              {profile.highlights.map((hl) => {
                const isSelected = selectedHighlight === hl.title;
                return (
                  <button
                    key={hl.id}
                    onClick={() => onSelectHighlight(isSelected ? null : hl.title)}
                    className={`flex flex-col items-center gap-1.5 shrink-0 group p-1.5 rounded-xl transition-all cursor-pointer ${
                      isSelected ? 'bg-amber-50 ring-2 ring-amber-400' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-pink-500 shadow-sm group-hover:scale-105 transition-transform">
                        <img
                          src={hl.coverUrl}
                          alt={hl.title}
                          className="w-full h-full object-cover rounded-full border-2 border-white"
                        />
                      </div>
                      <span className="absolute -bottom-1 -right-1 bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-white">
                        {hl.itemsCount}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-slate-700 max-w-[76px] truncate group-hover:text-slate-900">
                      {hl.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
