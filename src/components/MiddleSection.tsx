import { motion } from 'motion/react';
import { Sparkles, Eye, ShoppingCart, SlidersHorizontal, ArrowUpDown, Plus, Edit, Trash2 } from 'lucide-react';
import { Product, CategoryType, UserSession } from '../types';
import { TranslationSet } from '../translations';
import { useState } from 'react';

interface MiddleSectionProps {
  products: Product[];
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
}

export default function MiddleSection({
  products,
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
}: MiddleSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'priceAsc' | 'priceDesc' | 'rating'>('default');

  // If the product detail view is active, cleanly hide this middle section as requested!
  if (isDetailActive) {
    return null;
  }

  // Filter products by category
  const filteredProducts = products.filter((product) => {
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

  const categories: { id: CategoryType | 'all'; labelKO: string; labelVI: string }[] = [
    { id: 'all', labelKO: '전체 상품', labelVI: 'Tất cả sản phẩm' },
    { id: 'phone', labelKO: '스마트폰', labelVI: 'Điện thoại' },
    { id: 'laptop', labelKO: '노트북', labelVI: 'Máy tính' },
    { id: 'audio', labelKO: '프리미엄 오디오', labelVI: 'Âm thanh VIP' },
    { id: 'display', labelKO: '디스플레이', labelVI: 'Màn hình 8K' },
  ];

  return (
    <section id="middle-products-section" className="w-full bg-white py-16 sm:py-24 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-block text-[10px] font-mono font-black tracking-widest text-[#0066FF] mb-2 uppercase px-3 py-1 bg-[#0066FF]/5 border border-[#0066FF]/20 rounded-md">
            [ 02. MIDDLE SECTION / PRODUCT COLLECTIONS ]
          </div>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
            {t.middleSectionTitle}
          </h3>
          <p className="text-slate-600 text-sm sm:text-base font-sans leading-relaxed">
            {t.middleSectionDesc}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#0066FF] to-[#00D1FF] mx-auto rounded-full mt-4" />
        </div>

        {/* Filter and Categorization controls bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-200 mb-12">
          {/* Categories Tab selector */}
          <div className="flex flex-wrap items-center justify-center gap-2 w-full md:w-auto">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#0066FF] to-[#00D1FF] text-white shadow-lg shadow-[#0066FF]/20 font-semibold'
                      : 'bg-slate-50 text-slate-600 border border-slate-250/60 hover:text-[#0066FF] hover:border-[#0066FF] hover:bg-[#0066FF]/5'
                  }`}
                  id={`cat-tab-${cat.id}`}
                >
                  {currentLang === 'ko' ? cat.labelKO : cat.labelVI}
                </button>
              );
            })}

            {isAdminMode && (
              <button
                onClick={onAddProduct}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 text-white shadow-lg shadow-emerald-500/10 flex items-center gap-1.5 cursor-pointer ml-2"
                id="admin-add-product-btn"
                title={currentLang === 'ko' ? '새 럭셔리 상품 추가' : 'Thêm sản phẩm Luxury mới'}
              >
                <Plus className="w-4 h-4" />
                <span>{currentLang === 'ko' ? '새 상품 추가' : 'Thêm sản phẩm'}</span>
              </button>
            )}
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>FILTER:</span>
            </div>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-xs sm:text-sm text-slate-700 hover:text-slate-900 focus:outline-none focus:border-[#0066FF] transition-colors cursor-pointer"
                id="product-sort-select"
              >
                <option value="default">{currentLang === 'ko' ? '추천 제품순' : 'Sản phẩm gợi ý'}</option>
                <option value="priceAsc">{currentLang === 'ko' ? '낮은 가격순' : 'Giá thấp đến cao'}</option>
                <option value="priceDesc">{currentLang === 'ko' ? '높은 가격순' : 'Giá cao đến thấp'}</option>
                <option value="rating">{currentLang === 'ko' ? '최고 평점순' : 'Đánh giá cao nhất'}</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-455">
                <ArrowUpDown className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Membership Banner (Simulated benefits) */}
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

        {/* Products Grid */}
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
                className="group relative flex flex-col justify-between bg-slate-50/60 border border-slate-200 hover:border-[#0066FF] hover:bg-white rounded-2xl p-5 overflow-hidden transition-all duration-300 shadow-sm hover:shadow-lg"
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

                {/* Admin controls badge */}
                {isAdminMode && (
                  <div className="absolute top-4 right-4 z-20 flex gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditProduct?.(product);
                      }}
                      className="p-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 hover:border-rose-300 transition-colors shadow-sm cursor-pointer"
                      title={currentLang === 'ko' ? '사진/동영상 수정' : 'Sửa ảnh/video'}
                      id={`admin-edit-prod-${product.id}`}
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
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all shadow-sm cursor-pointer"
                      title={currentLang === 'ko' ? '상품 삭제' : 'Xóa sản phẩm'}
                      id={`admin-delete-prod-${product.id}`}
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
                    src={product.imageUrl}
                    alt={name}
                    referrerPolicy="no-referrer"
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
                    onClick={() => onAddToCart(product, product.colors[0])}
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

      </div>
    </section>
  );
}
