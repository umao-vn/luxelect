import { useState } from 'react';
import { motion } from 'motion/react';
import { Play, Sparkles, ChevronDown, Award, Zap, ShieldCheck } from 'lucide-react';
import { Product } from '../types';
import { DEFAULT_FALLBACK_IMAGE } from '../utils';
import { TranslationSet } from '../translations';

interface HeroSectionProps {
  featuredProduct: Product;
  t: TranslationSet;
  currentLang: 'ko' | 'vi';
  onViewProduct: (productId: string) => void;
  onScrollToProducts: () => void;
  onBannerClick?: () => void;
}

export default function HeroSection({
  featuredProduct,
  t,
  currentLang,
  onViewProduct,
  onScrollToProducts,
  onBannerClick,
}: HeroSectionProps) {
  const [mediaTab, setMediaTab] = useState<'photo' | 'video'>('photo');

  const name = currentLang === 'ko' ? featuredProduct.nameKO : featuredProduct.nameVI;
  const tag = currentLang === 'ko' ? featuredProduct.tagKO : featuredProduct.tagVI;
  const desc = currentLang === 'ko' ? featuredProduct.descriptionKO : featuredProduct.descriptionVI;

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
      className="relative w-full bg-white flex flex-col justify-between overflow-hidden pt-8 md:pt-14 pb-8 border-b border-slate-200/80 cursor-pointer"
      title={currentLang === 'ko' ? '메인 화면으로 이동' : 'Về trang chủ'}
    >
      {/* Dynamic Ambient Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#0066FF]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[300px] h-[300px] bg-slate-200/20 rounded-full blur-[100px] pointer-events-none" />

      {/* 3-Section Segment Indicator Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 mb-6 text-left">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#0066FF]/5 border border-[#0066FF]/20 text-[10px] font-mono font-black tracking-widest text-[#0066FF] uppercase">
          [ 01. TOP SECTION / CINEMATIC BILLBOARD ]
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center z-10 my-auto">
        {/* Left Column: Text Content */}
        <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-left">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0066FF]/5 border border-[#0066FF]/25 text-xs text-[#0066FF] font-mono"
          >
            <Sparkles className="w-3.5 h-3.5 animate-spin text-[#0066FF]" />
            <span>{t.newArrival.toUpperCase()}</span>
          </motion.div>

          <div className="space-y-3">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight font-sans"
            >
              {name}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-lg font-bold text-[#0066FF] font-sans tracking-wide"
            >
              {tag}
            </motion.p>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-slate-650 text-xs sm:text-sm leading-relaxed max-w-xl font-sans"
          >
            {desc}
          </motion.p>

          {/* Quick Specifications Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-3 gap-3 border-t border-b border-slate-200 py-5 max-w-xl"
          >
            <div className="space-y-1">
              <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono block">Premium Build</span>
              <span className="text-xs sm:text-sm font-semibold text-slate-800 font-sans flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-[#0066FF]" /> Titan Gr. 5
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono block">Optics System</span>
              <span className="text-xs sm:text-sm font-semibold text-slate-800 font-sans flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-[#0066FF]" /> 200MP
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono block">Protection</span>
              <span className="text-xs sm:text-sm font-semibold text-slate-800 font-sans flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0066FF]" /> IP68 Water
              </span>
            </div>
          </motion.div>

          {/* Interactive Actions */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap items-center gap-4"
          >
            <button
              onClick={() => onViewProduct(featuredProduct.id)}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#00D1FF] hover:opacity-90 text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-[#0066FF]/20 transition-all duration-300 transform hover:-translate-y-0.5"
              id="hero-detail-btn"
            >
              {t.buyNow}
            </button>
            <button
              onClick={onScrollToProducts}
              className="px-6 py-3.5 rounded-xl border border-slate-200 hover:border-[#0066FF] text-slate-700 hover:text-[#0066FF] font-medium text-xs sm:text-sm transition-all duration-300 hover:bg-[#0066FF]/5"
              id="hero-explore-btn"
            >
              {t.allProducts}
            </button>
          </motion.div>
        </div>

        {/* Right Column: Immersive Device Rendering with Photo/Video Selector */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full max-w-[420px] rounded-3xl bg-slate-50 border border-slate-200 p-5 flex flex-col justify-between overflow-hidden shadow-xl group hover:border-[#0066FF]/40 transition-all duration-500"
          >
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            {/* Custom Interactive Media Switcher Tabs */}
            <div className="flex bg-white border border-slate-200 rounded-xl p-1 mb-4 w-full shadow-sm">
              <button
                type="button"
                onClick={() => setMediaTab('photo')}
                className={`flex-1 py-1.5 rounded-lg text-[10px] sm:text-[11px] font-bold font-sans transition-all duration-300 flex items-center justify-center gap-1.5 ${
                  mediaTab === 'photo'
                    ? 'bg-[#0066FF] text-white shadow'
                    : 'text-slate-500 hover:text-[#0066FF] hover:bg-slate-50'
                }`}
                id="hero-media-photo-tab"
              >
                <span>📷</span>
                <span>{currentLang === 'ko' ? '제품 사진 (ImgBB)' : 'Ảnh sản phẩm (ImgBB)'}</span>
              </button>
              <button
                type="button"
                onClick={() => setMediaTab('video')}
                className={`flex-1 py-1.5 rounded-lg text-[10px] sm:text-[11px] font-bold font-sans transition-all duration-300 flex items-center justify-center gap-1.5 ${
                  mediaTab === 'video'
                    ? 'bg-[#0066FF] text-white shadow'
                    : 'text-slate-500 hover:text-[#0066FF] hover:bg-slate-50'
                }`}
                id="hero-media-video-tab"
              >
                <span>🎥</span>
                <span>{currentLang === 'ko' ? '제품 동영상 (MP4)' : 'Video tính năng (MP4)'}</span>
              </button>
            </div>

            {/* Media/Illustration frame - Top portion */}
            <div className="relative w-full aspect-video rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden mb-4 flex items-center justify-center">
              {mediaTab === 'photo' ? (
                <>
                  <img
                    src={featuredProduct.imageUrl}
                    alt={name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
                    }}
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Premium overlay with subtle shadow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-80" />

                  {/* Central Premium Play Button to jump into full detail view */}
                  <div
                    onClick={() => onViewProduct(featuredProduct.id)}
                    className="absolute w-12 h-12 rounded-full bg-[#0066FF]/95 text-white flex items-center justify-center shadow-lg shadow-[#0066FF]/30 cursor-pointer hover:bg-blue-500 hover:scale-110 active:scale-95 transition-all duration-300 z-10"
                    title="Watch Feature Video"
                  >
                    <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                  </div>
                </>
              ) : (
                <div className="w-full h-full relative">
                  {featuredProduct.videoUrl ? (
                    <video
                      src={featuredProduct.videoUrl}
                      controls
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-slate-500 font-mono">
                      No MP4 URL Defined
                    </div>
                  )}
                </div>
              )}

              {/* Dynamic Overlay Spec labels */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[10px] font-mono text-white pointer-events-none drop-shadow-sm">
                <span>Active 120Hz AMOLED</span>
                <span className="text-[#00D1FF] font-semibold">LUX.X3 Edition</span>
              </div>
            </div>

            {/* Product Meta details */}
            <div className="flex justify-between items-end">
              <div className="text-left">
                <span className="text-[10px] uppercase tracking-widest text-[#0066FF] font-bold font-mono block mb-1">FLAGSHIP HERO</span>
                <span className="text-base font-bold text-slate-800 font-sans block">{name.split(' (')[0]}</span>
                <span className="text-[10px] text-slate-500 block font-mono">
                  {currentLang === 'ko' ? '초정밀 미디어 지원' : 'Hỗ trợ video siêu chuẩn'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block line-through font-mono">
                  {(featuredProduct.price * 1.15).toLocaleString()} KRW
                </span>
                <span className="text-base font-black text-[#0066FF] font-mono">
                  {featuredProduct.price.toLocaleString()} KRW
                </span>
              </div>
            </div>

            {/* User instruction guide badge */}
            <div className="mt-4 pt-3 border-t border-slate-200 text-[10px] text-slate-600 font-sans text-left leading-relaxed">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-850 text-[8px] font-bold font-mono uppercase">CONFIG PATH</span>
                <span className="text-slate-800 font-bold font-mono">/src/data.ts</span>
              </div>
              <div>
                💡 <span className="text-[#0066FF] font-bold">{currentLang === 'ko' ? '사진 & 동영상 수정법:' : 'Cách sửa ảnh & video:'}</span>{' '}
                {currentLang === 'ko'
                  ? 'data.ts 파일의 PRODUCTS[0] 항목 내 imageUrl(ImgBB 이미지 주소) 및 videoUrl(직접링크 mp4 주소)을 원하는 링크로 변경 시 화면에 실시간 노출됩니다.'
                  : 'Hãy mở data.ts, tìm PRODUCTS[0] và thay thế các trường imageUrl (Link ImgBB) và videoUrl (Link MP4 trực tiếp) để hiển thị sản phẩm của riêng bạn.'}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Down Chevron Scrolling Assistant */}
      <div className="flex flex-col items-center justify-center pt-5 cursor-pointer group" onClick={onScrollToProducts}>
        <span className="text-[9px] font-mono tracking-widest text-slate-400 group-hover:text-[#0066FF] transition-colors uppercase">
          {currentLang === 'ko' ? '중단 영역 컬렉션 탐색' : 'Khám phá bộ sưu tập trung tâm'}
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="mt-1"
        >
          <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-[#0066FF] transition-colors" />
        </motion.div>
      </div>
    </section>
  );
}

