import { InstagramProfile, MediaItem } from '../types/instagram';

// Reliable local video streams that support instant scrubbing and crossOrigin canvas extraction
const SAMPLE_VIDEOS = {
  tokyoNight: '/videos/tokyo_night.mp4',
  natureDrone: '/videos/drone_alps.mp4',
  surfWave: '/videos/surf_wave.mp4',
  cityTimeLapse: '/videos/tokyo_night.mp4',
  cozyCoffee: '/videos/coffee_asmr.mp4',
  fashionWalk: '/videos/fashion_walk.mp4',
};

export const MOCK_PROFILES: Record<string, InstagramProfile> = {
  artisan_visuals: {
    username: 'artisan_visuals',
    fullName: 'Artisan Visuals ✦ Cinema & Reels',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    isVerified: true,
    bio: 'Visual Director & Colorist 🎬\nCapturing neon nights & 4K cinematic reels worldwide\nPresets & Lut Packs in link 👇',
    externalUrl: 'https://artisanvisuals.studio/presets',
    category: 'Digital Creator',
    hasActiveStories: true,
    stats: {
      postsCount: 142,
      reelsCount: 58,
      storiesCount: 4,
      highlightsCount: 5,
      followersCount: '1.4M',
      followingCount: '348',
    },
    highlights: [
      { id: 'hl-1', title: 'Tokyo 2026', coverUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=300&q=80', itemsCount: 14 },
      { id: 'hl-2', title: 'Color LUTs', coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=300&q=80', itemsCount: 8 },
      { id: 'hl-3', title: 'Drone POV', coverUrl: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=300&q=80', itemsCount: 19 },
      { id: 'hl-4', title: 'Camera Rig', coverUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=300&q=80', itemsCount: 11 },
      { id: 'hl-5', title: 'Behind Scenes', coverUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=300&q=80', itemsCount: 22 },
    ],
    media: [
      {
        id: 'med-1',
        type: 'reel',
        title: 'Neon Rain in Shibuya Crossing • 4K 60FPS',
        url: SAMPLE_VIDEOS.tokyoNight,
        thumbnailUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=85',
        caption: 'Rain soaked streets of Tokyo never sleep. Captured on Sony FX3 with 35mm f/1.4 GM. Graded with custom Cyberpunk LUT pack! #tokyo #cinematic #reels #filmmaking #colorgrading',
        timestamp: '2 hours ago',
        likes: 124800,
        comments: 3410,
        views: 890000,
        duration: 15,
        dimensions: { width: 1080, height: 1920 },
        audio: {
          title: 'Midnight Echoes (Slowed + Reverb)',
          artist: 'Kavinsky & Artisan Visuals',
          audioUrl: '/audio/ambient_beat.mp3',
          duration: 34
        },
        fileSizeMb: 14.8
      },
      {
        id: 'med-2',
        type: 'reel',
        title: 'Alpine Golden Hour FPV Flight',
        url: SAMPLE_VIDEOS.natureDrone,
        thumbnailUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=85',
        caption: 'Chasing the last rays of sunlight over Swiss mountain ridges. Wind was brutal at 2800m! #fpv #drone #alps #goldenhour #cinematography',
        timestamp: '1 day ago',
        likes: 98300,
        comments: 1890,
        views: 654000,
        duration: 15,
        dimensions: { width: 1080, height: 1920 },
        audio: {
          title: 'Ascension - Cinematic Ambient',
          artist: 'Hans Zimmer Vibes',
          audioUrl: '/audio/ambient_beat.mp3',
          duration: 28
        },
        fileSizeMb: 18.2
      },
      {
        id: 'med-3',
        type: 'post',
        title: 'Nordic Architecture & Shadows Series',
        url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=85',
        caption: 'Minimalist geometry in Copenhagen. Swipe to see the color grading breakdown and raw negative exposure. #architecture #nordicdesign #minimalism #photography',
        timestamp: '3 days ago',
        likes: 45200,
        comments: 620,
        carouselCount: 4,
        carouselItems: [
          'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85',
          'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&w=1200&q=85',
          'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=1200&q=85',
        ],
        dimensions: { width: 1080, height: 1350 },
        fileSizeMb: 5.4
      },
      {
        id: 'med-4',
        type: 'reel',
        title: 'Morning Espresso Pull • Sound On ASMR',
        url: SAMPLE_VIDEOS.cozyCoffee,
        thumbnailUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=85',
        caption: 'Crisp morning ritual. 18g in, 36g out at 9 bars of pressure. Hear that golden crema hiss? ☕ #espresso #barista #coffeereels #asmrcoffee',
        timestamp: '4 days ago',
        likes: 67100,
        comments: 1140,
        views: 420000,
        duration: 15,
        dimensions: { width: 1080, height: 1920 },
        audio: {
          title: 'Original Audio - Artisan ASMR',
          artist: 'artisan_visuals',
          audioUrl: '/audio/ambient_beat.mp3',
          duration: 18
        },
        fileSizeMb: 11.6
      },
      {
        id: 'med-5',
        type: 'post',
        title: 'Portraits in Blue Hour',
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85',
        caption: 'Natural twilight light hits differently when you master the falloff. No reflectors, just ambient sky luminescence. #portrait #bluehour #cinematicportrait',
        timestamp: '5 days ago',
        likes: 58900,
        comments: 890,
        dimensions: { width: 1080, height: 1350 },
        fileSizeMb: 4.8
      },
      {
        id: 'med-6',
        type: 'story',
        title: 'Editing Deck Tonight • LUT testing',
        url: SAMPLE_VIDEOS.cityTimeLapse,
        thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=85',
        caption: 'Working on the new film premiere timeline until 3 AM! Tap to inspect color palette.',
        timestamp: 'Active Story (Expires in 4h)',
        likes: 12500,
        comments: 140,
        duration: 15,
        dimensions: { width: 1080, height: 1920 },
        fileSizeMb: 8.9
      },
      {
        id: 'med-7',
        type: 'story',
        title: 'Tokyo Street Food Stall at Night',
        url: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=85',
        caption: 'Best yakitori in Shinjuku alleyway. Smell that charcoal smoke!',
        timestamp: 'Active Story (Expires in 12h)',
        likes: 8400,
        comments: 92,
        dimensions: { width: 1080, height: 1920 },
        fileSizeMb: 3.2
      },
      {
        id: 'med-8',
        type: 'highlight',
        title: 'Shibuya Neon Night Highlight',
        url: SAMPLE_VIDEOS.tokyoNight,
        thumbnailUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=85',
        albumTitle: 'Tokyo 2026',
        caption: 'Saved from Tokyo 2026 Highlights collection.',
        timestamp: 'Saved in Highlights',
        likes: 31200,
        comments: 420,
        duration: 15,
        dimensions: { width: 1080, height: 1920 },
        fileSizeMb: 12.4
      },
      {
        id: 'med-9',
        type: 'highlight',
        title: 'Iceland Volcanic Landscape',
        url: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1200&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=800&q=85',
        albumTitle: 'Drone POV',
        caption: 'Black sand beach and glacier lagoon aerial view.',
        timestamp: 'Saved in Highlights',
        likes: 24800,
        comments: 310,
        dimensions: { width: 1080, height: 1350 },
        fileSizeMb: 6.1
      },
      {
        id: 'med-10',
        type: 'reel',
        title: 'Cyberpunk Cyber-Shibuya Motion Flow',
        url: SAMPLE_VIDEOS.fashionWalk,
        thumbnailUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=85',
        caption: 'Gimbal movement practice through the underground arcades of Akihabara. Seamless speed ramp transition! #tokyo #hyperlapse #speedramp',
        timestamp: '1 week ago',
        likes: 184000,
        comments: 4120,
        views: 1200000,
        duration: 15,
        dimensions: { width: 1080, height: 1920 },
        audio: {
          title: 'Resonance - Synthwave Remaster',
          artist: 'HOME & Synth Lab',
          audioUrl: '/audio/ambient_beat.mp3',
          duration: 30
        },
        fileSizeMb: 16.5
      },
      {
        id: 'med-11',
        type: 'post',
        title: 'Film Still: Solitude in Kyoto',
        url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=85',
        caption: 'Bamboo forest early morning mist. Silence before the world awakens. Shot on 35mm film stock. #kyoto #filmphotography #japantravel',
        timestamp: '1 week ago',
        likes: 72400,
        comments: 1050,
        dimensions: { width: 1080, height: 1080 },
        fileSizeMb: 4.1
      },
      {
        id: 'med-12',
        type: 'highlight',
        title: 'Custom Lens Calibration & Rig',
        url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=85',
        albumTitle: 'Camera Rig',
        caption: 'Full matte box and wireless follow focus setup for the documentary shoot.',
        timestamp: 'Saved in Highlights',
        likes: 19500,
        comments: 260,
        dimensions: { width: 1080, height: 1350 },
        fileSizeMb: 5.8
      }
    ]
  },

  travel_nomad: {
    username: 'travel_nomad',
    fullName: 'Alex & Maya ✈︎ Global Wanderers',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    isVerified: true,
    bio: 'Exploring 78+ countries on road & sailboat ⛵\nDaily travel reels, secret sunset spots & gear tips\n🗺 Free guides in link 👇',
    externalUrl: 'https://travelnomads.world/guides',
    category: 'Travel / Adventure',
    hasActiveStories: true,
    stats: {
      postsCount: 389,
      reelsCount: 124,
      storiesCount: 6,
      highlightsCount: 6,
      followersCount: '2.8M',
      followingCount: '492',
    },
    highlights: [
      { id: 'tn-hl-1', title: 'Bali 2026', coverUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=300&q=80', itemsCount: 34 },
      { id: 'tn-hl-2', title: 'Amalfi Coast', coverUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=300&q=80', itemsCount: 28 },
      { id: 'tn-hl-3', title: 'Vanlife', coverUrl: 'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?auto=format&fit=crop&w=300&q=80', itemsCount: 42 },
      { id: 'tn-hl-4', title: 'Patagonia', coverUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=300&q=80', itemsCount: 16 },
      { id: 'tn-hl-5', title: 'Sailboat', coverUrl: 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=300&q=80', itemsCount: 25 },
      { id: 'tn-hl-6', title: 'Food Trips', coverUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=300&q=80', itemsCount: 31 },
    ],
    media: [
      {
        id: 'tn-1',
        type: 'reel',
        title: 'Hidden Cliffside Lagoon in Nusa Penida',
        url: SAMPLE_VIDEOS.surfWave,
        thumbnailUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=85',
        caption: 'Hiked down 1,000 steps at 5:30 AM to catch this crystal tide pool all to ourselves. Save this reel for your next Bali trip! 🌊 #bali #travelreels #wanderlust #islandlife',
        timestamp: '5 hours ago',
        likes: 215400,
        comments: 4890,
        views: 1420000,
        duration: 15,
        dimensions: { width: 1080, height: 1920 },
        audio: {
          title: 'Ocean Breeze - Tropical Deep House',
          artist: 'Island Sounds',
          audioUrl: '/audio/ambient_beat.mp3',
          duration: 32
        },
        fileSizeMb: 17.5
      },
      {
        id: 'tn-2',
        type: 'reel',
        title: 'Driving through Amalfi Coast Cliffs at Sunset',
        url: SAMPLE_VIDEOS.fashionWalk,
        thumbnailUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=85',
        caption: 'Classic convertible, Italian disco on the radio, and the sun dipping into the Tyrrhenian Sea. Pure dolce vita. 🍋 #amalfi #italytravel #sunsetdrive #positano',
        timestamp: '1 day ago',
        likes: 178900,
        comments: 3200,
        views: 980000,
        duration: 15,
        dimensions: { width: 1080, height: 1920 },
        audio: {
          title: 'Estate Italiana (Remix)',
          artist: 'Amalfi Radio Beats',
          audioUrl: '/audio/ambient_beat.mp3',
          duration: 25
        },
        fileSizeMb: 15.9
      },
      {
        id: 'tn-3',
        type: 'post',
        title: 'Sunset over Oia, Santorini',
        url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=85',
        caption: 'White washed domes bathed in peach and lavender tones. Truly one of the world wonders. #santorini #greece #sunset #travelphotography',
        timestamp: '2 days ago',
        likes: 94300,
        comments: 1420,
        dimensions: { width: 1080, height: 1350 },
        fileSizeMb: 5.2
      },
      {
        id: 'tn-4',
        type: 'story',
        title: 'Morning Smoothie Bowl by the Pool',
        url: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=800&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=800&q=85',
        caption: 'Dragonfruit and mango bowl before our surf session today!',
        timestamp: 'Active Story (Expires in 6h)',
        likes: 18200,
        comments: 210,
        dimensions: { width: 1080, height: 1920 },
        fileSizeMb: 3.4
      },
      {
        id: 'tn-5',
        type: 'highlight',
        title: 'Dolomites Lake Reflection',
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=85',
        albumTitle: 'Patagonia',
        caption: 'Glacier water so clean and still you can see every pebble 20 feet down.',
        timestamp: 'Saved in Highlights',
        likes: 42300,
        comments: 630,
        dimensions: { width: 1080, height: 1350 },
        fileSizeMb: 6.8
      }
    ]
  },

  urban_pulse: {
    username: 'urban_pulse',
    fullName: 'URBAN PULSE • Streetwear & Mood',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    isVerified: true,
    bio: 'Daily Street Fashion & High-Contrast City Aesthetics\nNYC • London • Seoul\nCurating next-gen aesthetics & drops',
    externalUrl: 'https://urbanpulsemag.com',
    category: 'Fashion & Design',
    hasActiveStories: true,
    stats: {
      postsCount: 512,
      reelsCount: 89,
      storiesCount: 3,
      highlightsCount: 4,
      followersCount: '890K',
      followingCount: '215',
    },
    highlights: [
      { id: 'up-hl-1', title: 'Fit Checks', coverUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=300&q=80', itemsCount: 45 },
      { id: 'up-hl-2', title: 'Sneaker Heat', coverUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=300&q=80', itemsCount: 38 },
      { id: 'up-hl-3', title: 'Seoul Drop', coverUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=300&q=80', itemsCount: 19 },
      { id: 'up-hl-4', title: 'Moodboard', coverUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=300&q=80', itemsCount: 52 },
    ],
    media: [
      {
        id: 'up-1',
        type: 'reel',
        title: 'Seoul Street Style Week • Cyber Chic Transition',
        url: SAMPLE_VIDEOS.fashionWalk,
        thumbnailUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=85',
        caption: 'Oversized technical trench coat paired with chunky platform soles. Which look 1 or 2 is your daily vibe? #streetwear #seoulfashion #fitcheck #ootd',
        timestamp: '3 hours ago',
        likes: 89200,
        comments: 2140,
        views: 670000,
        duration: 15,
        dimensions: { width: 1080, height: 1920 },
        audio: {
          title: 'Phonk Drill Underground (Slowed)',
          artist: 'K-Style Beats',
          audioUrl: '/audio/ambient_beat.mp3',
          duration: 26
        },
        fileSizeMb: 16.4
      },
      {
        id: 'up-2',
        type: 'post',
        title: 'Monochrome Texture Study in Soho',
        url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=85',
        caption: 'Leather textures, brushed steel architecture, and concrete shadows. Summer lookbook volume 4.',
        timestamp: '2 days ago',
        likes: 64100,
        comments: 790,
        dimensions: { width: 1080, height: 1350 },
        fileSizeMb: 4.7
      }
    ]
  },

  culinary_craft: {
    username: 'culinary_craft',
    fullName: 'Chef Marco 🍳 Artisanal Recipes',
    avatarUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=400&q=80',
    isVerified: true,
    bio: 'Michelin-trained chef sharing 60s gourmet recipes\nHandmade pasta, woodfired sourdough & knife skills\nBook recipes 👇',
    externalUrl: 'https://culinarycraft.co/recipes',
    category: 'Chef / Food Creator',
    hasActiveStories: true,
    stats: {
      postsCount: 290,
      reelsCount: 168,
      storiesCount: 5,
      highlightsCount: 5,
      followersCount: '3.1M',
      followingCount: '184',
    },
    highlights: [
      { id: 'cc-hl-1', title: 'Pasta Secrets', coverUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=300&q=80', itemsCount: 40 },
      { id: 'cc-hl-2', title: 'Sourdough', coverUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80', itemsCount: 29 },
      { id: 'cc-hl-3', title: 'Steak Science', coverUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=300&q=80', itemsCount: 35 },
      { id: 'cc-hl-4', title: 'Sauces', coverUrl: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?auto=format&fit=crop&w=300&q=80', itemsCount: 18 },
    ],
    media: [
      {
        id: 'cc-1',
        type: 'reel',
        title: 'Authentic 4-Ingredient Roman Cacio e Pepe',
        url: SAMPLE_VIDEOS.cozyCoffee,
        thumbnailUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=85',
        caption: 'No cream. No butter. Just Pecorino Romano DOP, toasted black peppercorns, pasta water starch, and bronze-die tonnarelli. Emulsion perfection! #cacioepepe #pasta #italianfood #cookingreels',
        timestamp: '6 hours ago',
        likes: 345000,
        comments: 6720,
        views: 2890000,
        duration: 15,
        dimensions: { width: 1080, height: 1920 },
        audio: {
          title: 'Tarantella Napoletana (Lo-Fi)',
          artist: 'Nonna Beats',
          audioUrl: 'https://cdn.freesound.org/previews/612/612642_11861866-lq.mp3',
          duration: 30
        },
        fileSizeMb: 14.1
      },
      {
        id: 'cc-2',
        type: 'post',
        title: '84% Hydration Sourdough Open Crumb',
        url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=85',
        caption: 'Look at that blistering and wild open honeycomb crumb. Fermented 36 hours in cold retarder. Recipe in caption! #sourdough #breadmaking #baking',
        timestamp: '3 days ago',
        likes: 112000,
        comments: 1890,
        dimensions: { width: 1080, height: 1080 },
        fileSizeMb: 4.5
      }
    ]
  }
};

/**
 * Helper to dynamically create a profile if user enters any unknown username or custom Instagram URL
 */
export function generateProfileFromInput(input: string): InstagramProfile {
  let clean = input.trim();
  // Strip protocol and instagram.com
  clean = clean.replace(/^(https?:\/\/)?(www\.)?instagram\.com\//i, '');
  clean = clean.replace(/^@/, '');
  
  // Extract handle or clean up URL params
  let handle = clean.split('/')[0] || 'instagram_user';
  let isReel = false;
  let isPost = false;

  if (clean.startsWith('reel/') || clean.startsWith('reels/')) {
    isReel = true;
    handle = 'reels_creator';
  } else if (clean.startsWith('p/')) {
    isPost = true;
    handle = 'insta_curator';
  }

  // Check if matches an existing mock profile
  if (MOCK_PROFILES[handle.toLowerCase()]) {
    return MOCK_PROFILES[handle.toLowerCase()];
  }

  // Create an authentic custom profile
  const formattedHandle = handle.replace(/[^a-zA-Z0-9_.]/g, '').toLowerCase() || 'creator';
  const displayName = formattedHandle.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return {
    username: formattedHandle,
    fullName: `${displayName} ✦ Official Media`,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    isVerified: true,
    bio: `Visual creator & storyteller 📸\nCapturing moments across the globe\nFull media vault available for HD download`,
    externalUrl: `https://${formattedHandle}.bio.link`,
    category: isReel ? 'Video Creator' : 'Digital Creator',
    hasActiveStories: true,
    stats: {
      postsCount: 84,
      reelsCount: 42,
      storiesCount: 3,
      highlightsCount: 4,
      followersCount: '480K',
      followingCount: '312',
    },
    highlights: [
      { id: 'gen-hl-1', title: 'Top Reels', coverUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=300&q=80', itemsCount: 16 },
      { id: 'gen-hl-2', title: 'V-Logs', coverUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=300&q=80', itemsCount: 24 },
      { id: 'gen-hl-3', title: 'Aesthetics', coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=300&q=80', itemsCount: 12 },
      { id: 'gen-hl-4', title: 'Presets', coverUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=300&q=80', itemsCount: 9 },
    ],
    media: [
      {
        id: 'gen-1',
        type: 'reel',
        title: `${displayName}'s Trending Reel • 4K HD`,
        url: SAMPLE_VIDEOS.tokyoNight,
        thumbnailUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=85',
        caption: `Captured on location with high frame rate 60fps. Color graded with modern vibrant curve. #reels #viral #${formattedHandle}`,
        timestamp: '3 hours ago',
        likes: 84200,
        comments: 1840,
        views: 620000,
        duration: 15,
        dimensions: { width: 1080, height: 1920 },
        audio: {
          title: `Original Audio - ${displayName}`,
          artist: formattedHandle,
          audioUrl: 'https://cdn.freesound.org/previews/612/612642_11861866-lq.mp3',
          duration: 25
        },
        fileSizeMb: 14.5
      },
      {
        id: 'gen-2',
        type: 'reel',
        title: 'Cinematic Drone Coastal Transition',
        url: SAMPLE_VIDEOS.surfWave,
        thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=85',
        caption: 'High speed tracking shot over the sea cliffs. Notice how the golden glow illuminates the turquoise water. #nature #cinematic #fpv',
        timestamp: '1 day ago',
        likes: 62300,
        comments: 940,
        views: 450000,
        duration: 15,
        dimensions: { width: 1080, height: 1920 },
        audio: {
          title: 'Deep Horizon Chill Beat',
          artist: 'Sound Wave Collective',
          audioUrl: 'https://cdn.freesound.org/previews/612/612642_11861866-lq.mp3',
          duration: 30
        },
        fileSizeMb: 16.8
      },
      {
        id: 'gen-3',
        type: 'post',
        title: 'Minimalist Studio Lighting Series',
        url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=85',
        caption: 'Working with single softbox diffusion. Simple setups often yield the cleanest contrast. #photography #studio #minimal',
        timestamp: '2 days ago',
        likes: 41900,
        comments: 512,
        dimensions: { width: 1080, height: 1350 },
        fileSizeMb: 5.1
      },
      {
        id: 'gen-4',
        type: 'story',
        title: 'Active Story • Setup Today',
        url: SAMPLE_VIDEOS.cityTimeLapse,
        thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=85',
        caption: 'Live from the editing studio. Big video dropping tomorrow!',
        timestamp: 'Active Story (Expires in 8h)',
        likes: 11400,
        comments: 104,
        duration: 15,
        dimensions: { width: 1080, height: 1920 },
        fileSizeMb: 7.8
      },
      {
        id: 'gen-5',
        type: 'highlight',
        title: 'Top Highlight Reel from Tokyo Archive',
        url: SAMPLE_VIDEOS.tokyoNight,
        thumbnailUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=85',
        albumTitle: 'Top Reels',
        caption: 'Saved to Top Reels permanent collection.',
        timestamp: 'Saved in Highlights',
        likes: 29800,
        comments: 320,
        duration: 15,
        dimensions: { width: 1080, height: 1920 },
        fileSizeMb: 12.1
      },
      {
        id: 'gen-6',
        type: 'post',
        title: 'Golden Hour Reflections',
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=85',
        caption: 'Reflections on the mirror lake during the blue hour transition.',
        timestamp: '4 days ago',
        likes: 53100,
        comments: 670,
        dimensions: { width: 1080, height: 1350 },
        fileSizeMb: 5.8
      }
    ]
  };
}
