import { motion } from 'motion/react';
import { Sparkles, Eye, ShoppingCart, SlidersHorizontal, ArrowUpDown, Plus, Edit, Trash2, FolderPlus, X, Lock, Unlock } from 'lucide-react';
import { Product, CategoryType, CategoryItem, UserSession } from '../types';
import { DEFAULT_FALLBACK_IMAGE, cleanAndConvertImageUrl } from '../utils';
import { TranslationSet } from '../translations';
import { useState } from 'react';

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
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          {showAdminUI && (
            <div className="inline-block text-[10px] font-mono font-black tracking-widest text-[#0066FF] mb-2 uppercase px-3 py-1 bg-[#0066FF]/5 border border-[#0066FF]/20 rounded-md">
              [ 02. MIDDLE SECTION / PRODUCT COLLECTIONS ]
            </div>
          )}
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
            {t.middleSectionTitle}
          </h3>
          <p className="text-slate-600 text-sm sm:text-base font-sans leading-relaxed">
            {t.middleSectionDesc}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#0066FF] to-[#00D1FF] mx-auto rounded-full mt-4" />
        </div>

        {/* Filter and Categorization controls bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-6">
          {/* Integrated Active Category Status Badge */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-slate-100/90 border border-slate-200 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-[#0066FF]" />
              <span>
                {currentLang === 'ko' ? '선택된 카테고리:' : 'Danh mục đã chọn:'}{' '}
                <strong className="text-[#0066FF] font-extrabold">
                  {allCategoryTabs.find((c) => c.id === selectedCategory)?.[currentLang === 'ko' ? 'labelKO' : 'labelVI'] || (currentLang === 'ko' ? '전체 상품' : 'Tất cả')}
                </strong>
              </span>
              <span className="text-xs text-slate-400 font-mono ml-1">
                ({filteredProducts.length}{currentLang === 'ko' ? '개 모델' : ' sản phẩm'})
              </span>
            </div>

            {/* Reset button if filtered */}
            {selectedCategory !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
              >
                {currentLang === 'ko' ? '전체 보기 ✕' : 'Xem tất cả ✕'}
              </button>
            )}
          </div>

          {/* Right Controls: Sort Selector + Admin Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            {/* Admin Buttons (Shown in development + admin mode) */}
            {showAdminUI && (
              <>
                <button
                  onClick={onOpenAddCategoryModal}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-dashed border-[#0066FF]/50 text-[#0066FF] hover:bg-[#0066FF]/5 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  id="add-category-btn"
                  title={currentLang === 'ko' ? '새 제품 카테고리 추가' : 'Thêm danh mục mới'}
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  <span>{currentLang === 'ko' ? '+ 카테고리 추가' : '+ Thêm danh mục'}</span>
                </button>

                <button
                  onClick={onAddProduct}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#0066FF] hover:bg-blue-700 text-white shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  id="add-product-btn"
                  title={currentLang === 'ko' ? '새 제품 등록' : 'Đăng ký sản phẩm mới'}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{currentLang === 'ko' ? '+ 제품 등록' : '+ Đăng ký'}</span>
                </button>
              </>
            )}

            {/* Sort selector */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </div>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 pr-9 text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 focus:outline-none focus:border-[#0066FF] transition-colors cursor-pointer"
                  id="product-sort-select"
                >
                  <option value="default">{currentLang === 'ko' ? '추천 제품순' : 'Sản phẩm gợi ý'}</option>
                  <option value="priceAsc">{currentLang === 'ko' ? '낮은 가격순' : 'Giá thấp đến cao'}</option>
                  <option value="priceDesc">{currentLang === 'ko' ? '높은 가격순' : 'Giá cao đến thấp'}</option>
                  <option value="rating">{currentLang === 'ko' ? '최고 평점순' : 'Đánh giá cao nhất'}</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Pills Navigation & Admin Controls Bar */}
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

        {/* Products Grid */}
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {sortedProducts.map((product) => {
              const name = currentLang === 'ko' ? product.nameKO : product.nameVI;
              const tag = currentLang === 'ko' ? product.tagKO : product.tagVI;
              
              // Calculate member discounted price if logged in
              const finalPrice = userSession.isLoggedIn ? Math.round(product.price * 0.9) : product.price;
              const hasDiscount = userSession.isLoggedIn;

              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => onViewProduct(product.id)}
                  className="group relative flex flex-col justify-between bg-white border border-slate-200/80 hover:border-[#0066FF] hover:bg-white rounded-2xl p-5 overflow-hidden transition-all duration-300 shadow-sm hover:shadow-lg cursor-pointer"
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
                        title={currentLang === 'ko' ? '제품 정보 수정' : 'Sửa thông tin sản phẩm'}
                        id={`edit-prod-${product.id}`}
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(currentLang === 'ko' ? '이 상품을 정말 삭제하시겠습니까?' : 'Bạn có chắc chắn muốn xóa sản phẩm này?')) {
                            onDeleteProduct?.(product.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all shadow-sm cursor-pointer"
                        title={currentLang === 'ko' ? '상품 삭제' : 'Xóa sản phẩm'}
                        id={`delete-prod-${product.id}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Favorite background visual glow */}
                  <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#0066FF]/5 rounded-full blur-xl group-hover:bg-[#0066FF]/10 transition-colors pointer-events-none" />

                  {/* Product Image Frame */}
                  <div className="relative aspect-square w-full rounded-xl bg-white border border-slate-100 overflow-hidden mb-5 flex items-center justify-center cursor-pointer"
                    onClick={() => onViewProduct(product.id)}
                  >
                    <img
                      src={cleanAndConvertImageUrl(product.imageUrl) || DEFAULT_FALLBACK_IMAGE}
                      alt={name}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
                      }}
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 via-transparent to-transparent opacity-60" />
                    
                    {/* Quick hover visualizer */}
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="flex items-center gap-2 px-4 py-2 bg-[#0066FF] text-white text-xs font-bold rounded-xl shadow-lg shadow-[#0066FF]/20 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        <Eye className="w-4 h-4" /> {currentLang === 'ko' ? '상세 정보 단독 보기' : 'Xem chi tiết riêng biệt'}
                      </span>
                    </div>
                  </div>

                  {/* Text details */}
                  <div className="space-y-2 text-left flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-[#0066FF] uppercase tracking-widest block font-bold">
                        {product.category}
                      </span>
                      <h4
                        onClick={() => onViewProduct(product.id)}
                        className="text-base font-bold text-slate-800 group-hover:text-[#0066FF] transition-colors cursor-pointer line-clamp-1 font-sans"
                      >
                        {name}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-1 font-sans">{tag}</p>
                    </div>

                    <div className="pt-4 border-t border-slate-200">
                      {/* Rating and count */}
                      <div className="flex items-center gap-1 mb-2">
                        <span className="text-xs text-amber-500 font-mono">★</span>
                        <span className="text-xs font-bold text-slate-700 font-mono">{product.rating.toFixed(1)}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({product.reviewsCount})</span>
                      </div>

                      {/* Price structure */}
                      <div className="flex flex-col">
                        {hasDiscount && (
                          <span className="text-xs text-slate-400 line-through font-mono">
                            {product.price.toLocaleString()} KRW
                          </span>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="text-base font-black text-slate-900 font-mono">
                            {finalPrice.toLocaleString()} KRW
                          </span>
                          {hasDiscount && (
                            <span className="text-[10px] font-bold text-[#0066FF] font-mono">
                              -10% VIP
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions bottom */}
                  <div className="grid grid-cols-2 gap-2 mt-5">
                    <button
                      onClick={() => onViewProduct(product.id)}
                      className="flex items-center justify-center gap-1 py-2.5 rounded-xl border border-slate-200 hover:border-[#0066FF] text-xs text-slate-600 hover:text-[#0066FF] transition-colors bg-white hover:bg-[#0066FF]/5 cursor-pointer"
                      title="View Details"
                      id={`middle-view-${product.id}`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{currentLang === 'ko' ? '제품 상세' : 'Chi tiết'}</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product, product.colors[0]);
                      }}
                      className="flex items-center justify-center gap-1 py-2.5 rounded-xl bg-slate-900 hover:bg-[#0066FF] text-white hover:text-white transition-all text-xs font-bold cursor-pointer"
                      title="Add to Cart"
                      id={`middle-add-${product.id}`}
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>{t.addToCart.split(' ')[0]}</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
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
