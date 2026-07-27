import { motion } from 'motion/react';
import { Sparkles, Eye, ShoppingCart, SlidersHorizontal, ArrowUpDown, Plus, Edit, Trash2, FolderPlus, X, Lock, Unlock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, CategoryType, CategoryItem, UserSession } from '../types';
import { DEFAULT_FALLBACK_IMAGE, cleanAndConvertImageUrl } from '../utils';
import { TranslationSet } from '../translations';
import { useState, useRef } from 'react';

// Swiper.js slider imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperClass } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';

interface MiddleSectionProps {
  products: Product[];
  categoriesList: CategoryItem[];
  t: TranslationSet;
  currentLang: 'ko' | 'vi';
  onViewProduct: (productId: string) => void;
  onAddToCart: (product: Product, color: { nameKO: string; nameVI: string; hex: string }) => void;
  userSession: UserSession;
  isDetailActive: boolean; // Used to cleanly hide middle section when detailed page is active!
  isAdminMode?: boolean;
  onEditProduct?: (product: Product) => void;
  onAddProduct?: () => void;
  onDeleteProduct?: (productId: string) => void;
  onOpenAddCategoryModal: () => void;
  onDeleteCategory?: (categoryId: string) => void;
  onToggleCategoryAdminOnly?: (categoryId: string) => void;
  selectedCategory?: string;
  onSelectCategory?: (catId: string) => void;
}

export default function MiddleSection({
  products,
  categoriesList,
  t,
  currentLang,
  onViewProduct,
  onAddToCart,
  userSession,
  isDetailActive,
  isAdminMode = false,
  onEditProduct,
  onAddProduct,
  onDeleteProduct,
  onOpenAddCategoryModal,
  onDeleteCategory,
  onToggleCategoryAdminOnly,
  selectedCategory: propSelectedCategory,
  onSelectCategory: propOnSelectCategory,
}: MiddleSectionProps) {
  const [internalSelectedCategory, setInternalSelectedCategory] = useState<CategoryType | 'all'>('all');
  const selectedCategory = propSelectedCategory ?? internalSelectedCategory;

  const setSelectedCategory = (catId: string) => {
    if (propOnSelectCategory) {
      propOnSelectCategory(catId);
    } else {
      setInternalSelectedCategory(catId);
    }
  };

  const [sortBy, setSortBy] = useState<'default' | 'priceAsc' | 'priceDesc' | 'rating'>('default');

  // Swiper slider state & ref
  const swiperRef = useRef<SwiperClass | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const isDevEnv = (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') || Boolean((import.meta as any).env?.DEV);
  const showAdminUI = Boolean(isAdminMode && isDevEnv);

  // If the product detail view is active, cleanly hide this middle section as requested!
  if (isDetailActive) {
    return null;
  }

  // Filter products by category, ignoring admin-only category products for non-admin/external users
  const filteredProducts = products.filter((product) => {
    const catItem = categoriesList.find((c) => c.id === product.category);
    if (catItem?.isAdminOnly && !isAdminMode) {
      return false; // Hide from external customers on Netlify / non-admin
    }
    if (selectedCategory === 'all') return true;
    return product.category === selectedCategory;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'priceAsc') return a.price - b.price;
    if (sortBy === 'priceDesc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // default
  });

  const allCategoryTabs: { id: string; labelKO: string; labelVI: string; isCustom?: boolean; isAdminOnly?: boolean }[] = [
    { id: 'all', labelKO: '전체 상품', labelVI: 'Tất cả sản phẩm' },
    ...categoriesList.map((cat) => ({
      id: cat.id,
      labelKO: cat.labelKO,
      labelVI: cat.labelVI,
      isAdminOnly: cat.isAdminOnly,
      isCustom: !['phone', 'laptop', 'audio', 'display', 'smarthome'].includes(cat.id),
    })),
  ];

  // Filter out admin-only categories for external users/customers on Netlify
  const visibleCategoryTabs = allCategoryTabs.filter((cat) => !cat.isAdminOnly || isAdminMode);

  return (
    <section id="middle-products-section" className="w-full bg-[#f7f7f7] py-16 sm:py-24 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Xiaomi Homepage Style Section Header (Centered Title + Top-Right Nav Controls) */}
        <div className="relative flex items-center justify-between gap-4 mb-8 sm:mb-12">
          <div className="hidden sm:block flex-1">
            {showAdminUI && (
              <div className="inline-block text-[10px] font-mono font-black tracking-widest text-[#0066FF] mb-2 uppercase px-3 py-1 bg-[#0066FF]/5 border border-[#0066FF]/20 rounded-md">
                [ 02. MIDDLE SECTION / PRODUCT COLLECTIONS ]
              </div>
            )}
          </div>

          {/* Centered Explore Product Title (28px ~ 32px, Bold 700) */}
          <div className="text-center mx-auto">
            <h3 className="text-[28px] sm:text-[32px] font-bold text-slate-900 tracking-tight font-sans">
              Explore Product
            </h3>
          </div>

          {/* Xiaomi Style Top-Right Swiper Navigation Arrow Buttons */}
          <div className="flex-1 flex items-center justify-end gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => swiperRef.current?.slidePrev()}
              disabled={isBeginning}
              aria-label="Previous slide"
              className="w-10 h-10 rounded-full bg-slate-200/70 hover:bg-[#0066FF] text-slate-700 hover:text-white disabled:opacity-30 disabled:hover:bg-slate-200/70 disabled:hover:text-slate-700 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm border border-slate-300/60"
              id="swiper-prev-btn"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => swiperRef.current?.slideNext()}
              disabled={isEnd}
              aria-label="Next slide"
              className="w-10 h-10 rounded-full bg-slate-200/70 hover:bg-[#0066FF] text-slate-700 hover:text-white disabled:opacity-30 disabled:hover:bg-slate-200/70 disabled:hover:text-slate-700 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm border border-slate-300/60"
              id="swiper-next-btn"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>



        {/* Category Pills Navigation & Admin Controls Bar (Admin Mode Only) */}
        {isAdminMode && (
          <div className="flex flex-wrap items-center gap-2 mb-10 pb-2 overflow-x-auto no-scrollbar">
            {visibleCategoryTabs.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <div
                  key={cat.id}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-md shadow-[#0066FF]/20'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-[#0066FF] hover:bg-blue-50/50'
                  }`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <span>{currentLang === 'ko' ? cat.labelKO : cat.labelVI}</span>

                  {/* Admin Mode Quick Controls (Lock/Unlock & Delete) */}
                  {showAdminUI && cat.id !== 'all' && (
                    <div className="flex items-center gap-1 ml-0.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => onToggleCategoryAdminOnly?.(cat.id)}
                        title={
                          cat.isAdminOnly
                            ? (currentLang === 'ko' ? '관리자 전용 (외부/Netlify 비공개). 클릭하여 전체 공개' : 'Chỉ dành cho Admin. Click để công khai')
                            : (currentLang === 'ko' ? '전체 공개 중. 클릭하여 관리자 전용(외부 비공개)으로 설정' : 'Đang công khai. Click để ẩn với khách')
                        }
                        className={`p-1 rounded-md text-[10px] transition-colors ${
                          cat.isAdminOnly
                            ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-sm'
                            : 'bg-slate-100 text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                        }`}
                      >
                        {cat.isAdminOnly ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                      </button>

                      {cat.isCustom && onDeleteCategory && (
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(currentLang === 'ko' ? `'${cat.labelKO}' 카테고리를 삭제하시겠습니까?` : `Xóa danh mục '${cat.labelVI}'?`)) {
                              onDeleteCategory(cat.id);
                              if (selectedCategory === cat.id) setSelectedCategory('all');
                            }
                          }}
                          className="p-1 rounded-md bg-slate-100 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title={currentLang === 'ko' ? '카테고리 삭제' : 'Xóa danh mục'}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Membership Banner (Simulated benefits - Admin Mode Only) */}
        {isAdminMode && (
          <div className="bg-gradient-to-r from-[#0066FF]/5 to-[#00D1FF]/5 border border-[#0066FF]/15 rounded-2xl p-4 sm:p-6 mb-12 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#0066FF]/10 flex items-center justify-center border border-[#0066FF]/25 text-[#0066FF]">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h4 className="text-sm sm:text-base font-bold text-slate-800 font-sans">{t.memberDiscount}</h4>
                <p className="text-xs text-slate-500 mt-1 font-sans">{t.memberBenefits}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-[#0066FF]/15 text-[#0066FF] text-[10px] font-bold rounded-full font-mono border border-[#0066FF]/20">
                {userSession.isLoggedIn ? 'VIP DISCOUNT ENABLED (10%)' : 'VIP SYSTEM READY'}
              </span>
            </div>
          </div>
        )}

        {/* Swiper.js Product Slider Section (Xiaomi Homepage Style) */}
        {sortedProducts.length > 0 ? (
          <div className="relative">
            <Swiper
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
              }}
              onSlideChange={(swiper) => {
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
              }}
              modules={[Navigation, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 24 },
                1280: { slidesPerView: 4, spaceBetween: 24 },
              }}
              grabCursor={true}
              speed={500}
              className="w-full !py-2 [&_.swiper-wrapper]:flex [&_.swiper-slide]:flex [&_.swiper-slide]:h-auto"
            >
              {sortedProducts.map((product) => {
                const name = currentLang === 'ko' ? product.nameKO : product.nameVI;
                const tag = currentLang === 'ko' ? product.tagKO : product.tagVI;
                
                // Calculate member discounted price if logged in
                const finalPrice = userSession.isLoggedIn ? Math.round(product.price * 0.9) : product.price;
                const hasDiscount = userSession.isLoggedIn;

                return (
                  <SwiperSlide key={product.id} className="!h-auto flex">
                    <div
                      onClick={() => onViewProduct(product.id)}
                      className="group relative w-full h-full flex flex-col justify-between bg-white border border-slate-200/80 hover:border-[#0066FF] rounded-3xl p-5 overflow-hidden transition-all duration-300 shadow-sm hover:shadow-xl cursor-pointer"
                      id={`product-card-${product.id}`}
                    >
                      {/* Badges */}
                      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                        {product.isNew && (
                          <span className="px-2.5 py-1 text-[9px] font-bold tracking-wider uppercase text-white bg-[#0066FF] rounded-md font-mono shadow-sm">
                            NEW
                          </span>
                        )}
                        {product.isBest && (
                          <span className="px-2.5 py-1 text-[9px] font-bold tracking-wider uppercase text-black bg-[#00D1FF] rounded-md font-mono shadow-sm">
                            BEST
                          </span>
                        )}
                      </div>

                      {/* Edit & Delete controls (Shown only in development + admin mode) */}
                      {showAdminUI && (
                        <div className="absolute top-4 right-4 z-20 flex gap-1.5 transition-opacity opacity-100">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditProduct?.(product);
                            }}
                            className="p-1.5 rounded-lg bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-600 hover:text-[#0066FF] hover:border-[#0066FF] hover:bg-blue-50 transition-colors shadow-sm cursor-pointer"
                            title={currentLang === 'ko' ? '제품 정보 수정' : 'Sửa 정보'}
                            id={`edit-prod-${product.id}`}
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(currentLang === 'ko' ? '이 상품을 정말 삭제하시겠습니까?' : 'Xóa sản phẩm này?')) {
                                onDeleteProduct?.(product.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all shadow-sm cursor-pointer"
                            title={currentLang === 'ko' ? '상품 삭제' : 'Xóa'}
                            id={`delete-prod-${product.id}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      {/* Product Image Frame with rounded corners (16:9 wide aspect ratio) */}
                      <div
                        className="relative aspect-[16/9] w-full rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden mb-4 flex items-center justify-center cursor-pointer shrink-0"
                        onClick={() => onViewProduct(product.id)}
                      >
                        <img
                          src={cleanAndConvertImageUrl(product.imageUrl) || DEFAULT_FALLBACK_IMAGE}
                          alt={name}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 via-transparent to-transparent opacity-60" />
                        
                        {/* Quick hover visualizer */}
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="flex items-center gap-2 px-4 py-2 bg-[#0066FF] text-white text-xs font-bold rounded-xl shadow-lg shadow-[#0066FF]/20">
                            <Eye className="w-4 h-4" /> {currentLang === 'ko' ? '상세 정보 보기' : 'Xem chi tiết'}
                          </span>
                        </div>
                      </div>

                      {/* Text details (Product Name & Short Tagline/Description with fixed heights) */}
                      <div className="space-y-2 text-center flex-1 flex flex-col justify-between">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-[#0066FF] uppercase tracking-widest block font-bold">
                            {product.category}
                          </span>
                          {/* Card Title (18px ~ 20px, Bold 700, Fixed line height) */}
                          <div className="h-12 flex items-center justify-center">
                            <h4
                              onClick={() => onViewProduct(product.id)}
                              className="text-[18px] sm:text-[20px] font-bold text-slate-800 group-hover:text-[#0066FF] transition-colors cursor-pointer line-clamp-2 font-sans text-center leading-snug"
                            >
                              {name}
                            </h4>
                          </div>
                          {/* Card Description (13px ~ 14px, Regular 400, Fixed height container for uniform cards) */}
                          <div className="h-10 flex items-center justify-center">
                            <p className="text-[13px] sm:text-[14px] font-normal text-slate-500 line-clamp-2 font-sans leading-relaxed text-center">
                              {tag}
                            </p>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 shrink-0">
                          {/* Price structure (18px ~ 20px, Bold 700) & Quick Cart button */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex flex-col text-left">
                              {hasDiscount && (
                                <span className="text-[11px] text-slate-400 line-through font-mono">
                                  {product.price.toLocaleString()} KRW
                                </span>
                              )}
                              <div className="flex items-center gap-1.5">
                                <span className="text-[18px] sm:text-[20px] font-bold text-slate-900 font-mono">
                                  {finalPrice.toLocaleString()} KRW
                                </span>
                                {hasDiscount && (
                                  <span className="text-[9px] font-bold text-[#0066FF] font-mono bg-blue-50 px-1 py-0.5 rounded">
                                    -10% VIP
                                  </span>
                                )}
                              </div>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onAddToCart(product, product.colors[0]);
                              }}
                              className="p-2.5 rounded-xl bg-slate-900 hover:bg-[#0066FF] text-white transition-all cursor-pointer shadow-sm shrink-0"
                              title={t.addToCart}
                              id={`middle-add-${product.id}`}
                            >
                              <ShoppingCart className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 text-base bg-slate-50 rounded-2xl border border-dashed border-slate-200 font-bold my-8">
            {currentLang === 'ko' ? '준비중' : 'Đang chuẩn bị'}
          </div>
        )}

      </div>
    </section>
  );
}
