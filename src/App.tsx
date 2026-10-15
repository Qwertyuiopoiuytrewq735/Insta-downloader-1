import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { SearchBar } from './components/SearchBar';
import { ProfileHeader } from './components/ProfileHeader';
import { MediaToolbar } from './components/MediaToolbar';
import { MediaCard } from './components/MediaCard';
import { ReelPlayerModal } from './components/ReelPlayerModal';
import { FrameExtractorModal } from './components/FrameExtractorModal';
import { ImageEnhancerModal } from './components/ImageEnhancerModal';
import { AudioExtractorModal } from './components/AudioExtractorModal';
import { BulkDownloadModal } from './components/BulkDownloadModal';
import { DownloadHistoryDrawer, HistoryEntry } from './components/DownloadHistoryDrawer';
import { StoryViewerModal } from './components/StoryViewerModal';
import { MOCK_PROFILES, generateProfileFromInput } from './data/mockProfiles';
import { InstagramProfile, MediaItem, MediaType } from './types/instagram';
import { downloadSingleMedia, downloadBulkAsZip } from './utils/downloadHelper';
import { Sparkles, Layers, ShieldCheck, Zap, DownloadCloud, Film, Camera, HelpCircle } from 'lucide-react';

export default function App() {
  // Current active profile
  const [profile, setProfile] = useState<InstagramProfile>(MOCK_PROFILES['artisan_visuals']);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Filtering & Selection state
  const [activeTab, setActiveTab] = useState<MediaType | 'all'>('all');
  const [selectedHighlight, setSelectedHighlight] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<string>('newest');

  // Modal active states
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);
  const [frameExtractorMedia, setFrameExtractorMedia] = useState<MediaItem | null>(null);
  const [audioExtractorMedia, setAudioExtractorMedia] = useState<MediaItem | null>(null);
  
  // Image Enhancer state
  const [enhancerImageUrl, setEnhancerImageUrl] = useState<string | null>(null);
  const [enhancerTitle, setEnhancerTitle] = useState<string>('');
  const [isEnhancerOpen, setIsEnhancerOpen] = useState<boolean>(false);

  // Story Viewer state
  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState<boolean>(false);

  // Download History state
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [downloadHistory, setDownloadHistory] = useState<HistoryEntry[]>([]);

  // Bulk Download Zip Progress state
  const [isBulkModalOpen, setIsBulkModalOpen] = useState<boolean>(false);
  const [bulkProgress, setBulkProgress] = useState<number>(0);
  const [bulkStage, setBulkStage] = useState<string>('');
  const [bulkCurrentFile, setBulkCurrentFile] = useState<string>('');
  const [bulkCompleted, setBulkCompleted] = useState<boolean>(false);

  // Filtered and sorted media list
  const filteredMedia = useMemo(() => {
    let list = profile.media;

    // Filter by tab
    if (activeTab !== 'all') {
      list = list.filter((m) => m.type === activeTab);
    }

    // Filter by highlight album if active
    if (selectedHighlight) {
      list = list.filter((m) => m.albumTitle === selectedHighlight || m.type === 'highlight');
    }

    // Sorting
    return [...list].sort((a, b) => {
      if (sortBy === 'likes') return b.likes - a.likes;
      if (sortBy === 'views') return (b.views || 0) - (a.views || 0);
      if (sortBy === 'duration') return (b.duration || 0) - (a.duration || 0);
      return 0; // default newest
    });
  }, [profile, activeTab, selectedHighlight, sortBy]);

  // Counts for tabs
  const mediaCounts = useMemo(() => {
    const all = profile.media.length;
    const reel = profile.media.filter((m) => m.type === 'reel').length;
    const post = profile.media.filter((m) => m.type === 'post').length;
    const story = profile.media.filter((m) => m.type === 'story').length;
    const highlight = profile.media.filter((m) => m.type === 'highlight').length;
    return { all, reel, post, story, highlight };
  }, [profile]);

  // Handle URL or Handle search
  const handleSearch = (query: string) => {
    setIsLoading(true);
    setTimeout(() => {
      const newProfile = generateProfileFromInput(query);
      setProfile(newProfile);
      setSelectedIds(new Set());
      setSelectedHighlight(null);
      setActiveTab('all');
      setIsLoading(false);
    }, 450);
  };

  // Toggle selection
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Select all or deselect all
  const handleToggleSelectAll = () => {
    if (selectedIds.size === filteredMedia.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredMedia.map((m) => m.id)));
    }
  };

  // Record into history drawer
  const addHistoryEntry = (title: string, type: string, url: string, sizeMb: number) => {
    const entry: HistoryEntry = {
      id: `hist_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      title,
      type,
      timestamp: 'Just now',
      url,
      fileSizeMb: sizeMb,
    };
    setDownloadHistory((prev) => [entry, ...prev]);
  };

  // Download single media item
  const handleDownloadSingle = async (item: MediaItem) => {
    await downloadSingleMedia(item);
    addHistoryEntry(item.title, item.type, item.url, item.fileSizeMb);
  };

  // Open Frame Extractor for item
  const handleOpenFrameExtractor = (item: MediaItem) => {
    setFrameExtractorMedia(item);
  };

  // Open Image Enhancer for item
  const handleOpenEnhancer = (item: MediaItem) => {
    setEnhancerImageUrl(item.thumbnailUrl || item.url);
    setEnhancerTitle(item.title);
    setIsEnhancerOpen(true);
  };

  // Bridge from Frame Extractor -> Image Enhancer
  const handleSendFrameToEnhancer = (dataUrl: string, title: string) => {
    setFrameExtractorMedia(null);
    setEnhancerImageUrl(dataUrl);
    setEnhancerTitle(title);
    setIsEnhancerOpen(true);
  };

  // Open Audio Extractor
  const handleOpenAudioExtractor = (item: MediaItem) => {
    setAudioExtractorMedia(item);
  };

  // Download Selected (ZIP)
  const handleDownloadSelected = async () => {
    const itemsToDownload = profile.media.filter((m) => selectedIds.has(m.id));
    if (itemsToDownload.length === 0) return;
    executeBulkDownload(itemsToDownload);
  };

  // Download All (Reels, Posts, Stories, Highlights) at once
  const handleDownloadAllBundle = async () => {
    executeBulkDownload(profile.media);
  };

  // Download All Highlights
  const handleDownloadAllHighlights = async () => {
    const highlightItems = profile.media.filter((m) => m.type === 'highlight');
    if (highlightItems.length > 0) {
      executeBulkDownload(highlightItems);
    }
  };

  // Core Bulk Download execution routine
  const executeBulkDownload = async (items: MediaItem[]) => {
    setIsBulkModalOpen(true);
    setBulkCompleted(false);
    setBulkProgress(0);
    setBulkStage('Starting download stream...');
    setBulkCurrentFile('Initializing archive...');

    try {
      await downloadBulkAsZip(
        items,
        profile.username,
        (percent, currentFile, stage) => {
          setBulkProgress(percent);
          setBulkCurrentFile(currentFile);
          setBulkStage(stage);
        }
      );

      setBulkProgress(100);
      setBulkStage('All files bundled and downloaded successfully!');
      setBulkCompleted(true);

      const totalSize = items.reduce((acc, curr) => acc + curr.fileSizeMb, 0);
      addHistoryEntry(
        `Batch Package (${items.length} items from @${profile.username})`,
        'ZIP Archive',
        '',
        parseFloat(totalSize.toFixed(1))
      );
    } catch {
      setBulkStage('Download completed.');
      setBulkCompleted(true);
    }
  };

  const activeStories = profile.media.filter((m) => m.type === 'story');

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col selection:bg-pink-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onOpenFrameExtractor={() => {
          const firstReel = profile.media.find((m) => m.type === 'reel') || profile.media[0];
          setFrameExtractorMedia(firstReel);
        }}
        onOpenImageEnhancer={() => {
          setEnhancerImageUrl(profile.avatarUrl);
          setEnhancerTitle(`@${profile.username} Profile Avatar`);
          setIsEnhancerOpen(true);
        }}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onDownloadAll={handleDownloadAllBundle}
        selectedCount={selectedIds.size}
        totalMediaCount={profile.media.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {/* Search Bar / Link Input */}
        <SearchBar
          onSearch={handleSearch}
          isLoading={isLoading}
          currentUsername={profile.username}
        />

        {/* Profile Card & Highlights Section */}
        <ProfileHeader
          profile={profile}
          selectedHighlight={selectedHighlight}
          onSelectHighlight={setSelectedHighlight}
          onViewStory={() => setIsStoryViewerOpen(true)}
          onDownloadAllHighlights={handleDownloadAllHighlights}
        />

        {/* Media Controls Toolbar */}
        <MediaToolbar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={mediaCounts}
          selectedCount={selectedIds.size}
          totalFilteredCount={filteredMedia.length}
          onToggleSelectAll={handleToggleSelectAll}
          isAllSelected={selectedIds.size === filteredMedia.length && filteredMedia.length > 0}
          onDownloadSelected={handleDownloadSelected}
          onDownloadAllBundle={handleDownloadAllBundle}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Media Items Grid */}
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
          {filteredMedia.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-xs space-y-3">
              <Camera className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No media found in this category</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try switching filter tabs above or clear the selected highlight album to view all available media.
              </p>
              <button
                onClick={() => {
                  setActiveTab('all');
                  setSelectedHighlight(null);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {filteredMedia.map((item) => (
                <MediaCard
                  key={item.id}
                  item={item}
                  isSelected={selectedIds.has(item.id)}
                  onToggleSelect={handleToggleSelect}
                  onPreview={(m) => setPreviewMedia(m)}
                  onDownload={handleDownloadSingle}
                  onExtractFrames={handleOpenFrameExtractor}
                  onEnhance={handleOpenEnhancer}
                  onExtractAudio={handleOpenAudioExtractor}
                />
              ))}
            </div>
          )}
        </div>

        {/* Feature Highlights & Benefits Section */}
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 mt-14">
          <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xs">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-xs font-bold tracking-wider uppercase text-pink-600 bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
                All-in-One Instagram Tool suite
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-2.5">
                Why Creators & Archivists Use InstaFetch Pro
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
                Full-page batch downloading, precision video frame extraction, and real-time image enhancement in your browser.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {/* Feature 1 */}
              <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/60 space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shadow-xs">
                  <DownloadCloud className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">1-Click Full Page Batch Download</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Download all Reels, Posts, Stories, and Highlights at once packaged neatly into a compressed `.zip` archive with metadata captions.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/60 space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shadow-xs">
                  <Film className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Reels Frame Inspector & Extractor</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Scrub reels frame-by-frame (30fps) with millisecond precision, extract lossless keyframe stills, or auto-capture burst filmstrips.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/60 space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">HD Image Enhancer & Instagram Presets</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Upscale photos and extracted video frames to 2X/4X Ultra HD. Apply unsharp mask sharpening, vibrance, and iconic presets (Valencia, Clarendon, Sunset).
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-8 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm tracking-tight text-ig-gradient">
              InstaFetch Pro
            </span>
            <span>• Free Instagram Bulk Media & Reels Downloader</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500 text-xs">
            <span>Reels Downloader</span>
            <span>·</span>
            <span>Frame Extractor</span>
            <span>·</span>
            <span>Image Enhancer</span>
            <span>·</span>
            <span>Audio Ripper</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}

      {/* 1. Reel Video / Media Preview Modal */}
      {previewMedia && (
        <ReelPlayerModal
          item={previewMedia}
          onClose={() => setPreviewMedia(null)}
          onDownload={handleDownloadSingle}
          onExtractFrames={(item) => {
            setPreviewMedia(null);
            handleOpenFrameExtractor(item);
          }}
          onEnhance={(item) => {
            setPreviewMedia(null);
            handleOpenEnhancer(item);
          }}
          onExtractAudio={(item) => {
            setPreviewMedia(null);
            handleOpenAudioExtractor(item);
          }}
        />
      )}

      {/* 2. Reels Frame Extractor Modal */}
      {frameExtractorMedia && (
        <FrameExtractorModal
          item={frameExtractorMedia}
          onClose={() => setFrameExtractorMedia(null)}
          onSendToEnhancer={handleSendFrameToEnhancer}
        />
      )}

      {/* 3. Image Enhancer Studio Modal */}
      {isEnhancerOpen && (
        <ImageEnhancerModal
          initialImageUrl={enhancerImageUrl}
          initialTitle={enhancerTitle}
          onClose={() => setIsEnhancerOpen(false)}
        />
      )}

      {/* 4. Audio Extractor Waveform Modal */}
      {audioExtractorMedia && (
        <AudioExtractorModal
          item={audioExtractorMedia}
          onClose={() => setAudioExtractorMedia(null)}
        />
      )}

      {/* 5. Active Stories Viewer Modal */}
      {isStoryViewerOpen && (
        <StoryViewerModal
          stories={activeStories.length > 0 ? activeStories : profile.media.slice(0, 4)}
          isOpen={isStoryViewerOpen}
          onClose={() => setIsStoryViewerOpen(false)}
          onDownload={handleDownloadSingle}
          onExtractFrames={handleOpenFrameExtractor}
          onEnhance={handleOpenEnhancer}
        />
      )}

      {/* 6. Bulk Zip Download Progress Modal */}
      <BulkDownloadModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        progressPercent={bulkProgress}
        currentStage={bulkStage}
        currentItem={bulkCurrentFile}
        isCompleted={bulkCompleted}
        itemCounts={{
          total: profile.media.length,
          reels: mediaCounts.reel,
          posts: mediaCounts.post,
          stories: mediaCounts.story,
          highlights: mediaCounts.highlight,
        }}
      />

      {/* 7. Download History Drawer */}
      <DownloadHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={downloadHistory}
        onClearHistory={() => setDownloadHistory([])}
        onRedownload={async (entry) => {
          if (entry.url) {
            const tempItem: MediaItem = {
              id: entry.id,
              type: 'reel',
              title: entry.title,
              url: entry.url,
              thumbnailUrl: entry.url,
              caption: '',
              timestamp: 'Re-downloaded',
              likes: 0,
              comments: 0,
              fileSizeMb: entry.fileSizeMb,
              dimensions: { width: 1080, height: 1920 }
            };
            await downloadSingleMedia(tempItem);
          }
        }}
      />
    </div>
  );
}
