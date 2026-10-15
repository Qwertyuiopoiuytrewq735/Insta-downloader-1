import React, { useRef, useState, useEffect } from 'react';
import { MediaItem, EnhancementSettings } from '../types/instagram';
import { 
  X, 
  Sparkles, 
  Sliders, 
  Download, 
  RotateCcw, 
  Upload, 
  Sun, 
  Contrast, 
  Flame, 
  Eye, 
  Layers, 
  Check,
  Maximize2
} from 'lucide-react';
import { applyImageEnhancements } from '../utils/imageEnhancerEngine';

interface ImageEnhancerModalProps {
  initialImageUrl: string | null;
  initialTitle?: string;
  onClose: () => void;
}

export const ImageEnhancerModal: React.FC<ImageEnhancerModalProps> = ({
  initialImageUrl,
  initialTitle,
  onClose,
}) => {
  const originalCanvasRef = useRef<HTMLCanvasElement>(null);
  const enhancedCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeImageUrl, setActiveImageUrl] = useState<string | null>(initialImageUrl);
  const [sliderPosition, setSliderPosition] = useState<number>(50); // Split percentage 0 to 100
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);
  const [exportFormat, setExportFormat] = useState<'image/png' | 'image/jpeg'>('image/png');

  // Enhancement Sliders State
  const [settings, setSettings] = useState<EnhancementSettings>({
    sharpness: 50,
    clarity: 40,
    vibrance: 25,
    contrast: 15,
    brightness: 8,
    warmth: 12,
    preset: 'sunset',
    scale: 2,
  });

  const [imageLoaded, setImageLoaded] = useState(false);
  const imageElementRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (initialImageUrl) {
      setActiveImageUrl(initialImageUrl);
    }
  }, [initialImageUrl]);

  // Load image onto source element and render canvases
  useEffect(() => {
    if (!activeImageUrl) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = activeImageUrl;

    img.onload = () => {
      imageElementRef.current = img;
      setImageLoaded(true);

      // Render raw original canvas
      if (originalCanvasRef.current) {
        const origCanvas = originalCanvasRef.current;
        origCanvas.width = img.width;
        origCanvas.height = img.height;
        const ctx = origCanvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
      }

      // Render enhanced canvas
      renderEnhanced();
    };
  }, [activeImageUrl]);

  // Re-render enhanced whenever settings change
  useEffect(() => {
    if (imageLoaded && imageElementRef.current) {
      renderEnhanced();
    }
  }, [settings, imageLoaded]);

  const renderEnhanced = () => {
    if (!imageElementRef.current || !enhancedCanvasRef.current) return;
    applyImageEnhancements(imageElementRef.current, enhancedCanvasRef.current, settings);
  };

  const handleReset = () => {
    setSettings({
      sharpness: 0,
      clarity: 0,
      vibrance: 0,
      contrast: 0,
      brightness: 0,
      warmth: 0,
      preset: 'original',
      scale: 1,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setActiveImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Dragging split slider
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingSlider) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setSliderPosition((x / rect.width) * 100);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDraggingSlider || e.touches.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
    setSliderPosition((x / rect.width) * 100);
  };

  const handleDownloadEnhanced = () => {
    if (!enhancedCanvasRef.current) return;
    const ext = exportFormat === 'image/png' ? 'png' : 'jpg';
    const link = document.createElement('a');
    link.href = enhancedCanvasRef.current.toDataURL(exportFormat, 0.95);
    link.download = `instafetch_enhanced_${settings.scale}x_${Date.now()}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filterPresets = [
    { key: 'original', label: 'Original', gradient: 'bg-slate-300' },
    { key: 'sunset', label: 'Sunset Glow', gradient: 'bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600' },
    { key: 'clarendon', label: 'Clarendon', gradient: 'bg-gradient-to-tr from-blue-600 to-sky-400' },
    { key: 'valencia', label: 'Valencia', gradient: 'bg-gradient-to-tr from-amber-400 to-orange-500' },
    { key: 'juno', label: 'Juno', gradient: 'bg-gradient-to-tr from-emerald-500 to-amber-400' },
    { key: 'lark', label: 'Lark', gradient: 'bg-gradient-to-tr from-cyan-400 to-indigo-500' },
    { key: 'gingham', label: 'Gingham', gradient: 'bg-gradient-to-tr from-yellow-300 to-stone-400' },
    { key: 'moon', label: 'Moon B&W', gradient: 'bg-gradient-to-tr from-slate-900 to-slate-400' },
  ];

  if (!activeImageUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      {/* Hidden file input for custom uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      <div className="relative z-10 w-full max-w-6xl max-h-[96vh] bg-white text-slate-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-200">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-100 text-pink-600 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>HD Image Enhancer & Instagram Filter Studio</span>
                <span className="text-[11px] font-bold px-2 py-0.5 bg-gradient-to-r from-pink-500 to-amber-500 text-white rounded-full">
                  AI Upscale Engine
                </span>
              </h2>
              <p className="text-xs text-slate-500 truncate max-w-md">
                {initialTitle || 'Drag before/after slider to compare real-time enhancement'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 text-xs font-semibold cursor-pointer"
              title="Upload another photo from your computer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Photo</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Studio Workspace Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Interactive Before / After Comparison Canvas */}
          <div className="lg:col-span-7 flex flex-col gap-2.5">
            <div
              className="relative aspect-square sm:aspect-[4/5] max-h-[440px] w-full mx-auto bg-slate-950 rounded-2xl overflow-hidden shadow-md select-none cursor-ew-resize"
              onMouseDown={() => setIsDraggingSlider(true)}
              onMouseUp={() => setIsDraggingSlider(false)}
              onMouseMove={handleMouseMove}
              onTouchStart={() => setIsDraggingSlider(true)}
              onTouchEnd={() => setIsDraggingSlider(false)}
              onTouchMove={handleTouchMove}
            >
              {/* Original Canvas (Background) */}
              <canvas
                ref={originalCanvasRef}
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
              />

              {/* Enhanced Canvas (Clipped on top) */}
              <div
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{ width: `${sliderPosition}%` }}
              >
                <canvas
                  ref={enhancedCanvasRef}
                  className="absolute inset-0 w-full h-full object-contain"
                />
              </div>

              {/* Divider Line & Draggable Handle */}
              <div
                className="absolute top-0 bottom-0 z-20 w-0.5 bg-white shadow-lg pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-xl border-2 border-pink-500 flex items-center justify-center pointer-events-auto cursor-ew-resize">
                  <div className="flex items-center gap-0.5 text-slate-600">
                    <span className="w-1 h-3 bg-slate-400 rounded-full" />
                    <span className="w-1 h-3 bg-slate-400 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Badges on Top */}
              <div className="absolute top-3 left-3 z-10 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider">
                Enhanced ({settings.scale}X)
              </div>
              <div className="absolute top-3 right-3 z-10 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider">
                Original
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>← Enhanced View</span>
              <span className="font-medium text-slate-700">Drag divider to compare</span>
              <span>Original View →</span>
            </div>
          </div>

          {/* Right Column: Enhancement Tuning Controls */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            <div className="space-y-4">
              {/* Resolution Scale Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Resolution Upscaling Engine
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { scale: 1 as const, label: '1X Native', sub: 'Default' },
                    { scale: 2 as const, label: '2X Super HD', sub: 'Recommended' },
                    { scale: 4 as const, label: '4X Ultra HD', sub: 'Print Quality' },
                  ].map((res) => (
                    <button
                      key={res.scale}
                      type="button"
                      onClick={() => setSettings({ ...settings, scale: res.scale })}
                      className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                        settings.scale === res.scale
                          ? 'bg-pink-50 border-pink-500 text-pink-700 ring-1 ring-pink-500 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-xs font-bold">{res.label}</div>
                      <div className="text-[10px] text-slate-400">{res.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Instagram Preset Filters */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Instagram Color Presets
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {filterPresets.map((p) => {
                    const isSelected = settings.preset === p.key;
                    return (
                      <button
                        key={p.key}
                        type="button"
                        onClick={() => setSettings({ ...settings, preset: p.key as any })}
                        className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-pink-50 border-pink-500 text-pink-700 font-bold ring-1 ring-pink-400'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full shadow-xs ${p.gradient}`} />
                        <span className="text-[11px] truncate max-w-[65px]">{p.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Fine Tuning Sliders */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                {/* Sharpness */}
                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-0.5">
                    <span>Ultra HD Sharpness</span>
                    <span className="font-mono text-pink-600">{settings.sharpness}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.sharpness}
                    onChange={(e) => setSettings({ ...settings, sharpness: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-pink-600"
                  />
                </div>

                {/* Clarity & Texture */}
                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-0.5">
                    <span>Clarity & Texture</span>
                    <span className="font-mono text-purple-600">{settings.clarity}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.clarity}
                    onChange={(e) => setSettings({ ...settings, clarity: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>

                {/* Vibrance */}
                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-0.5">
                    <span>Vibrance</span>
                    <span className="font-mono text-amber-600">{settings.vibrance > 0 ? `+${settings.vibrance}` : settings.vibrance}</span>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={settings.vibrance}
                    onChange={(e) => setSettings({ ...settings, vibrance: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>

                {/* Contrast */}
                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-0.5">
                    <span>Contrast</span>
                    <span className="font-mono text-slate-700">{settings.contrast > 0 ? `+${settings.contrast}` : settings.contrast}</span>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={settings.contrast}
                    onChange={(e) => setSettings({ ...settings, contrast: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-700"
                  />
                </div>

                {/* Warmth */}
                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-0.5">
                    <span>Warmth (Golden Glow)</span>
                    <span className="font-mono text-orange-600">{settings.warmth > 0 ? `+${settings.warmth}` : settings.warmth}</span>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={settings.warmth}
                    onChange={(e) => setSettings({ ...settings, warmth: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Download & Reset Buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={handleReset}
                className="p-2.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                title="Reset settings to original"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value as any)}
                className="text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 cursor-pointer"
              >
                <option value="image/png">Lossless PNG</option>
                <option value="image/jpeg">High Quality JPG</option>
              </select>

              <button
                onClick={handleDownloadEnhanced}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export Enhanced ({settings.scale}X)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
