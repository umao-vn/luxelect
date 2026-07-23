import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ChevronDown, Award, Zap, ShieldCheck, Settings, Plus, Image as ImageIcon, Video } from 'lucide-react';
import { HeroMediaItem } from '../types';
import { DEFAULT_FALLBACK_IMAGE } from '../utils';
import { TranslationSet } from '../translations';

interface HeroSectionProps {
  heroMediaList: HeroMediaItem[];
  activeMediaId: string | null;
  onSelectActiveMedia: (id: string) => void;
  onOpenHeroMediaModal: () => void;
  t: TranslationSet;
  currentLang: 'ko' | 'vi';
  onScrollToProducts: () => void;
  onBannerClick?: () => void;
  isAdmin?: boolean;
  isDev?: boolean;
}

export default function HeroSection({
  heroMediaList,
  activeMediaId,
  onSelectActiveMedia,
  onOpenHeroMediaModal,
  t,
  currentLang,
  onScrollToProducts,
  onBannerClick,
  isAdmin = false,
  isDev = false,
}: HeroSectionProps) {
  // Determine whether to display developer & admin background management UI
  const isDevEnvironment = Boolean((import.meta as any).env?.DEV);
  const showAdminUI = Boolean(isAdmin || isDev || isDevEnvironment);

  // Find item matching activeMediaId directly
  const activeById = heroMediaList.find((m) => m.id === activeMediaId);

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
    }
  };

  // Filter hero media list by photo vs video tab
  const filteredList = heroMediaList.filter((m) => m.type === mediaTab);

  // Active item prioritization: explicit activeById first, then filteredList[0], then first in list
  const activeItem = activeById || filteredList[0] || heroMediaList[0];

  const displayTitle = activeItem
    ? (currentLang === 'ko' ? activeItem.titleKO : activeItem.titleVI)
    : (currentLang === 'ko' ? '상단 메인 브랜드 시네마틱 배경' : 'Nền phim thương hiệu chính');

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
      {/* Full-width Background Image / Video Container */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-slate-900">
        {activeItem ? (
          activeItem.type === 'photo' ? (
            <img
              key={activeItem.id || activeItem.url}
              src={activeItem.url}
              alt={activeItem.titleKO}
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
              }}
              className="w-full h-full object-cover opacity-100 transition-all duration-700"
            />
          ) : (
            <video
              key={activeItem.id || activeItem.url}
              src={activeItem.url}
              autoPlay
              loop
              muted
              playsInline
              onCanPlay={(e) => {
                (e.currentTarget as HTMLVideoElement).play().catch(() => {});
              }}
              className="w-full h-full object-cover opacity-100 transition-all duration-700"
            />
          )
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950" />
        )}

        {/* Subtle Vignette Overlay to maintain full image/video brightness */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40 pointer-events-none" />
      </div>

      {/* 3-Section Segment Indicator Header + Independent Background Admin Controls (Shown only for Admin/Dev) */}
      {showAdminUI && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 mb-6 flex flex-wrap items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-black/60 border border-white/20 backdrop-blur-md text-[10px] font-mono font-black tracking-widest text-[#00D1FF] uppercase shadow-sm">
              [ 01. TOP SECTION / FULL BACKGROUND ]
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/20 border border-emerald-400/40 backdrop-blur-md text-[10px] font-mono font-bold text-emerald-300">
              <span>✨</span>
              <span>{currentLang === 'ko' ? '커스텀 배경화면 (관리자 패널)' : 'Hình Nền Tùy Chỉnh (Admin)'}</span>
            </span>
          </div>

          {/* Dedicated Background Add / Manage Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenHeroMediaModal();
            }}
            className="px-4 py-2 rounded-xl bg-[#0066FF] hover:bg-blue-500 text-white text-xs font-bold font-sans flex items-center gap-2 shadow-lg shadow-[#0066FF]/30 transition-all duration-300 hover:scale-105"
            id="hero-bg-manage-btn"
          >
            <Settings className="w-4 h-4" />
            <span>{currentLang === 'ko' ? '배경 화면 URL 추가 / 삭제' : 'Quản lý URL Hình Nền'}</span>
            <span className="px-2 py-0.5 rounded bg-white/20 text-[10px] font-mono">
              {heroMediaList.length}개
            </span>
          </button>
        </div>
      )}

      {/* Main Center Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 my-auto py-4">
        <div className="max-w-3xl space-y-5 sm:space-y-6 text-left p-6 sm:p-8 rounded-3xl bg-black/40 backdrop-blur-md border border-white/20 shadow-2xl">
          {/* Active Background Type Switcher Pills (Shown only for Admin/Dev) */}
          {showAdminUI && (
            <>
              <div className="inline-flex items-center gap-2 p-1 rounded-2xl bg-black/60 backdrop-blur-md border border-white/15">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTabChange('photo');
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-sans transition-all duration-300 flex items-center gap-1.5 ${
                    mediaTab === 'photo'
                      ? 'bg-[#0066FF] text-white shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>{currentLang === 'ko' ? '배경 사진' : 'Ảnh Nền'}</span>
                  <span className="text-[10px] opacity-80 font-mono">
                    ({heroMediaList.filter((m) => m.type === 'photo').length})
                  </span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTabChange('video');
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-sans transition-all duration-300 flex items-center gap-1.5 ${
                    mediaTab === 'video'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>{currentLang === 'ko' ? '배경 동영상' : 'Video Nền'}</span>
                  <span className="text-[10px] opacity-80 font-mono">
                    ({heroMediaList.filter((m) => m.type === 'video').length})
                  </span>
                </button>
              </div>

              {/* Quick Background Selector Pills if multiple items exist */}
              {filteredList.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  <span className="text-[11px] font-mono text-slate-300 flex-shrink-0">
                    {currentLang === 'ko' ? '배경 선택:' : 'Chọn nền:'}
                  </span>
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
                        className={`px-3 py-1 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all border ${
                          isSel
                            ? 'bg-white text-slate-900 border-white shadow-md'
                            : 'bg-black/40 border-white/20 text-slate-200 hover:bg-white/20'
                        }`}
                      >
                        #{idx + 1} {currentLang === 'ko' ? item.titleKO : item.titleVI}
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* Title and Tagline */}
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs text-[#00D1FF] font-mono"
            >
              <Sparkles className="w-3.5 h-3.5 animate-spin text-[#00D1FF]" />
              <span>{showAdminUI ? 'LUX CUSTOM BACKGROUND HERO (DEV/ADMIN)' : 'LUXURY ELECTRONICS BRAND'}</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight font-sans drop-shadow-md"
            >
              {displayTitle}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-lg font-bold text-[#00D1FF] font-sans tracking-wide drop-shadow"
            >
              {showAdminUI
                ? (currentLang === 'ko'
                    ? '직접 업로드하거나 입력한 사진·동영상 파일이 상단 전체 배경화면으로 적용됩니다.'
                    : 'Ảnh/Video do bạn tải lên sẽ hiển thị làm hình nền toàn màn hình phần trên.')
                : (currentLang === 'ko'
                    ? '시네마틱 해상도 디스플레이와 함께 만나는 최상의 혁신'
                    : 'Trải nghiệm đỉnh cao công nghệ cùng màn hình hiển thị cao cấp')}
            </motion.p>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-slate-200 text-xs sm:text-sm leading-relaxed max-w-2xl font-sans drop-shadow-sm"
          >
            {showAdminUI
              ? (currentLang === 'ko'
                  ? '상단 배경화면은 하단 제품 목록과 완전히 별개로 관리됩니다. [배경 화면 URL 추가/삭제] 버튼을 눌러 이미지 링크(ImgBB 등)나 파일, MP4 동영상을 등록해보세요.'
                  : 'Hình nền phần trên được quản lý hoàn toàn độc lập. Nhấp vào nút quản lý để thêm/xóa URL hoặc tệp hình nền.')
              : (currentLang === 'ko'
                  ? '최신 칩셋과 정교한 인지음향 기술이 결합된 프리미엄 라인업을 상단 고화질 시네마틱 배경 화면과 함께 만나보세요.'
                  : 'Khám phá các dòng sản phẩm cao cấp được thiết kế tinh xảo cùng trải nghiệm hình ảnh tuyệt đẹp.')}
          </motion.p>

          {/* Quick Specifications Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-3 gap-3 border-t border-b border-white/15 py-4 max-w-xl backdrop-blur-sm bg-black/20 px-4 rounded-2xl"
          >
            {showAdminUI ? (
              <>
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-300 uppercase tracking-widest font-mono block">Custom Photo</span>
                  <span className="text-xs sm:text-sm font-semibold text-white font-sans flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-[#00D1FF]" /> ImgBB / JPG / PNG
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-300 uppercase tracking-widest font-mono block">Custom Video</span>
                  <span className="text-xs sm:text-sm font-semibold text-white font-sans flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-[#00D1FF]" /> MP4 / WEBM Direct
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-300 uppercase tracking-widest font-mono block">Management</span>
                  <span className="text-xs sm:text-sm font-semibold text-white font-sans flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#00D1FF]" /> URL 추가 / 삭제
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-300 uppercase tracking-widest font-mono block">Display</span>
                  <span className="text-xs sm:text-sm font-semibold text-white font-sans flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-[#00D1FF]" /> Liquid Retina 120Hz
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-300 uppercase tracking-widest font-mono block">Performance</span>
                  <span className="text-xs sm:text-sm font-semibold text-white font-sans flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-[#00D1FF]" /> M3 Ultra Chipset
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-300 uppercase tracking-widest font-mono block">Sound</span>
                  <span className="text-xs sm:text-sm font-semibold text-white font-sans flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#00D1FF]" /> Spatial Audio VIP
                  </span>
                </div>
              </>
            )}
          </motion.div>

          {/* Interactive Actions */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            {showAdminUI && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenHeroMediaModal();
                }}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#00D1FF] hover:opacity-95 text-white font-bold text-xs sm:text-sm tracking-wide shadow-xl shadow-[#0066FF]/30 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2"
                id="hero-bg-add-action-btn"
              >
                <Plus className="w-4 h-4" />
                <span>{currentLang === 'ko' ? '배경 화면 URL 추가 / 삭제' : 'Thêm / Xóa URL Hình Nền'}</span>
              </button>
            )}
            <button
              onClick={onScrollToProducts}
              className="px-6 py-3.5 rounded-xl bg-black/40 hover:bg-white/20 border border-white/30 text-white font-medium text-xs sm:text-sm transition-all duration-300 backdrop-blur-md"
              id="hero-explore-btn"
            >
              {t.allProducts}
            </button>
          </motion.div>
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
