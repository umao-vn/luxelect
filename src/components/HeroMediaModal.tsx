import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2, Image as ImageIcon, Video, Check, Link as LinkIcon, AlertCircle, Edit3, Eye, Upload, FileVideo, FileImage, LayoutGrid, Sparkles, RefreshCw } from 'lucide-react';
import { HeroMediaItem, SplitBgConfig, SplitBgPanel } from '../types';
import { cleanAndConvertImageUrl, cleanAndConvertVideoUrl, DEFAULT_FALLBACK_IMAGE } from '../utils';

interface HeroMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  heroMediaList: HeroMediaItem[];
  activeMediaId: string | null;
  onSelectActiveMedia: (id: string) => void;
  onAddHeroMedia: (newItem: Omit<HeroMediaItem, 'id'>) => void;
  onDeleteHeroMedia: (id: string) => void;
  onUpdateHeroMedia: (updatedItem: HeroMediaItem) => void;
  currentLang: 'ko' | 'vi';
  modalTitleKO?: string;
  modalTitleVI?: string;
  modalSubtitleKO?: string;
  modalSubtitleVI?: string;
  splitBgConfig?: SplitBgConfig;
  onUpdateSplitBgConfig?: (newConfig: SplitBgConfig) => void;
  initialTab?: 'split' | 'single';
}

export default function HeroMediaModal({
  isOpen,
  onClose,
  heroMediaList,
  activeMediaId,
  onSelectActiveMedia,
  onAddHeroMedia,
  onDeleteHeroMedia,
  onUpdateHeroMedia,
  currentLang,
  modalTitleKO,
  modalTitleVI,
  modalSubtitleKO,
  modalSubtitleVI,
  splitBgConfig,
  onUpdateSplitBgConfig,
  initialTab = 'split',
}: HeroMediaModalProps) {
  const [activeTab, setActiveTab] = useState<'split' | 'single'>(initialTab);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states for single media adding/editing
  const [type, setType] = useState<'photo' | 'video'>('photo');
  const [titleKO, setTitleKO] = useState('');
  const [titleVI, setTitleVI] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [formError, setFormError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFileSize, setUploadedFileSize] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const panelFileInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  if (!isOpen) return null;

  // Process input URL live
  const processedUrl = type === 'photo'
    ? cleanAndConvertImageUrl(urlInput)
    : cleanAndConvertVideoUrl(urlInput);

  const resetForm = () => {
    setEditingId(null);
    setType('photo');
    setTitleKO('');
    setTitleVI('');
    setUrlInput('');
    setFormError('');
    setUploadedFileName('');
    setUploadedFileSize('');
  };

  const handleStartEdit = (item: HeroMediaItem) => {
    setEditingId(item.id);
    setType(item.type);
    setTitleKO(item.titleKO);
    setTitleVI(item.titleVI);
    setUrlInput(item.url);
    setFormError('');
    setUploadedFileName('');
    setUploadedFileSize('');
  };

  // Direct File Reader Handler for Videos & Photos
  const handleMediaFile = (file: File) => {
    if (!file) return;

    const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|ogg|mov|m4v)$/i.test(file.name);
    const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(file.name);

    if (!isVideo && !isImage) {
      setFormError(
        currentLang === 'ko'
          ? '지원되지 않는 파일 형식입니다. MP4, WEBM, MOV 동영상 또는 JPG, PNG, WEBP 이미지 파일을 선택해 주세요.'
          : 'Định dạng tệp không được hỗ trợ. Vui lòng chọn tệp MP4, WEBM, MOV hoặc JPG, PNG, WEBP.'
      );
      return;
    }

    const detectedType: 'photo' | 'video' = isVideo ? 'video' : 'photo';
    setType(detectedType);

    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    setUploadedFileName(file.name);
    setUploadedFileSize(`${sizeInMB} MB`);

    const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
    if (!titleKO) setTitleKO(fileNameWithoutExt);
    if (!titleVI) setTitleVI(fileNameWithoutExt);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setUrlInput(e.target.result as string);
        setFormError('');
      }
    };
    reader.onerror = () => {
      setFormError(currentLang === 'ko' ? '파일을 읽는 중 오류가 발생했습니다.' : 'Lỗi đọc tệp.');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) {
      setFormError(currentLang === 'ko' ? '사진 또는 동영상 URL 주소를 입력해 주세요.' : 'Vui lòng nhập đường dẫn URL.');
      return;
    }

    const finalTitleKO = titleKO.trim() || (type === 'photo' ? '상단 스페셜 사진' : '상단 시네마틱 동영상');
    const finalTitleVI = titleVI.trim() || (type === 'photo' ? 'Ảnh đặc biệt Top' : 'Video đặc biệt Top');

    if (editingId) {
      onUpdateHeroMedia({
        id: editingId,
        type,
        titleKO: finalTitleKO,
        titleVI: finalTitleVI,
        url: processedUrl,
      });
    } else {
      onAddHeroMedia({
        type,
        titleKO: finalTitleKO,
        titleVI: finalTitleVI,
        url: processedUrl,
      });
    }

    resetForm();
  };

  // Handler for 3-Split Panel Updates
  const handlePanelUpdate = (index: number, updatedFields: Partial<SplitBgPanel>) => {
    if (!splitBgConfig || !onUpdateSplitBgConfig) return;
    const newPanels = [...splitBgConfig.panels] as [SplitBgPanel, SplitBgPanel, SplitBgPanel];
    newPanels[index] = { ...newPanels[index], ...updatedFields };
    onUpdateSplitBgConfig({
      ...splitBgConfig,
      panels: newPanels,
    });
  };

  // Handler for Panel File Upload
  const handlePanelFileUpload = (index: number, file: File) => {
    if (!file) return;
    const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|ogg|mov|m4v)$/i.test(file.name);
    const detectedType: 'photo' | 'video' = isVideo ? 'video' : 'photo';

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        handlePanelUpdate(index, {
          type: detectedType,
          url: e.target.result as string,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Handler for Toggling 3-Split Mode
  const handleToggleSplitMode = () => {
    if (!splitBgConfig || !onUpdateSplitBgConfig) return;
    onUpdateSplitBgConfig({
      ...splitBgConfig,
      isEnabled: !splitBgConfig.isEnabled,
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 my-8 flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-[#0066FF] to-[#00D1FF] text-white shadow-md">
                <LayoutGrid className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold font-sans flex items-center gap-2">
                  <span>
                    {currentLang === 'ko'
                      ? (modalTitleKO || '⚡ 상단 배경화면 & 3분할 커스텀 관리자')
                      : (modalTitleVI || '⚡ Quản lý Nền Chia 3 & Top Media')}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#00D1FF]/20 border border-[#00D1FF]/40 text-[#00D1FF] font-mono uppercase font-semibold">
                    Real-time Sync
                  </span>
                </h3>
                <p className="text-xs text-slate-300 font-sans">
                  {currentLang === 'ko'
                    ? (modalSubtitleKO || '배경화면 3분할 레이아웃 개별 설정 및 사진/동영상 URL을 직접 변경하여 실시간으로 반영합니다.')
                    : (modalSubtitleVI || 'Thiết lập riêng từng phần của 배경 chia 3 và cập nhật URL ảnh/video thực tế.')}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="px-6 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              {splitBgConfig && (
                <button
                  type="button"
                  onClick={() => setActiveTab('split')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-sans transition-all flex items-center gap-2 ${
                    activeTab === 'split'
                      ? 'bg-gradient-to-r from-[#0066FF] to-[#00D1FF] text-white shadow-md'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span>{currentLang === 'ko' ? '⚡ 배경 3분할 개별 설정' : 'Thiết lập Chia 3 Nền'}</span>
                  {splitBgConfig.isEnabled && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={() => setActiveTab('single')}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-sans transition-all flex items-center gap-2 ${
                  activeTab === 'single'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>{currentLang === 'ko' ? '📷/🎥 단일 배경 리스트' : 'Danh sách Nền Đơn'}</span>
              </button>
            </div>

            {splitBgConfig && activeTab === 'split' && (
              <button
                type="button"
                onClick={handleToggleSplitMode}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 border ${
                  splitBgConfig.isEnabled
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-700'
                    : 'bg-slate-200 border-slate-300 text-slate-600'
                }`}
              >
                <span>3분할 모드:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                  splitBgConfig.isEnabled ? 'bg-emerald-500 text-white' : 'bg-slate-400 text-white'
                }`}>
                  {splitBgConfig.isEnabled ? 'ON (활성)' : 'OFF (비활성)'}
                </span>
              </button>
            )}
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-grow text-left">
            {/* 📍 TAB 1: 3-SPLIT INDIVIDUAL BACKGROUND SETTINGS */}
            {activeTab === 'split' && splitBgConfig && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200/80 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#0066FF]" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 font-sans">
                        {currentLang === 'ko' ? '실시간 3분할 배경 개별 커스터마이징' : 'Tùy Chỉnh Thực Tế 3 Nền Phân Tách'}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {currentLang === 'ko'
                          ? '각 패널(좌측, 중앙, 우측)별로 사진/동영상과 URL 링크를 변경하면 실시간으로 배경화면에 적용됩니다.'
                          : 'Thay đổi ảnh/video và URL cho từng bảng để cập nhật ngay lập tức.'}
                      </p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-white border border-cyan-300 text-[10px] font-mono font-bold text-[#0066FF] shadow-sm">
                    ✨ High-Tech Dividers Enabled
                  </span>
                </div>

                {/* 3 Panels Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {splitBgConfig.panels.map((panel, idx) => {
                    const panelLabelsKO = ['상단 (Top Panel 01)', '중단 (Middle Panel 02)', '하단 (Bottom Panel 03)'];
                    const panelLabelsVI = ['Trên (Panel 01)', 'Giữa (Panel 02)', 'Dưới (Panel 03)'];

                    const displayUrl = panel.type === 'photo'
                      ? cleanAndConvertImageUrl(panel.url)
                      : cleanAndConvertVideoUrl(panel.url);

                    return (
                      <div
                        key={panel.id || idx}
                        className="p-4 rounded-2xl border border-slate-200 bg-slate-50/80 hover:bg-white hover:border-[#0066FF]/40 shadow-sm transition-all duration-200 flex flex-col justify-between space-y-4"
                      >
                        {/* Panel Header */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-mono text-[10px] font-bold">
                              PANEL 0{idx + 1}
                            </span>
                            <span className="text-xs font-bold text-slate-700 font-sans">
                              {currentLang === 'ko' ? panelLabelsKO[idx] : panelLabelsVI[idx]}
                            </span>
                          </div>

                          {/* Live Preview Viewport */}
                          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-300 group shadow-inner">
                            {panel.type === 'photo' ? (
                              <img
                                src={displayUrl || DEFAULT_FALLBACK_IMAGE}
                                alt={panel.titleKO}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
                                }}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <video
                                key={displayUrl}
                                src={displayUrl || undefined}
                                autoPlay
                                loop
                                muted
                                playsInline
                                onCanPlay={(e) => {
                                  (e.currentTarget as HTMLVideoElement).play().catch(() => {});
                                }}
                                className="w-full h-full object-cover"
                              />
                            )}

                            <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm text-white text-[9px] font-mono">
                              {panel.type === 'photo' ? '📷 PHOTO' : '🎥 VIDEO'}
                            </div>

                            {/* Divider overlay preview indicator */}
                            {idx < 2 && (
                              <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#00D1FF] shadow-[0_0_8px_#00D1FF]" />
                            )}
                          </div>

                          {/* Media Type Switcher */}
                          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-200/80">
                            <button
                              type="button"
                              onClick={() => handlePanelUpdate(idx, { type: 'photo' })}
                              className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                                panel.type === 'photo'
                                  ? 'bg-white text-[#0066FF] shadow-sm'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              <ImageIcon className="w-3.5 h-3.5" />
                              <span>사진</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handlePanelUpdate(idx, { type: 'video' })}
                              className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                                panel.type === 'video'
                                  ? 'bg-purple-600 text-white shadow-sm'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              <Video className="w-3.5 h-3.5" />
                              <span>동영상</span>
                            </button>
                          </div>

                          {/* URL Input */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-600 font-mono block">
                              미디어 URL 링크 (Image / MP4 Link):
                            </label>
                            <input
                              type="text"
                              value={panel.url}
                              onChange={(e) => handlePanelUpdate(idx, { url: e.target.value })}
                              placeholder={panel.type === 'photo' ? 'https://i.ibb.co/... 주소' : 'https://.../sample.mp4 주소'}
                              className="w-full px-2.5 py-2 text-xs font-mono rounded-xl border border-slate-300 focus:outline-none focus:border-[#0066FF] bg-white shadow-inner"
                            />
                          </div>

                          {/* Local File Selector Button */}
                          <div>
                            <input
                              type="file"
                              ref={panelFileInputRefs[idx]}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handlePanelFileUpload(idx, file);
                              }}
                              accept="image/*,video/*"
                              className="hidden"
                            />
                            <button
                              type="button"
                              onClick={() => panelFileInputRefs[idx].current?.click()}
                              className="w-full py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                            >
                              <Upload className="w-3.5 h-3.5 text-[#0066FF]" />
                              <span>📁 내 컴퓨터 파일 업로드</span>
                            </button>
                          </div>

                          {/* Title Inputs */}
                          <div className="space-y-1.5 pt-1">
                            <input
                              type="text"
                              value={panel.titleKO || ''}
                              onChange={(e) => handlePanelUpdate(idx, { titleKO: e.target.value })}
                              placeholder="패널 한국어 제목"
                              className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#0066FF] bg-white"
                            />
                            <input
                              type="text"
                              value={panel.tagKO || ''}
                              onChange={(e) => handlePanelUpdate(idx, { tagKO: e.target.value })}
                              placeholder="패널 뱃지 라벨 (예: PANEL 01)"
                              className="w-full px-2.5 py-1.5 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:border-[#0066FF] bg-white"
                            />
                          </div>
                        </div>

                        {/* Quick Presets for fast testing */}
                        <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-1">
                          <button
                            type="button"
                            onClick={() => handlePanelUpdate(idx, {
                              type: 'video',
                              url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
                            })}
                            className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 text-[9px] font-mono hover:bg-purple-100"
                          >
                            🎥 샘플 비디오 1
                          </button>
                          <button
                            type="button"
                            onClick={() => handlePanelUpdate(idx, {
                              type: 'photo',
                              url: 'https://i.ibb.co/DPSdv7wD/No-14-10.png'
                            })}
                            className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[9px] font-mono hover:bg-blue-100"
                          >
                            📷 샘플 사진 1
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 📍 TAB 2: SINGLE HERO MEDIA LIST MANAGEMENT */}
            {activeTab === 'single' && (
              <div className="space-y-6">
                {/* Registered Media Items List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider font-mono flex items-center gap-2">
                      <span>등록된 상단 미디어 목록 ({heroMediaList.length}개)</span>
                    </h4>
                    {editingId && (
                      <button
                        onClick={resetForm}
                        className="text-xs text-[#0066FF] hover:underline font-medium font-sans"
                      >
                        {currentLang === 'ko' ? '+ 신규 등록으로 전환' : '+ Chuyển sang thêm mới'}
                      </button>
                    )}
                  </div>

                  {heroMediaList.length === 0 ? (
                    <div className="p-8 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 space-y-2">
                      <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="text-xs font-bold text-slate-600">
                        {currentLang === 'ko' ? '등록된 상단 미디어가 없습니다.' : 'Chưa có media nào ở phần trên.'}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {currentLang === 'ko' ? '아래 서식에서 사진 또는 동영상 URL을 등록해 보세요.' : 'Hãy thêm URL bên dưới.'}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
                      {heroMediaList.map((item) => {
                        const isActive = item.id === activeMediaId;
                        return (
                          <div
                            key={item.id}
                            className={`p-3 rounded-2xl border transition-all duration-200 flex items-center gap-3 relative ${
                              isActive
                                ? 'bg-[#0066FF]/5 border-[#0066FF] shadow-sm'
                                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {/* Thumbnail */}
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 flex-shrink-0 relative group">
                              {item.type === 'photo' ? (
                                <img
                                  src={cleanAndConvertImageUrl(item.url) || DEFAULT_FALLBACK_IMAGE}
                                  alt={item.titleKO}
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
                                  }}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <video
                                  key={item.id}
                                  src={cleanAndConvertVideoUrl(item.url) || undefined}
                                  autoPlay
                                  loop
                                  muted
                                  playsInline
                                  onCanPlay={(e) => {
                                    (e.currentTarget as HTMLVideoElement).play().catch(() => {});
                                  }}
                                  className="w-full h-full object-cover"
                                />
                              )}
                              <div className="absolute top-1 left-1 px-1 py-0.5 rounded bg-black/70 text-white text-[8px] font-mono">
                                {item.type === 'photo' ? '📷' : '🎥'}
                              </div>
                            </div>

                            {/* Text Detail */}
                            <div className="flex-grow min-w-0 space-y-1">
                              <div className="flex items-center gap-1.5">
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold font-mono uppercase ${
                                  item.type === 'photo' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                                }`}>
                                  {item.type === 'photo' ? '사진 Photo' : '동영상 Video'}
                                </span>
                                {isActive && (
                                  <span className="px-1.5 py-0.5 rounded bg-[#0066FF] text-white text-[9px] font-bold font-mono">
                                    ACTIVE
                                  </span>
                                )}
                              </div>
                              <h5 className="text-xs font-bold text-slate-800 truncate">
                                {currentLang === 'ko' ? item.titleKO : item.titleVI}
                              </h5>
                              <p className="text-[10px] text-slate-400 font-mono truncate max-w-[180px]">
                                {item.url}
                              </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-1 items-end flex-shrink-0">
                              <button
                                onClick={() => {
                                  onSelectActiveMedia(item.id);
                                  if (splitBgConfig?.isEnabled && onUpdateSplitBgConfig) {
                                    onUpdateSplitBgConfig({
                                      ...splitBgConfig,
                                      isEnabled: false,
                                    });
                                  }
                                }}
                                className={`px-2 py-1 rounded-lg text-[10px] font-bold font-mono transition-all ${
                                  isActive
                                    ? 'bg-[#0066FF] text-white'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                                }`}
                              >
                                {isActive ? '선택됨' : '선택'}
                              </button>
                              <div className="flex items-center gap-1 pt-1">
                                <button
                                  onClick={() => handleStartEdit(item)}
                                  className="p-1 rounded text-slate-400 hover:text-[#0066FF] hover:bg-slate-200"
                                  title="수정"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => onDeleteHeroMedia(item.id)}
                                  className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                  title="삭제"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Add / Edit Form */}
                <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono flex items-center gap-2">
                    <Plus className="w-4 h-4 text-[#0066FF]" />
                    <span>
                      {editingId
                        ? (currentLang === 'ko' ? '상단 미디어 정보 수정' : 'Sửa thông tin Media Top')
                        : (currentLang === 'ko' ? '새 상단 배경 미디어 추가' : 'Thêm Media Top Mới')}
                    </span>
                  </h4>

                  {/* Type Selector Pills */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setType('photo')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                        type === 'photo'
                          ? 'bg-[#0066FF] text-white shadow-md'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span>{currentLang === 'ko' ? '📷 사진 (Photo)' : '📷 Ảnh (Photo)'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setType('video')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                        type === 'video'
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Video className="w-4 h-4" />
                      <span>{currentLang === 'ko' ? '🎥 동영상 (Video MP4)' : '🎥 Video (Video MP4)'}</span>
                    </button>
                  </div>

                  {/* File Upload Box */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragOver(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleMediaFile(file);
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-4 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center space-y-2 ${
                      isDragOver
                        ? 'border-[#0066FF] bg-[#0066FF]/5 scale-[0.99]'
                        : 'border-slate-300 bg-white hover:border-[#0066FF]/50 hover:bg-slate-50/50'
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleMediaFile(file);
                      }}
                      accept="image/*,video/*"
                      className="hidden"
                    />
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-[#0066FF]">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-slate-700">
                      {currentLang === 'ko' ? '컴퓨터에서 사진 또는 동영상 파일 선택' : 'Chọn tệp ảnh/video từ máy tính'}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {currentLang === 'ko' ? '드래그 앤 드롭하거나 클릭하여 MP4, WEBM, JPG, PNG 파일 업로드' : 'Kéo thả hoặc nhấp để tải tệp up'}
                    </p>
                    {uploadedFileName && (
                      <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono">
                        ✓ {uploadedFileName} ({uploadedFileSize})
                      </span>
                    )}
                  </div>

                  {/* Title Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">
                        {currentLang === 'ko' ? '제목 (한국어)' : 'Tiêu đề (Tiếng Hàn)'}:
                      </label>
                      <input
                        type="text"
                        value={titleKO}
                        onChange={(e) => setTitleKO(e.target.value)}
                        placeholder="예: 프리미엄 비주얼 대표 이미지"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#0066FF] bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">
                        {currentLang === 'ko' ? '제목 (Tiếng Việt)' : 'Tiêu đề (Tiếng Việt)'}:
                      </label>
                      <input
                        type="text"
                        value={titleVI}
                        onChange={(e) => setTitleVI(e.target.value)}
                        placeholder="Ví dụ: Hình ảnh thương hiệu cao cấp"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#0066FF] bg-white"
                      />
                    </div>
                  </div>

                  {/* URL Input */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 flex items-center justify-between">
                      <span>미디어 URL (직접 입력 또는 파일 업로드 주소):</span>
                      <span className="text-[10px] text-[#0066FF] font-mono">ImgBB, PostImg, Google Storage 지원</span>
                    </label>
                    <input
                      type="text"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder={type === 'photo' ? 'https://i.ibb.co/... 주소' : 'https://.../sample.mp4 주소'}
                      className="w-full px-3 py-2.5 text-xs font-mono rounded-xl border border-slate-300 focus:outline-none focus:border-[#0066FF] bg-white shadow-inner"
                    />
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[10px] text-slate-400 font-mono">빠른 샘플:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setType('photo');
                        setUrlInput('https://i.ibb.co/DPSdv7wD/No-14-10.png');
                      }}
                      className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-[10px] text-slate-600 hover:text-[#0066FF] hover:border-[#0066FF]"
                    >
                      📷 ImgBB 사진 1
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setType('video');
                        setUrlInput('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
                      }}
                      className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-[10px] text-slate-600 hover:text-purple-600 hover:border-purple-600"
                    >
                      🎥 샘플 MP4 동영상
                    </button>
                  </div>

                  {/* Live Preview Box */}
                  {urlInput.trim() && (
                    <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1.5 text-left">
                      <span className="text-[10px] font-bold font-mono uppercase text-[#0066FF] block">
                        LIVE PREVIEW (실시간 미리보기)
                      </span>
                      <div className="w-full h-32 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center relative">
                        {type === 'photo' ? (
                          <img
                            src={processedUrl || DEFAULT_FALLBACK_IMAGE}
                            alt="Preview"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
                            }}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <video
                            key={processedUrl}
                            src={processedUrl || undefined}
                            controls
                            autoPlay
                            loop
                            muted
                            playsInline
                            onCanPlay={(e) => {
                              (e.currentTarget as HTMLVideoElement).play().catch(() => {});
                            }}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {formError && (
                    <p className="text-xs text-rose-600 font-bold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{formError}</span>
                    </p>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-2">
                    {editingId && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs font-bold"
                      >
                        취소
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-[#0066FF]/20 flex items-center gap-1.5 transition-all"
                    >
                      <Check className="w-4 h-4" />
                      <span>{editingId ? '수정사항 저장' : '상단 미디어에 추가하기'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 text-right flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-mono">
              ✨ 모든 변경사항은 실시간으로 저장 및 반영됩니다.
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-all"
            >
              닫기 (Close)
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
