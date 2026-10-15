export type MediaType = 'reel' | 'post' | 'story' | 'highlight';

export interface MediaItem {
  id: string;
  type: MediaType;
  title: string;
  url: string; // High-res video or photo URL
  thumbnailUrl: string;
  caption: string;
  timestamp: string;
  likes: number;
  comments: number;
  views?: number;
  duration?: number; // In seconds for video/reels/stories
  dimensions: {
    width: number;
    height: number;
  };
  audio?: {
    title: string;
    artist: string;
    audioUrl: string;
    coverUrl?: string;
    duration?: number;
  };
  albumTitle?: string; // For highlights e.g. "Tokyo 2026", "Vibes"
  carouselCount?: number;
  carouselItems?: string[];
  fileSizeMb: number;
}

export interface HighlightAlbum {
  id: string;
  title: string;
  coverUrl: string;
  itemsCount: number;
}

export interface InstagramProfile {
  username: string;
  fullName: string;
  avatarUrl: string;
  isVerified: boolean;
  bio: string;
  externalUrl?: string;
  category?: string;
  stats: {
    postsCount: number;
    reelsCount: number;
    storiesCount: number;
    highlightsCount: number;
    followersCount: string;
    followingCount: string;
  };
  hasActiveStories: boolean;
  highlights: HighlightAlbum[];
  media: MediaItem[];
}

export interface ExtractedFrame {
  id: string;
  timestamp: number; // in seconds
  timeFormatted: string;
  dataUrl: string;
  width: number;
  height: number;
}

export interface EnhancementSettings {
  sharpness: number; // 0 to 100
  clarity: number; // 0 to 100
  vibrance: number; // -50 to +50
  contrast: number; // -50 to +50
  brightness: number; // -50 to +50
  warmth: number; // -50 to +50
  preset: 'original' | 'valencia' | 'clarendon' | 'juno' | 'lark' | 'gingham' | 'moon' | 'sunset';
  scale: 1 | 2 | 4;
}

export interface DownloadQueueItem {
  id: string;
  title: string;
  type: MediaType;
  status: 'pending' | 'downloading' | 'completed' | 'error';
  progress: number;
  sizeMb: number;
}
