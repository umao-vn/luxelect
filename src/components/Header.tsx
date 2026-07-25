import { useState, useRef } from 'react';
import { 
  ShoppingBag, 
  Globe, 
  User, 
  LogOut, 
  Settings, 
  Menu, 
  ChevronDown, 
  Smartphone, 
  Laptop, 
  Tv, 
  Sparkles, 
  ArrowRight,
  Headphones,
  Star,
  ChevronRight,
  Tag,
  ImageOff
} from 'lucide-react';
import { TranslationSet } from '../translations';
import { UserSession, CategoryItem, Product } from '../types';
import { CATEGORY_SUB_MENUS } from '../data';

interface HeaderProps {
  t: TranslationSet;
  currentLang: 'ko' | 'vi';
  setLang: (lang: 'ko' | 'vi') => void;
  cartCount: number;
  onOpenCart: () => void;
  userSession: UserSession;
  onToggleUserSession: () => void;
  isAdminMode: boolean;
  onToggleAdminMode: () => void;
  onLogoClick?: () => void;
  categoriesList?: CategoryItem[];
  selectedCategory?: string;
  onSelectCategory?: (catId: string) => void;
  productsList?: Product[];
  onSelectProduct?: (productId: string) => void;
}

// Category Icons map for dynamic binding
const CATEGORY_ICONS: Record<string, any> = {
  phone: Smartphone,
  laptop: Laptop,
  audio: Headphones,
  display: Tv,
  smarthome: Sparkles,
  cleaner: Sparkles,
};

export default function Header({
  t,
  currentLang,
  setLang,
  cartCount,
  onOpenCart,
  userSession,
  onToggleUserSession,
  isAdminMode,
  onToggleAdminMode,
  onLogoClick,
  categoriesList = [],
  selectedCategory = 'all',
  onSelectCategory,
  productsList = [],
  onSelectProduct,
}: HeaderProps) {
  const isDevEnv = (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') || Boolean((import.meta as any).env?.DEV);
  
  // State for hover-based dynamic dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Default category quick navigation pills (Without 'all' pill)
  const defaultPills = [
    { id: 'phone', labelKO: '스마트폰', labelVI: 'Điện thoại' },
    { id: 'laptop', labelKO: '노트북', labelVI: 'Máy tính' },
    { id: 'audio', labelKO: '프리미엄 오디오', labelVI: 'Âm thanh' },
    { id: 'display', labelKO: '디스플레이', labelVI: 'Màn hình' },
    { id: 'smarthome', labelKO: '스마트 홈', labelVI: 'Nhà thông minh' },
  ];

  // Combine default pills with user custom categories if any exist
  const customPills = categoriesList
    .filter((c) => !['phone', 'laptop', 'audio', 'display', 'smarthome', 'cleaner'].includes(c.id))
    .map((c) => ({
      id: c.id,
      labelKO: c.labelKO,
      labelVI: c.labelVI,
    }));

  const navPills = [...defaultPills, ...customPills];

  // Hover handlers with smooth buffer time to prevent flickering
  const handleMouseEnterCategory = (catId: string) => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    setHoveredCategory(catId);
    setIsDropdownOpen(true);
  };

  const handleMouseLeaveNav = () => {
    leaveTimerRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
      setHoveredCategory(null);
    }, 200);
  };

  const handleMouseEnterDropdown = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    setIsDropdownOpen(true);
  };

  const handleCategoryClick = (catId: string) => {
    setIsDropdownOpen(false);
    setHoveredCategory(null);
    if (onSelectCategory) {
      onSelectCategory(catId);
    }
  };

  const handleProductClick = (productId: string) => {
    setIsDropdownOpen(false);
    setHoveredCategory(null);
    if (onSelectProduct) {
      onSelectProduct(productId);
    }
  };

  // Determine active category being previewed in dropdown
  const activeDropdownCat = hoveredCategory || (isDropdownOpen ? selectedCategory : 'all');
  const subMenuData = CATEGORY_SUB_MENUS[activeDropdownCat] || null;

  const categoryPill = navPills.find((p) => p.id === activeDropdownCat) || categoriesList.find((c) => c.id === activeDropdownCat);
  const categoryTitleKO = subMenuData?.titleKO || categoryPill?.labelKO || activeDropdownCat;
  const categoryTitleVI = subMenuData?.titleVI || categoryPill?.labelVI || activeDropdownCat;
  const CategoryIcon = CATEGORY_ICONS[activeDropdownCat] || Sparkles;

  const subListKO = subMenuData?.subCategoriesKO || [];
  const subListVI = subMenuData?.subCategoriesVI || [];
  const subList = currentLang === 'ko' ? subListKO : subListVI;
  const hasSubCategories = subList.length > 0;

  // Get matching products for active category in dropdown
  const categoryProducts = activeDropdownCat === 'all' 
    ? productsList 
    : productsList.filter((p) => p.category === activeDropdownCat);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-15 gap-4">

          {/* LEFT GROUP: LOGO + CATEGORY NAVIGATION */}
          <div className="flex items-center space-x-6 lg:space-x-8">
            {/* 1. LOGO AREA (Xiaomi Style Compact Logo) */}
            <div 
              onClick={onLogoClick}
              className="flex items-center space-x-2.5 cursor-pointer group flex-shrink-0"
              title={currentLang === 'ko' ? '메인 홈으로 이동' : 'Về trang chủ'}
            >
              <div className="w-7.5 h-7.5 sm:w-8 sm:h-8 bg-gradient-to-tr from-[#0066FF] to-[#00D1FF] rounded-lg flex items-center justify-center text-white font-black text-sm sm:text-base shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
                <span className="font-mono">L</span>
              </div>
              <div>
                <div className="text-sm sm:text-base font-bold tracking-tight text-slate-900 leading-none group-hover:text-[#0066FF] transition-colors">
                  LUX ELECTRONICS
                </div>
                <div className="text-[9px] font-medium tracking-widest text-slate-400 uppercase mt-0.5 hidden sm:block font-mono">
                  PREMIUM TECH
                </div>
              </div>
            </div>

            {/* 2. PRODUCT CATEGORY NAVIGATION (Right next to logo) */}
            <nav 
              className="hidden lg:flex items-center space-x-1 relative py-2"
              onMouseLeave={handleMouseLeaveNav}
            >
              {/* Direct Category Quick Nav Items */}
              <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar">
                {navPills.map((pill) => {
                  const isSelected = selectedCategory === pill.id;
                  const isHovered = hoveredCategory === pill.id;
                  return (
                    <button
                      key={pill.id}
                      type="button"
                      onMouseEnter={() => handleMouseEnterCategory(pill.id)}
                      onClick={() => handleCategoryClick(pill.id)}
                      className={`relative px-3 py-1.5 rounded-md text-[13px] sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                        isHovered
                          ? 'text-[#0066FF] font-medium bg-blue-50/60'
                          : isSelected
                          ? 'text-[#0066FF] font-semibold bg-blue-50/40'
                          : 'text-slate-700 font-normal hover:text-[#0066FF]'
                      }`}
                    >
                      <span>{currentLang === 'ko' ? pill.labelKO : pill.labelVI}</span>
                      {/* Subtle Xiaomi-style Bottom Active/Hover Accent Bar */}
                      {(isHovered || isSelected) && (
                        <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#0066FF] rounded-full animate-fade-in" />
                      )}
                    </button>
                  );
                })}
              </div>

            {/* MEGA DROPDOWN PANEL (XIAOMI STYLE CLEAN PRODUCT CARDS) */}
            <div 
              onMouseEnter={handleMouseEnterDropdown}
              onMouseLeave={handleMouseLeaveNav}
              className={`dropdown-menu absolute top-full left-0 w-[880px] max-w-[92vw] bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-6 z-50 transition-all duration-200 ease-out ${
                isDropdownOpen 
                  ? 'opacity-100 visible translate-y-0' 
                  : 'opacity-0 invisible translate-y-[-8px] pointer-events-none'
              }`}
            >
              {/* IF A SPECIFIC CATEGORY IS HOVERED OR OPENED */}
              {activeDropdownCat !== 'all' ? (
                <div className="flex gap-6">
                  
                  {/* Left Column: Subcategories vertical list (Xiaomi style) */}
                  {hasSubCategories && (
                    <div className="w-48 flex-shrink-0 border-r border-slate-100 pr-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center space-x-2 pb-3 mb-3 border-b border-slate-100 text-[#0066FF] font-extrabold text-sm">
                          <CategoryIcon className="w-4 h-4 text-[#0066FF]" />
                          <span>{currentLang === 'ko' ? categoryTitleKO : categoryTitleVI}</span>
                        </div>

                        <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                          {currentLang === 'ko' ? '주요 세부 라인업' : 'DANH MỤC CON'}
                        </div>

                        <ul className="space-y-2">
                          {subList.map((subName, idx) => {
                            const matchedProd = categoryProducts.find(
                              (p) => p.nameKO === subName || p.tagKO === subName || p.nameKO.includes(subName) || subName.includes(p.nameKO) ||
                              (p.nameKO.includes('드라이어') && subName.includes('드라이어')) ||
                              (p.nameKO.includes('공기청정기') && subName.includes('공기청정기')) ||
                              (p.nameKO.includes('로봇청소기') && subName.includes('로봇청소기')) ||
                              (p.nameKO.includes('무선청소기') && subName.includes('무선청소기'))
                            );
                            return (
                              <li key={idx}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (matchedProd) {
                                      handleProductClick(matchedProd.id);
                                    } else {
                                      handleCategoryClick(activeDropdownCat);
                                    }
                                  }}
                                  className="group/sub flex items-center justify-between w-full text-left text-xs font-semibold text-slate-700 hover:text-[#0066FF] hover:translate-x-1 transition-all cursor-pointer py-1"
                                >
                                  <span>{subName}</span>
                                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover/sub:text-[#0066FF] opacity-0 group-hover/sub:opacity-100 transition-opacity" />
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCategoryClick(activeDropdownCat)}
                        className="mt-4 w-full py-2 px-3 bg-slate-50 hover:bg-[#0066FF] hover:text-white text-[#0066FF] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer border border-slate-200/80"
                      >
                        <span>{currentLang === 'ko' ? '전체 메뉴' : 'Xem tất cả'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Right Column: Clean Xiaomi-Style Product Cards Grid */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#0066FF]" />
                          {currentLang === 'ko' ? `${categoryTitleKO} 대표 라인업` : `Sản phẩm ${categoryTitleVI}`}
                        </span>
                        {categoryProducts.length > 0 && (
                          <span className="text-[11px] text-slate-400 font-sans">
                            {currentLang === 'ko' ? `총 ${categoryProducts.length}개 모델` : `${categoryProducts.length} sản phẩm`}
                          </span>
                        )}
                      </div>

                      {categoryProducts.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
                          {categoryProducts.slice(0, 4).map((prod) => {
                            const hasValidImage = Boolean(prod.imageUrl && prod.imageUrl.trim() !== '' && !prod.imageUrl.startsWith('data:image/svg+xml'));
                            return (
                              <div 
                                key={prod.id}
                                onClick={() => handleProductClick(prod.id)}
                                className="group/pcard flex flex-col items-center justify-between p-3.5 rounded-2xl bg-[#f8f9fa] hover:bg-slate-100/90 border border-transparent hover:border-blue-200/80 transition-all duration-200 cursor-pointer text-center relative overflow-hidden"
                              >
                                {/* Top Badge */}
                                {prod.isBest && (
                                  <span className="absolute top-2.5 left-2.5 bg-[#0066FF] text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm">
                                    BEST
                                  </span>
                                )}

                                {/* Product Clean Image (Xiaomi style) */}
                                <div className="w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center p-1 my-1 transition-transform duration-300 group-hover/pcard:scale-105">
                                  {hasValidImage ? (
                                    <img 
                                      src={prod.imageUrl} 
                                      alt={currentLang === 'ko' ? prod.nameKO : prod.nameVI}
                                      className="max-w-full max-h-full object-contain drop-shadow-sm rounded-lg"
                                      referrerPolicy="no-referrer"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-slate-100 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-1 p-2">
                                      <ImageOff className="w-6 h-6 text-slate-300" />
                                      <span className="text-[10px] font-bold text-slate-400">사진 없음</span>
                                    </div>
                                  )}
                                </div>

                                {/* Product Name & Price */}
                                <div className="w-full text-center mt-1">
                                  <div className="text-xs sm:text-sm font-bold text-slate-800 group-hover/pcard:text-[#0066FF] transition-colors line-clamp-1 w-full">
                                    {currentLang === 'ko' ? prod.nameKO : prod.nameVI}
                                  </div>
                                  <div className="text-xs font-semibold text-slate-500 mt-1">
                                    {prod.price > 0 
                                      ? `${prod.price.toLocaleString()} ${currentLang === 'ko' ? '원' : 'VND'}`
                                      : (currentLang === 'ko' ? '가격 미정' : 'Chưa có giá')}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-10 text-center text-slate-400 text-sm bg-slate-50 rounded-2xl border border-dashed border-slate-200 font-semibold">
                          {currentLang === 'ko' ? '준비중' : 'Đang chuẩn bị'}
                        </div>
                      )}
                    </div>

                    {/* Bottom Right Xiaomi Pill Button */}
                    {categoryProducts.length > 0 && (
                      <div className="flex justify-end mt-4 pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => handleCategoryClick(activeDropdownCat)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-[#0066FF] hover:text-white text-slate-700 text-xs font-bold rounded-full transition-all duration-200 shadow-sm cursor-pointer group"
                        >
                          <span>{currentLang === 'ko' ? `'${categoryTitleKO}' 전체 보기` : 'Xem tất cả sản phẩm'}</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              ) : (
                /* ALL CATEGORIES OVERVIEW (WHEN 'ALL' IS HOVERED OR OPENED) */
                <div>
                  <div className="text-xs font-extrabold text-slate-700 mb-4 flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#0066FF]" />
                      {currentLang === 'ko' ? '전체 카테고리 시그니처 모델' : 'Tất cả sản phẩm tiêu biểu'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                    {navPills.map((pill) => {
                      const subData = CATEGORY_SUB_MENUS[pill.id];
                      const sampleProduct = productsList.find((p) => p.category === pill.id);

                      if (!sampleProduct) return null;

                      return (
                        <div 
                          key={pill.id}
                          onClick={() => handleProductClick(sampleProduct.id)}
                          className="group/pcard flex flex-col items-center justify-between p-3.5 rounded-2xl bg-[#f8f9fa] hover:bg-slate-100/90 border border-transparent hover:border-blue-200/80 transition-all duration-200 cursor-pointer text-center relative overflow-hidden"
                        >
                          <span className="text-[10px] font-bold text-[#0066FF] bg-blue-50 px-2 py-0.5 rounded-full mb-1">
                            {currentLang === 'ko' ? (subData?.titleKO || pill.labelKO) : (subData?.titleVI || pill.labelVI)}
                          </span>

                          <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center p-1 my-1 transition-transform duration-300 group-hover/pcard:scale-105">
                            <img 
                              src={sampleProduct.imageUrl} 
                              alt={pill.id} 
                              className="max-w-full max-h-full object-contain drop-shadow-sm rounded-lg"
                              referrerPolicy="no-referrer"
                            />
                          </div>

                          <div className="w-full text-center mt-1">
                            <div className="text-xs font-bold text-slate-800 group-hover/pcard:text-[#0066FF] transition-colors line-clamp-1">
                              {currentLang === 'ko' ? sampleProduct.nameKO : sampleProduct.nameVI}
                            </div>
                            <div className="text-[11px] font-semibold text-slate-500 mt-0.5">
                              {sampleProduct.price.toLocaleString()} 원
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          </nav>
        </div>

        {/* 3. RIGHT UTILITY BUTTONS */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            
            {/* Language Picker */}
            <button
              onClick={() => setLang(currentLang === 'ko' ? 'vi' : 'ko')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              title="Switch Language"
              id="lang-toggle-btn"
            >
              <Globe className="w-3.5 h-3.5 text-[#0066FF]" />
              <span className="hidden sm:inline">{currentLang === 'ko' ? '한국어' : 'Tiếng Việt'}</span>
              <span className="sm:hidden">{currentLang === 'ko' ? 'KO' : 'VI'}</span>
            </button>

            {/* Admin Mode (Shown in dev) */}
            {isDevEnv && (
              <button
                onClick={onToggleAdminMode}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition cursor-pointer ${
                  isAdminMode
                    ? 'bg-rose-50 border-rose-300 text-rose-600 font-semibold shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                id="admin-toggle-btn"
                title="Toggle Admin Mode"
              >
                <Settings className={`w-3.5 h-3.5 ${isAdminMode ? 'animate-spin' : 'text-slate-500'}`} />
                <span className="hidden sm:inline">{currentLang === 'ko' ? (isAdminMode ? '관리자 종료' : '관리자 모드') : (isAdminMode ? 'Thoát Admin' : 'Admin')}</span>
              </button>
            )}

            {/* Member Account */}
            <div className="flex items-center">
              {userSession.isLoggedIn ? (
                <div className="flex items-center space-x-1.5 bg-[#0066FF]/5 px-3 py-1.5 rounded-full border border-[#0066FF]/20 text-xs">
                  <div className="w-2 h-2 rounded-full bg-[#0066FF] animate-pulse" />
                  <span className="text-[#0066FF] font-semibold hidden sm:inline">
                    VIP {userSession.name}
                  </span>
                  <button
                    onClick={onToggleUserSession}
                    className="text-slate-500 hover:text-red-500 transition-colors ml-1 cursor-pointer"
                    title={t.logout}
                    id="logout-btn"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onToggleUserSession}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                  id="login-simulate-btn"
                >
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">{t.memberLogin.split(' ')[0]}</span>
                </button>
              )}
            </div>

            {/* Shopping Cart with Badge */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 transition cursor-pointer ml-1"
              id="cart-toggle-btn"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#0066FF] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {cartCount}
                </span>
              )}
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
