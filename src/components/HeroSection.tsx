import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ChevronDown, Award, Zap, ShieldCheck, Settings, Plus, Image as ImageIcon, Video, Play, Pause, Volume2, VolumeX, LayoutGrid } from 'lucide-react';
import { HeroMediaItem, SplitBgConfig } from '../types';
import { DEFAULT_FALLBACK_IMAGE, cleanAndConvertImageUrl, cleanAndConvertVideoUrl } from '../utils';
import { TranslationSet } from '../translations';

interface HeroSectionProps {
  sectionId?: 'TOP_HERO' | 'SECONDARY_HERO' | string;
  heroMediaList: HeroMediaItem[];
  activeMediaId: string | null;
  onSelectActiveMedia: (id: string) => void;
  onOpenHeroMediaModal: (initialTab?: 'split' | 'single') => void;
  subMediaList?: HeroMediaItem[];
  activeSubMediaId?: string | null;
  onSelectActiveSubMedia?: (id: string) => void;
  onOpenSubMediaModal?: () => void;
  splitBgConfig?: SplitBgConfig;
  onUpdateSplitBgConfig?: (newConfig: SplitBgConfig) => void;
  t: TranslationSet;
  currentLang: 'ko' | 'vi';
  onScrollToProducts: () => void;
  onBannerClick?: () => void;
  isAdmin?: boolean;
  isDev?: boolean;
}

export default function HeroSection({
  sectionId = 'TOP_HERO',
  heroMediaList,
  activeMediaId,
  onSelectActiveMedia,
  onOpenHeroMediaModal,
  subMediaList = [],
  activeSubMediaId,
  onSelectActiveSubMedia,
  onOpenSubMediaModal,
  splitBgConfig,
  onUpdateSplitBgConfig,
  t,
  currentLang,
  onScrollToProducts,
  onBannerClick,
  isAdmin = false,
  isDev = false,
}: HeroSectionProps) {
  // Determine whether to display admin background management UI overlay (Only when in development and isAdmin is true)
  const isDevEnv = (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') || Boolean((import.meta as any).env?.DEV);
  const showAdminUI = Boolean(isAdmin && (isDev || isDevEnv));

  // Find item matching activeMediaId directly
  const activeById = heroMediaList.find((m) => m.id === activeMediaId);

  // PIP Sub Video / Photo Player States & Ref
  const [isSubVideoPlaying, setIsSubVideoPlaying] = useState(true);
  const [isSubVideoMuted, setIsSubVideoMuted] = useState(true);
  const subVideoRef = useRef<HTMLVideoElement>(null);

  // Active sub media item
  const activeSubItem = (subMediaList.length > 0
    ? (subMediaList.find((m) => m.id === activeSubMediaId) || subMediaList[0])
    : null);

  const subMediaUrl = activeSubItem?.url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
  const subMediaType = activeSubItem?.type || 'video';

  const toggleSubVideoPlay = () => {
    if (subVideoRef.current) {
      if (isSubVideoPlaying) {
        subVideoRef.current.pause();
        setIsSubVideoPlaying(false);
      } else {
        subVideoRef.current.play().catch(() => {});
        setIsSubVideoPlaying(true);
      }
    }
  };

  const toggleSubVideoMute = () => {
    if (subVideoRef.current) {
      subVideoRef.current.muted = !isSubVideoMuted;
      setIsSubVideoMuted(!isSubVideoMuted);
    }
  };

  // Initialize mediaTab based on activeById if available, otherwise 'photo'
  const [mediaTab, setMediaTab] = useState<'photo' | 'video'>(() => {
    return activeById ? activeById.type : 'photo';
  });

  // Keep mediaTab synchronized whenever activeMediaId / activeById changes
  useEffect(() => {
    if (activeById) {
      setMediaTab(activeById.type);
    }
  }, [activeMediaId, activeById?.type]);

  // Handle switching between Photo and Video tabs
  const handleTabChange = (tab: 'photo' | 'video') => {
    setMediaTab(tab);
    // Find first item in heroMediaList for this tab
    const targetItem = heroMediaList.find((m) => m.type === tab);
    if (targetItem) {
      onSelectActiveMedia(targetItem.id);
    } else {
      // If no item of this type exists yet, open modal to let user add one
      onOpenHeroMediaModal('single');
    }
  };

  // Filter hero media list by photo vs video tab
  const filteredList = heroMediaList.filter((m) => m.type === mediaTab);

  // Active item prioritization: explicit activeById first, then filteredList[0], then first in list
  const activeItem = activeById || filteredList[0] || heroMediaList[0];

  const displayTitle = activeItem
    ? (currentLang === 'ko' ? activeItem.titleKO : activeItem.titleVI)
    : (sectionId === 'SECONDARY_HERO'
        ? (currentLang === 'ko' ? '하단 서브 브랜드 시네마틱 배경' : 'Nền Phụ Thương Hiệu')
        : (currentLang === 'ko' ? '상단 메인 브랜드 시네마틱 배경' : 'Nền Phim Thương Hiệu'));

  return (
    <section 
      onClick={(e) => {
        // Trigger if clicking the section itself or its background decorative absolute divs
        if (
          e.target === e.currentTarget || 
          (e.target instanceof HTMLElement && (
            e.target.tagName === 'SECTION' || 
            e.target.classList.contains('absolute')
          ))
        ) {
          onBannerClick?.();
        }
      }}
      className="relative w-full flex flex-col justify-between overflow-hidden pt-8 md:pt-14 pb-8 border-b border-slate-800 cursor-pointer text-white min-h-[520px] lg:min-h-[580px]"
      title={currentLang === 'ko' ? '메인 화면으로 이동' : 'Về trang chủ'}
    >
      {/* Full-width Background Image / Video Container (Supports Vertical 3-Split Grid & Single Background) */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-slate-950">
        {splitBgConfig && splitBgConfig.isEnabled ? (
          /* 📍 [배경화면 세로 3분할 레이아웃 & 구분선 (Vertical 3-Split)] */
          <div className="flex flex-col w-full h-full relative border-collapse">
            {splitBgConfig.panels.map((panel, idx) => {
              const panelUrl = panel.type === 'photo'
                ? cleanAndConvertImageUrl(panel.url)
                : cleanAndConvertVideoUrl(panel.url);

              return (
                <div
                  key={panel.id || idx}
                  className="relative w-full h-1/3 flex-1 overflow-hidden bg-slate-900 group/panel"
                >
                  {panel.type === 'photo' ? (
                    <img
                      src={panelUrl || DEFAULT_FALLBACK_IMAGE}
                      alt={panel.titleKO || `Panel ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
                      }}
                      className="w-full h-full object-cover opacity-90 transition-all duration-700 group-hover/panel:scale-105 group-hover/panel:opacity-100"
                    />
                  ) : (
                    <video
                      key={panelUrl}
                      src={panelUrl || undefined}
                      autoPlay
                      loop
                      muted
                      playsInline
                      controlsList="nodownload"
                      preload="auto"
                      crossOrigin="anonymous"
                      onCanPlay={(e) => {
                        (e.currentTarget as HTMLVideoElement).play().catch(() => {});
                      }}
                      className="w-full h-full object-cover opacity-90 transition-all duration-700 group-hover/panel:scale-105 group-hover/panel:opacity-100"
                    />
                  )}

                  {/* High-tech Panel Tag Badge */}
                  <div className="absolute top-2.5 left-3 z-10 pointer-events-none">
                    <span className="px-2.5 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-[#00D1FF]/40 text-[9px] font-mono font-bold text-[#00D1FF] tracking-wider shadow-lg flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00D1FF] animate-pulse" />
                      <span>
                        {currentLang === 'ko'
                          ? (panel.tagKO || `PANEL 0${idx + 1}`)
                          : (panel.tagVI || `PANEL 0${idx + 1}`)}
                      </span>
                    </span>
                  </div>

                  {/* Panel Title Overlay */}
                  <div className="absolute bottom-2 left-3 right-3 z-10 opacity-80 group-hover/panel:opacity-100 transition-opacity pointer-events-none">
                    <p className="text-[11px] font-bold text-white font-sans truncate drop-shadow-md">
                      {currentLang === 'ko' ? panel.titleKO : panel.titleVI}
                    </p>
                  </div>

                  {/* 📍 [미니멀 명암 대비 가로 구분선 (Horizontal High-Tech Divider Line)] */}
                  {idx < 2 && (
                    <div className="absolute left-0 right-0 bottom-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00D1FF] to-transparent shadow-[0_0_12px_rgba(0,209,255,0.8)] z-20 pointer-events-none" />
                  )}

                  {/* Dark gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30 pointer-events-none" />
                </div>
              );
            })}
          </div>
        ) : (
          /* Single Background Mode */
          activeItem ? (
            activeItem.type === 'photo' ? (
              <img
                key={`photo-${activeItem.id}-${activeItem.url}`}
                src={cleanAndConvertImageUrl(activeItem.url) || DEFAULT_FALLBACK_IMAGE}
                alt={currentLang === 'ko' ? activeItem.titleKO : activeItem.titleVI}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
                }}
                className="w-full h-full object-cover opacity-100 transition-all duration-700"
              />
            ) : (
              <video
                key={`video-${activeItem.id}-${activeItem.url}`}
                src={cleanAndConvertVideoUrl(activeItem.url) || undefined}
                autoPlay
                loop
                muted
                playsInline
                controlsList="nodownload"
                preload="auto"
                crossOrigin="anonymous"
                onCanPlay={(e) => {
                  (e.currentTarget as HTMLVideoElement).play().catch(() => {});
                }}
                className="w-full h-full object-cover opacity-100 transition-all duration-700"
              />
            )
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950" />
          )
        )}

        {/* Subtle Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40 pointer-events-none" />
      </div>

      {/* 3-Section Segment Indicator Header + Background Management Controls (Shown only when in Admin Mode in Dev) */}
      {showAdminUI && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 mb-4 flex flex-wrap items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-black/70 border border-white/20 backdrop-blur-md text-[10px] font-mono font-black tracking-widest text-[#00D1FF] uppercase shadow-sm">
              {sectionId === 'SECONDARY_HERO' ? '[ 02. SECONDARY HERO / SUB BACKGROUND ]' : '[ 01. TOP HERO / MAIN BACKGROUND ]'}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/20 border border-emerald-400/40 backdrop-blur-md text-[10px] font-mono font-bold text-emerald-300">
              <span>✨</span>
              <span>{currentLang === 'ko' ? '사진 / 동영상 배경 선택' : 'Chọn Ảnh / Video Nền'}</span>
            </span>
          </div>

          {/* Dedicated Background Manage Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenHeroMediaModal('split');
              }}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#00D1FF] hover:opacity-95 text-white text-xs font-bold font-sans flex items-center gap-2 shadow-lg shadow-[#0066FF]/30 transition-all duration-300 hover:scale-105"
              id={`hero-bg-split-setting-btn-${sectionId}`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>{currentLang === 'ko' ? '배경 3분할 설정' : 'Thiết Lập 3 Nền'}</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenHeroMediaModal('single');
              }}
              className="px-3 py-2 rounded-xl bg-black/70 hover:bg-black/90 text-white text-xs font-bold font-sans flex items-center gap-1.5 border border-white/20 backdrop-blur-md transition-all duration-300"
              id={`hero-bg-single-manage-btn-${sectionId}`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>{currentLang === 'ko' ? '단일 리스트 관리' : 'Quản Lý Nền Đơn'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Center Overlay Section for Photo/Video Selection & Controls (Shown only when in Admin Mode in Dev) */}
      {showAdminUI && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 my-auto py-2">
          <div className="max-w-3xl space-y-4 sm:space-y-5 text-left p-6 sm:p-8 rounded-3xl bg-black/50 backdrop-blur-md border border-white/20 shadow-2xl">
            {/* Active Background Type Switcher Pills (Photo vs Video) */}
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/10 pb-3">
              <div className="inline-flex items-center gap-2 p-1.5 rounded-2xl bg-black/70 backdrop-blur-md border border-white/20">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTabChange('photo');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-sans transition-all duration-300 flex items-center gap-2 ${
                    mediaTab === 'photo'
                      ? 'bg-gradient-to-r from-[#0066FF] to-[#00D1FF] text-white shadow-lg'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>{currentLang === 'ko' ? '📷 배경 사진 선택' : '📷 Chọn Ảnh Nền'}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20 font-mono">
                    {heroMediaList.filter((m) => m.type === 'photo').length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTabChange('video');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-sans transition-all duration-300 flex items-center gap-2 ${
                    mediaTab === 'video'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Video className="w-4 h-4" />
                  <span>{currentLang === 'ko' ? '🎥 배경 동영상 선택' : '🎥 Chọn Video Nền'}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20 font-mono">
                    {heroMediaList.filter((m) => m.type === 'video').length}
                  </span>
                </button>
              </div>

              <span className="text-[10px] text-[#00D1FF] font-mono bg-black/60 px-3 py-1 rounded-full border border-[#00D1FF]/30 font-bold uppercase tracking-wider">
                {mediaTab === 'photo' ? '📷 Photo Mode Active' : '🎥 Video Mode Active'}
              </span>
            </div>

            {/* Quick Background Selector Pills if items exist */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span>{currentLang === 'ko' ? '등록된 배경 선택:' : 'Chọn nền hiện có:'}</span>
                  <span className="text-[10px] text-[#00D1FF] font-bold">
                    ({mediaTab === 'photo' ? '사진' : '동영상'})
                  </span>
                </span>
                <span className="text-[10px] text-slate-400">
                  {filteredList.length}개의 {mediaTab === 'photo' ? '사진' : '동영상'} 항목
                </span>
              </div>

              {filteredList.length > 0 ? (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar flex-wrap">
                  {filteredList.map((item, idx) => {
                    const isSel = item.id === (activeItem?.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectActiveMedia(item.id);
                        }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-sans font-bold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                          isSel
                            ? 'bg-white text-slate-900 border-white shadow-lg scale-105'
                            : 'bg-black/60 border-white/20 text-slate-200 hover:bg-white/20'
                        }`}
                      >
                        <span>{item.type === 'photo' ? '📷' : '🎥'}</span>
                        <span>#{idx + 1} {currentLang === 'ko' ? item.titleKO : item.titleVI}</span>
                        {isSel && <span className="w-2 h-2 rounded-full bg-[#0066FF] animate-ping" />}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-black/40 border border-white/10">
                  <p className="text-xs text-slate-300">
                    {currentLang === 'ko'
                      ? `등록된 ${mediaTab === 'photo' ? '사진' : '동영상'}이 없습니다.`
                      : `Chưa có ${mediaTab === 'photo' ? 'ảnh' : 'video'}.`}
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenHeroMediaModal('single');
                    }}
                    className="px-3 py-1 rounded-xl bg-[#0066FF] text-white text-xs font-bold hover:bg-blue-600 transition-all flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{currentLang === 'ko' ? '+ 새로 추가하기' : '+ Thêm mới'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Title and Tagline */}
            <div className="space-y-2 pt-1">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-[11px] text-[#00D1FF] font-mono"
              >
                <Sparkles className="w-3.5 h-3.5 animate-spin text-[#00D1FF]" />
                <span>
                  {sectionId === 'SECONDARY_HERO'
                    ? 'SUB HERO SECTION BACKGROUND'
                    : 'TOP MAIN HERO SECTION BACKGROUND'}
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight font-sans drop-shadow-md"
              >
                {displayTitle}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-sm sm:text-base font-bold text-[#00D1FF] font-sans tracking-wide drop-shadow"
              >
                {sectionId === 'SECONDARY_HERO'
                  ? (currentLang === 'ko'
                      ? '하단 서브 배경화면에 원하는 사진 or 동영상을 자유롭게 선택할 수 있습니다.'
                      : 'Tự do chọn ảnh hoặc video làm hình nền phụ phía dưới.')
                  : (currentLang === 'ko'
                      ? '상단 메인 배경화면에 원하는 사진 or 동영상을 자유롭게 선택할 수 있습니다.'
                      : 'Tự do chọn ảnh 또는 video làm hình nền chính phía trên.')}
              </motion.p>
            </div>

            {/* Interactive Actions */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenHeroMediaModal('single');
                }}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#00D1FF] hover:opacity-95 text-white font-bold text-xs sm:text-sm tracking-wide shadow-xl shadow-[#0066FF]/30 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2"
                id={`hero-bg-add-action-btn-${sectionId}`}
              >
                <Plus className="w-4 h-4" />
                <span>{currentLang === 'ko' ? '사진·동영상 파일/URL 등록' : 'Thêm Media Nền'}</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenHeroMediaModal('split');
                }}
                className="px-4 py-3 rounded-xl bg-purple-600/80 hover:bg-purple-600 border border-purple-400/50 text-white font-bold text-xs sm:text-sm transition-all duration-300 backdrop-blur-md flex items-center gap-2"
              >
                <LayoutGrid className="w-4 h-4" />
                <span>{currentLang === 'ko' ? '배경 3분할 설정' : 'Thiết Lập Chia 3'}</span>
              </button>

              <button
                onClick={onScrollToProducts}
                className="px-4 py-3 rounded-xl bg-black/40 hover:bg-white/20 border border-white/30 text-white font-medium text-xs sm:text-sm transition-all duration-300 backdrop-blur-md"
                id={`hero-explore-btn-${sectionId}`}
              >
                {t.allProducts}
              </button>
            </motion.div>
          </div>
        </div>
      )}

      {/* 📍 [추가] 화면 안의 작은 동영상/사진 카드 (PIP 섹션 / Mini Player - 배포/일반 방문자 환경에 항상 노출) */}
      <div 
        className="absolute left-4 sm:left-8 lg:left-12 bottom-12 z-20 w-[280px] sm:w-80 lg:w-88 rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black/40 backdrop-blur-md p-3 transition-all duration-300 hover:scale-[1.02] hover:border-white/40 hover:bg-black/50 group"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 미니 플레이어 뷰포트 (동영상 또는 이미지) */}
        <div className="relative aspect-video rounded-xl overflow-hidden bg-black/60 border border-white/10 group/player">
          {subMediaType === 'video' ? (
            <video
              ref={subVideoRef}
              src={cleanAndConvertVideoUrl(subMediaUrl) || undefined}
              autoPlay
              loop
              muted={isSubVideoMuted}
              playsInline
              controlsList="nodownload"
              preload="auto"
              crossOrigin="anonymous"
              onCanPlay={(e) => {
                if (isSubVideoPlaying) {
                  (e.currentTarget as HTMLVideoElement).play().catch(() => {});
                }
              }}
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={cleanAndConvertImageUrl(subMediaUrl) || DEFAULT_FALLBACK_IMAGE}
              alt="Sub Media Preview"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          )}

          {/* 오버레이 라벨 뱃지 */}
          <span className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-600/80 backdrop-blur-md border border-white/20 text-[10px] text-white rounded-full font-bold font-mono shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            {subMediaType === 'video' ? 'CINEMATIC PREVIEW' : 'PHOTO PREVIEW'}
          </span>

          {/* 서브 미디어 관리자 열기 버튼 (우측 상단 연필/플러스 아이콘 - 관리자 모드에만 노출) */}
          {onOpenSubMediaModal && showAdminUI && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenSubMediaModal();
              }}
              className="absolute top-2.5 right-2.5 px-2 py-1 rounded-lg bg-black/70 hover:bg-[#0066FF] backdrop-blur-md border border-white/30 text-white text-[10px] font-bold font-mono transition-all cursor-pointer shadow-md flex items-center gap-1 opacity-90 group-hover/player:opacity-100"
              title={currentLang === 'ko' ? '서브 미디어 사진/동영상 추가·삭제' : 'Thêm/Xóa Media Phụ'}
            >
              <Plus className="w-3 h-3" />
              <span>{currentLang === 'ko' ? '추가/삭제' : 'Thêm/Xóa'}</span>
            </button>
          )}

          {/* 동영상 전용 미니 컨트롤 버튼 (재생/일시정지 & 음소거 토글) */}
          {subMediaType === 'video' && (
            <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 opacity-90 group-hover/player:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSubVideoPlay();
                }}
                className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white transition-all cursor-pointer shadow-sm"
                title={isSubVideoPlaying ? '일시정지' : '재생'}
              >
                {isSubVideoPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSubVideoMute();
                }}
                className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white transition-all cursor-pointer shadow-sm"
                title={isSubVideoMuted ? '음소거 해제' : '음소거'}
              >
                {isSubVideoMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
              </button>
            </div>
          )}
        </div>

        {/* 하단 카드 제목 및 서브 미디어 선택 탭 */}
        <div className="mt-2.5 space-y-2 px-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-2 h-2 rounded-full bg-[#00D1FF] shrink-0 shadow-sm shadow-[#00D1FF]" />
              <span className="text-xs font-bold text-white font-sans tracking-wide truncate">
                {activeSubItem
                  ? (currentLang === 'ko' ? activeSubItem.titleKO : activeSubItem.titleVI)
                  : (currentLang === 'ko' ? '서브 메인 비주얼' : 'Visual phụ')}
              </span>
            </div>
            {onOpenSubMediaModal && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenSubMediaModal();
                }}
                className="p-1 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
                title={currentLang === 'ko' ? '서브 사진/동영상 관리' : 'Quản lý media phụ'}
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* 여러 서브 미디어가 등록되어 있을 경우 퀵 선택 필 스위처 */}
          {subMediaList.length > 1 && (
            <div className="flex items-center gap-1.5 pt-1 overflow-x-auto no-scrollbar">
              {subMediaList.map((item, idx) => {
                const isSelected = item.id === (activeSubItem?.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectActiveSubMedia?.(item.id);
                    }}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                      isSelected
                        ? 'bg-[#0066FF] text-white border border-blue-400 shadow-sm'
                        : 'bg-white/10 hover:bg-white/20 text-slate-300 border border-white/10'
                    }`}
                  >
                    {item.type === 'video' ? <Video className="w-2.5 h-2.5" /> : <ImageIcon className="w-2.5 h-2.5" />}
                    <span>{idx + 1}. {item.type.toUpperCase()}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Down Chevron Scrolling Assistant */}
      <div className="relative z-10 flex flex-col items-center justify-center pt-4 cursor-pointer group" onClick={onScrollToProducts}>
        <span className="text-[9px] font-mono tracking-widest text-slate-300 group-hover:text-[#00D1FF] transition-colors uppercase drop-shadow-sm">
          {currentLang === 'ko' ? '중단 영역 컬렉션 탐색' : 'Khám phá bộ sưu tập trung tâm'}
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="mt-1"
        >
          <ChevronDown className="w-4 h-4 text-slate-300 group-hover:text-[#00D1FF] transition-colors" />
        </motion.div>
      </div>
    </section>
  );
}
