import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Shield, Award, CheckCircle2, MessageSquare, Star, ShoppingCart, CreditCard, Edit } from 'lucide-react';
import { Product, UserSession } from '../types';
import { DEFAULT_FALLBACK_IMAGE } from '../utils';
import { TranslationSet } from '../translations';

interface ProductDetailViewProps {
  product: Product;
  t: TranslationSet;
  currentLang: 'ko' | 'vi';
  userSession: UserSession;
  onBackToList: () => void;
  onAddToCart: (product: Product, color: { nameKO: string; nameVI: string; hex: string }) => void;
  onBuyNow: (product: Product, color: { nameKO: string; nameVI: string; hex: string }) => void;
  isAdminMode?: boolean;
  onEditProduct?: (product: Product) => void;
}

interface Review {
  author: string;
  rating: number;
  date: string;
  contentKO: string;
  contentVI: string;
}

export default function ProductDetailView({
  product,
  t,
  currentLang,
  userSession,
  onBackToList,
  onAddToCart,
  onBuyNow,
  isAdminMode = false,
  onEditProduct,
}: ProductDetailViewProps) {
  // Colors and details
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Video Ref
  const videoRef = useRef<HTMLVideoElement>(null);

  // Reviews list
  const [reviews, setReviews] = useState<Review[]>([
    {
      author: currentLang === 'ko' ? "김*호 (VIP 실버)" : "Nguyễn Anh Tú (VIP)",
      rating: 5,
      date: "2026-07-15",
      contentKO: "진짜 대단합니다. 마감 퀄리티가 우주급이네요. 소리는 노이즈 캔슬링 키는 순간 진짜 고요해집니다.",
      contentVI: "Sản phẩm thực sự tuyệt vời. Chất lượng hoàn thiện ở mức đỉnh cao. Bật chống ồn chủ động lên là không gian hoàn toàn tĩnh lặng."
    },
    {
      author: currentLang === 'ko' ? "이*은 (VIP 골드)" : "Trần Thị Lan (VIP Gold)",
      rating: 5,
      date: "2026-07-10",
      contentKO: "외부 비디오 링크(mp4)를 data.ts에서 아주 손쉽게 바꿀 수 있게 설계되어 있어서 나중에 동영상 마케팅하기에 완벽합니다.",
      contentVI: "Được thiết kế để thay thế liên kết video ngoài (mp4) trong data.ts cực kỳ dễ dàng, rất thuận tiện cho marketing sau này."
    }
  ]);

  // Review Form Input state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  // Handle Video Actions
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Reset video when product changes
  useEffect(() => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [product]);

  // Handle Custom Review Submission
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewText.trim()) return;

    const newReview: Review = {
      author: `${reviewName} (${userSession.isLoggedIn ? 'VIP 회원' : '비회원'})`,
      rating: reviewRating,
      date: new Date().toISOString().split('T')[0],
      contentKO: reviewText,
      contentVI: reviewText
    };

    setReviews([newReview, ...reviews]);
    setReviewName('');
    setReviewText('');
  };

  const name = currentLang === 'ko' ? product.nameKO : product.nameVI;
  const tag = currentLang === 'ko' ? product.tagKO : product.tagVI;
  const desc = currentLang === 'ko' ? product.descriptionKO : product.descriptionVI;
  const features = currentLang === 'ko' ? product.featuresKO : product.featuresVI;
  const specs = currentLang === 'ko' ? product.specsKO : product.specsVI;

  const finalPrice = userSession.isLoggedIn ? Math.round(product.price * 0.9) : product.price;
  const discountPercent = userSession.isLoggedIn ? 10 : 0;

  return (
    <div className="w-full bg-white text-slate-800 pb-24 border-t border-slate-200" id={`detail-view-${product.id}`}>
      {/* 1. Immersive Sub-Header */}
      <div className="bg-slate-50/95 border-b border-slate-200 sticky top-20 z-30 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={onBackToList}
            className="flex items-center gap-2 text-xs sm:text-sm text-slate-650 hover:text-[#0066FF] transition-colors font-semibold cursor-pointer"
            id="detail-back-btn"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.backToList}</span>
          </button>
          
          <div className="hidden md:flex items-center gap-4 text-xs font-mono text-slate-500">
            <span>{product.category.toUpperCase()} PRODUCT PAGE</span>
            <span className="text-[#0066FF] font-bold">100% EXPANDED MODE</span>
          </div>

          <div className="flex items-center gap-3">
            {isAdminMode && (
              <button
                onClick={() => onEditProduct?.(product)}
                className="px-3.5 py-1.5 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-650 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                id="detail-sub-admin-edit-btn"
                title={currentLang === 'ko' ? '사진/동영상 편집' : 'Chỉnh sửa ảnh/video'}
              >
                <Edit className="w-3.5 h-3.5 text-rose-600" />
                <span>{currentLang === 'ko' ? '미디어 수정' : 'Sửa Media'}</span>
              </button>
            )}
            <span className="text-sm font-black text-[#0066FF] font-mono">
              {finalPrice.toLocaleString()} KRW
            </span>
            <button
              onClick={() => onAddToCart(product, selectedColor)}
              className="px-4 py-1.5 bg-[#0066FF] hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              id="detail-sub-cart-btn"
            >
              {t.addToCart.split(' ')[0]}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {/* 2. Main Full-Stretch Presentation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Block (7 cols): Immersive Image Gallery & Customizable MP4 Player */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Massive Hero Image Frame */}
            <div className="relative aspect-[16/10] rounded-3xl bg-slate-100 border border-slate-200 overflow-hidden shadow-lg flex items-center justify-center">
              <img
                src={product.imageUrl}
                alt={name}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
                }}
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 via-transparent to-transparent opacity-80" />

              {/* Photo Mode Label Badge */}
              <div className="absolute top-6 left-6 flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs font-mono font-bold shadow-md">
                <span>📷</span>
                <span>{currentLang === 'ko' ? '제품 사진 (고화질)' : 'Ảnh sản phẩm (HD)'}</span>
              </div>

              {/* Float color badge */}
              <div className="absolute bottom-6 left-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 border border-slate-200 text-xs font-mono">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedColor.hex }} />
                <span className="text-slate-700 font-semibold">
                  {currentLang === 'ko' ? selectedColor.nameKO : selectedColor.nameVI}
                </span>
              </div>
            </div>

            {/* Premium Custom MP4 Video Player Frame (Rendered only when valid videoUrl is defined and distinct from image) */}
            {product.videoUrl && product.videoUrl !== product.imageUrl && !/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(product.videoUrl) && (
              <div className="rounded-3xl bg-slate-50 border border-slate-200 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm sm:text-base font-bold text-slate-800 font-sans flex items-center gap-2">
                    <Play className="w-4 h-4 text-[#0066FF]" />
                    <span>{currentLang === 'ko' ? '제품 특장점 동영상' : 'Video giới thiệu tính năng'}</span>
                  </h4>
                  <span className="text-[10px] font-mono text-slate-500">EXTERNAL MP4 SOURCE</span>
                </div>

                <div className="relative aspect-video rounded-2xl bg-black overflow-hidden border border-slate-200 group">
                  <video
                    ref={videoRef}
                    src={product.videoUrl}
                    className="w-full h-full object-cover"
                    loop
                    playsInline
                    onClick={handlePlayPause}
                  />

                  {/* Play Pause Ambient Overlay Indicator */}
                  {!isPlaying && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none transition-opacity duration-300">
                      <div className="w-16 h-16 rounded-full bg-[#0066FF]/95 text-white flex items-center justify-center shadow-lg shadow-[#0066FF]/20">
                        <Play className="w-8 h-8 fill-white text-white ml-1" />
                      </div>
                    </div>
                  )}

                  {/* Player custom controls panel overlay */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-slate-200 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handlePlayPause}
                        className="p-1.5 rounded bg-slate-100 hover:bg-slate-250 text-[#0066FF] transition-colors cursor-pointer"
                        id="video-play-btn"
                      >
                        {isPlaying ? <Pause className="w-4 h-4 fill-[#0066FF] text-[#0066FF]" /> : <Play className="w-4 h-4 fill-[#0066FF] text-[#0066FF]" />}
                      </button>
                      <span className="text-[11px] text-slate-700 font-mono">
                        {isPlaying ? 'STREAMING ACTIVE' : 'PAUSED'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleMuteToggle}
                        className="p-1.5 rounded bg-slate-100 hover:bg-slate-250 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                        id="video-mute-btn"
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Subtext info detailing replacement of URL / Admin Direct Modifier */}
                {isAdminMode ? (
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-left shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-rose-600 font-sans flex items-center gap-1.5">
                        <Edit className="w-4 h-4 text-rose-600" />
                        <span>{currentLang === 'ko' ? '관리자 미디어 편집기 활성화됨' : 'Trình chỉnh sửa phương tiện Admin đã bật'}</span>
                      </p>
                      <p className="text-[11px] text-slate-650 font-sans leading-relaxed">
                        {currentLang === 'ko'
                          ? '이 제품의 사진과 동영상을 드래그앤드롭 업로드 또는 링크 주소 지정을 통해 실시간 변경할 수 있습니다.'
                          : 'Thay đổi trực tiếp ảnh và video của sản phẩm này bằng cách kéo thả hoặc nhập liên kết ngoài.'}
                      </p>
                    </div>
                    <button
                      onClick={() => onEditProduct?.(product)}
                      className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0 shadow-md shadow-rose-600/10 flex items-center gap-1"
                      id="detail-direct-edit-btn"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>{currentLang === 'ko' ? '사진/동영상 변경' : 'Thay đổi ảnh/video'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-left shadow-sm">
                    <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-sans">
                      💡 <strong className="text-[#0066FF]">{currentLang === 'ko' ? '동영상 교체 안내:' : 'Thay thế video:'}</strong>{' '}
                      {currentLang === 'ko'
                        ? "사용자님이 직접 업로드하신 ImgBB 사진이나 외부 MP4 동영상 주소를 '/src/data.ts' 내의 해당 제품 항목에 붙여넣으시면 실시간으로 이 화면에 안전하게 렌더링 됩니다."
                        : "Dán liên kết ảnh ImgBB hoặc liên kết tệp video MP4 ngoài của bạn vào mục tương ứng trong `/src/data.ts` để hiển thị trực tiếp tại đây."}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Block (5 cols): Configurator, Specs & Buying Options */}
          <div className="lg:col-span-5 space-y-8 text-left">
            
            {/* Title Block */}
            <div className="space-y-3">
              <span className="px-3 py-1 bg-[#0066FF]/5 border border-[#0066FF]/20 rounded-full text-[10px] font-bold font-mono text-[#0066FF] uppercase">
                {product.category} COLLECTION
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 font-sans">
                {name}
              </h2>
              <p className="text-base sm:text-lg text-[#0066FF] font-bold font-sans">
                {tag}
              </p>
            </div>

            {/* Price Box */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-sans">{currentLang === 'ko' ? '권장 소비자 가격' : 'Giá bán niêm yết'}</span>
                <span className="text-sm text-slate-400 line-through font-mono">
                  {product.price.toLocaleString()} KRW
                </span>
              </div>

              <div className="flex items-end justify-between border-t border-slate-200 pt-3">
                <span className="text-xs text-slate-500 font-sans">
                  {userSession.isLoggedIn 
                    ? t.memberDiscount 
                    : currentLang === 'ko' ? '일반 판매가' : 'Giá bán thường'}
                </span>
                <div className="text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                      {finalPrice.toLocaleString()} KRW
                    </span>
                    {discountPercent > 0 && (
                      <span className="px-2 py-0.5 bg-[#0066FF] text-white text-[10px] font-extrabold rounded font-mono">
                        -{discountPercent}% VIP
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1 font-sans">
                    {userSession.isLoggedIn 
                      ? (currentLang === 'ko' ? 'VIP 상시 특별 혜택가 적용됨' : 'Đã áp dụng giá VIP đặc biệt')
                      : (currentLang === 'ko' ? 'VIP 가입 시 10% 멤버십 즉시 차감' : 'Đăng ký VIP giảm ngay 10%')}
                  </span>
                </div>
              </div>
            </div>

            {/* Color Configurator Swatches */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-widest text-slate-500 font-mono font-bold">
                {t.colors}
              </h4>
              <div className="flex items-center gap-3">
                {product.colors.map((col, idx) => {
                  const isSelected = selectedColor.hex === col.hex;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(col)}
                      className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold font-sans transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? 'border-[#0066FF] bg-[#0066FF]/5 text-[#0066FF] shadow-md shadow-[#0066FF]/5'
                          : 'border-slate-200 bg-white text-slate-600 hover:text-[#0066FF] hover:border-[#0066FF]'
                      }`}
                      id={`color-swatch-${idx}`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-200 shadow-sm" style={{ backgroundColor: col.hex }} />
                      <span>{currentLang === 'ko' ? col.nameKO : col.nameVI}</span>
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#0066FF] rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Core Tech Highlights */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-widest text-slate-500 font-mono font-bold">
                {t.features}
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-750 font-sans">
                {features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0066FF] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions Trigger buying wizard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4">
              <button
                onClick={() => onAddToCart(product, selectedColor)}
                className="flex items-center justify-center gap-2.5 py-4 rounded-xl border border-slate-250 text-slate-750 hover:text-[#0066FF] hover:border-[#0066FF] hover:bg-[#0066FF]/5 text-sm font-bold transition-all duration-300 cursor-pointer"
                id="detail-action-cart"
              >
                <ShoppingCart className="w-5 h-5 text-[#0066FF]" />
                <span>{t.addToCart}</span>
              </button>
              <button
                onClick={() => onBuyNow(product, selectedColor)}
                className="flex items-center justify-center gap-2.5 py-4 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#00D1FF] hover:opacity-90 text-white text-sm font-extrabold transition-all duration-300 shadow-xl shadow-[#0066FF]/20 cursor-pointer"
                id="detail-action-buy"
              >
                <CreditCard className="w-5 h-5" />
                <span>{t.buyNow}</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 border-t border-slate-200 pt-6">
              <div className="flex items-center gap-2.5 text-xs text-slate-650 font-sans">
                <Shield className="w-4 h-4 text-[#0066FF]" />
                <span>
                  {currentLang === 'ko' ? '5년 무상 품질보증' : 'Bảo hành VIP 5 năm'}
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-650 font-sans">
                <Award className="w-4 h-4 text-[#0066FF]" />
                <span>
                  {currentLang === 'ko' ? 'VIP 안전 설치 특송' : 'Lắp đặt VIP hoàn hảo'}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* 3. Detailed Specifications Accordion Block */}
        <div className="mt-20 text-left border-t border-slate-200 pt-16">
          <div className="max-w-4xl mx-auto space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-sans border-b border-slate-200 pb-4">
              {t.specs}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(specs).map(([key, value]) => (
                <div
                  key={key}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between shadow-sm"
                >
                  <span className="text-[10px] font-mono text-[#0066FF] uppercase tracking-wider block mb-1 font-bold">
                    {key}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-700 font-sans font-semibold">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Live Custom Reviews Module */}
        <div className="mt-20 text-left border-t border-slate-200 pt-16">
          <div className="max-w-4xl mx-auto space-y-10">
            
            {/* Heading and reviews overview */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-sans flex items-center gap-2">
                  <MessageSquare className="w-5.5 h-5.5 text-[#0066FF]" />
                  <span>{t.reviews}</span>
                </h3>
                <p className="text-xs text-slate-500 font-sans mt-1">
                  {currentLang === 'ko' ? '고객님들이 직접 작성한 실제 제품 후기입니다.' : 'Đánh giá chân thực từ những khách hàng sở hữu.'}
                </p>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 text-slate-700">
                <Star className="w-4 h-4 text-[#0066FF] fill-[#0066FF]" />
                <span className="text-sm font-bold text-slate-800 font-mono">{product.rating.toFixed(1)} / 5.0</span>
                <span className="text-xs text-slate-400 font-mono">({product.reviewsCount} {currentLang === 'ko' ? '건' : 'đánh giá'})</span>
              </div>
            </div>

            {/* List of Reviews */}
            <div className="space-y-6">
              {reviews.map((rev, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-slate-800 font-sans">
                      {rev.author}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{rev.date}</span>
                  </div>

                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-650 leading-relaxed font-sans">
                    {currentLang === 'ko' ? rev.contentKO : rev.contentVI}
                  </p>
                </div>
              ))}
            </div>

            {/* Write a New Review Form */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-6 shadow-sm">
              <div className="space-y-1">
                <h4 className="text-base sm:text-lg font-bold text-slate-900 font-sans">
                  {currentLang === 'ko' ? '제품 이용 후기 작성하기' : 'Viết đánh giá của bạn'}
                </h4>
                <p className="text-xs text-slate-500 font-sans">
                  {currentLang === 'ko'
                    ? '가전 마스터 클래스에 대한 소중한 피드백을 기록해주세요.'
                    : 'Hãy chia sẻ trải nghiệm thực tế của bạn với các thiết bị cao cấp.'}
                </p>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-mono text-slate-500 uppercase font-bold">
                      {currentLang === 'ko' ? '작성자 이름 / 닉네임' : 'Họ tên người viết'}
                    </label>
                    <input
                      type="text"
                      required
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder={currentLang === 'ko' ? "홍길동" : "Họ và tên"}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-[#0066FF] font-sans"
                      id="review-name-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-mono text-slate-500 uppercase font-bold">
                      {currentLang === 'ko' ? '평점 부여' : 'Cho điểm đánh giá'}
                    </label>
                    <div className="relative">
                      <select
                        value={reviewRating}
                        onChange={(e) => setReviewRating(Number(e.target.value))}
                        className="w-full appearance-none px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-[#0066FF] font-sans cursor-pointer"
                        id="review-rating-select"
                      >
                        <option value={5}>⭐⭐⭐⭐⭐ {currentLang === 'ko' ? '5점 만점 (최고)' : '5 điểm (Xuất sắc)'}</option>
                        <option value={4}>⭐⭐⭐⭐ {currentLang === 'ko' ? '4점 (우수)' : '4 điểm (Tốt)'}</option>
                        <option value={3}>⭐⭐⭐ {currentLang === 'ko' ? '3점 (보통)' : '3 điểm (Bình thường)'}</option>
                        <option value={2}>⭐⭐ {currentLang === 'ko' ? '2점 (미흡)' : '2 điểm (Kém)'}</option>
                        <option value={1}>⭐ {currentLang === 'ko' ? '1점 (불만족)' : '1 điểm (Rất kém)'}</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-mono text-slate-500 uppercase font-bold">
                    {currentLang === 'ko' ? '상세 리뷰 의견' : 'Ý kiến đánh giá chi tiết'}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder={
                      currentLang === 'ko'
                        ? "가전 제품 성능, 화질, 음향 및 외부 ImgBB 연동 상태 등에 대해 자유롭게 기록해주세요..."
                        : "Nhập đánh giá thực tế của bạn về màn hình, âm thanh, thiết kế, v.v..."
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-[#0066FF] font-sans resize-none"
                    id="review-content-textarea"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#0066FF] hover:bg-blue-500 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors shadow-lg cursor-pointer"
                  id="submit-review-btn"
                >
                  {currentLang === 'ko' ? '리뷰 제출 완료' : 'Gửi nhận xét'}
                </button>
              </form>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
