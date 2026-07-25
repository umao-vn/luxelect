import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Types & Data
import { Product, CartItem, UserSession, CategoryItem, HeroMediaItem, SplitBgConfig } from './types';
import { PRODUCTS, DEFAULT_HERO_MEDIA, DEFAULT_SECONDARY_HERO_MEDIA, DEFAULT_SUB_MEDIA, DEFAULT_SPLIT_BG_CONFIG } from './data';
import { translations } from './translations';

// Components
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import SecondaryHeroSection from './components/SecondaryHeroSection';
import MiddleSection from './components/MiddleSection';
import BottomSection from './components/BottomSection';
import ProductDetailView from './components/ProductDetailView';
import CartModal from './components/CartModal';
import CheckoutModal from './components/CheckoutModal';
import AdminProductModal from './components/AdminProductModal';
import AddCategoryModal from './components/AddCategoryModal';
import HeroMediaModal from './components/HeroMediaModal';
import { Lock } from 'lucide-react';

const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: 'phone', labelKO: '스마트폰', labelVI: 'Điện thoại' },
  { id: 'laptop', labelKO: '노트북', labelVI: 'Máy tính' },
  { id: 'audio', labelKO: '프리미엄 오디오', labelVI: 'Âm thanh VIP' },
  { id: 'display', labelKO: '디스플레이', labelVI: 'Màn hình 8K' },
  { id: 'smarthome', labelKO: '스마트 홈', labelVI: 'Nhà thông minh' },
];

export default function App() {
  // Localization state (Default is Korean 'ko')
  const [currentLang, setCurrentLang] = useState<'ko' | 'vi'>('ko');
  const t = translations[currentLang];

  // Categories list state initialized from localStorage for persistence
  const [categoriesList, setCategoriesList] = useState<CategoryItem[]>(() => {
    const cached = localStorage.getItem('lux_electronics_categories');
    if (!cached) return DEFAULT_CATEGORIES;
    try {
      const parsed: CategoryItem[] = JSON.parse(cached);
      // Automatically migrate legacy 'cat-4146' or 'cleaner' to 'smarthome'
      const updated = parsed.map((cat) => {
        if (cat.id === 'cat-4146' || cat.id === 'cleaner') {
          return { id: 'smarthome', labelKO: '스마트 홈', labelVI: 'Nhà thông minh' };
        }
        return cat;
      });
      DEFAULT_CATEGORIES.forEach((defCat) => {
        if (!updated.some((c) => c.id === defCat.id)) {
          updated.push(defCat);
        }
      });
      return updated;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    setActiveProductId(null);
    setTimeout(() => {
      const elem = document.getElementById('middle-products-section');
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  // Sync categories to localStorage
  useEffect(() => {
    localStorage.setItem('lux_electronics_categories', JSON.stringify(categoriesList));
  }, [categoriesList]);

  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);

  // Products list state initialized from localStorage with data.ts default sync
  const [productsList, setProductsList] = useState<Product[]>(() => {
    const cached = localStorage.getItem('lux_electronics_products');
    if (!cached) return PRODUCTS;
    try {
      const parsed: Product[] = JSON.parse(cached);
      const defaultIds = PRODUCTS.map((p) => p.id);
      
      // Keep strictly default core products and user created custom items
      const updatedList = parsed.filter((item) => defaultIds.includes(item.id) || item.id.startsWith('lux-custom-')).map((item) => {
        const defaultMatch = PRODUCTS.find((p) => p.id === item.id);
        if (defaultMatch) {
          return {
            ...defaultMatch,
            ...item,
            category: defaultMatch.category,
            nameKO: defaultMatch.nameKO || item.nameKO,
            imageUrl: item.imageUrl || defaultMatch.imageUrl,
            videoUrl: item.videoUrl || defaultMatch.videoUrl,
            colors: (item.colors && item.colors.length > 0) ? item.colors : defaultMatch.colors,
          };
        }
        if (item.nameKO?.includes('드라이어') || item.nameKO?.includes('공기청정기') || item.nameKO?.includes('로봇청소기') || item.nameKO?.includes('무선청소기')) {
          return { ...item, category: 'smarthome' };
        }
        return item;
      });

      // Ensure all default core PRODUCTS are present
      PRODUCTS.forEach((defProduct) => {
        if (!updatedList.some((p) => p.id === defProduct.id)) {
          updatedList.push(defProduct);
        }
      });

      return updatedList;
    } catch {
      return PRODUCTS;
    }
  });

  // Sync products list state to localStorage
  useEffect(() => {
    localStorage.setItem('lux_electronics_products', JSON.stringify(productsList));
  }, [productsList]);

  // Top Section Hero Media List State (key: top_hero_media_list)
  const [topHeroMediaList, setTopHeroMediaList] = useState<HeroMediaItem[]>(() => {
    const cachedNew = localStorage.getItem('top_hero_media_list');
    if (cachedNew) return JSON.parse(cachedNew);
    const cachedOld = localStorage.getItem('lux_hero_media_items');
    return cachedOld ? JSON.parse(cachedOld) : DEFAULT_HERO_MEDIA;
  });

  useEffect(() => {
    localStorage.setItem('top_hero_media_list', JSON.stringify(topHeroMediaList));
  }, [topHeroMediaList]);

  // Secondary Section Hero Media List State (key: secondary_hero_media_list)
  const [secondaryHeroMediaList, setSecondaryHeroMediaList] = useState<HeroMediaItem[]>(() => {
    const cached = localStorage.getItem('secondary_hero_media_list');
    return cached ? JSON.parse(cached) : DEFAULT_SECONDARY_HERO_MEDIA;
  });

  useEffect(() => {
    localStorage.setItem('secondary_hero_media_list', JSON.stringify(secondaryHeroMediaList));
  }, [secondaryHeroMediaList]);

  // Split Background Configuration States
  const [topSplitBgConfig, setTopSplitBgConfig] = useState<SplitBgConfig>(() => {
    const cached = localStorage.getItem('top_split_bg_config') || localStorage.getItem('lux_split_bg_config');
    return cached ? JSON.parse(cached) : { ...DEFAULT_SPLIT_BG_CONFIG, isEnabled: false };
  });

  useEffect(() => {
    localStorage.setItem('top_split_bg_config', JSON.stringify(topSplitBgConfig));
  }, [topSplitBgConfig]);

  const [secondarySplitBgConfig, setSecondarySplitBgConfig] = useState<SplitBgConfig>(() => {
    const cached = localStorage.getItem('secondary_split_bg_config');
    return cached ? JSON.parse(cached) : { ...DEFAULT_SPLIT_BG_CONFIG, isEnabled: false };
  });

  useEffect(() => {
    localStorage.setItem('secondary_split_bg_config', JSON.stringify(secondarySplitBgConfig));
  }, [secondarySplitBgConfig]);

  const [activeTopHeroMediaId, setActiveTopHeroMediaId] = useState<string | null>(() => {
    const cached = localStorage.getItem('active_top_hero_media_id');
    if (cached) return cached;
    const cachedList = localStorage.getItem('top_hero_media_list') || localStorage.getItem('lux_hero_media_items');
    const list: HeroMediaItem[] = cachedList ? JSON.parse(cachedList) : DEFAULT_HERO_MEDIA;
    return list[0]?.id || null;
  });

  useEffect(() => {
    if (activeTopHeroMediaId) {
      localStorage.setItem('active_top_hero_media_id', activeTopHeroMediaId);
    } else {
      localStorage.removeItem('active_top_hero_media_id');
    }
  }, [activeTopHeroMediaId]);

  const [activeSecondaryHeroMediaId, setActiveSecondaryHeroMediaId] = useState<string | null>(() => {
    const cached = localStorage.getItem('active_secondary_hero_media_id');
    if (cached) return cached;
    const cachedList = localStorage.getItem('secondary_hero_media_list');
    const list: HeroMediaItem[] = cachedList ? JSON.parse(cachedList) : DEFAULT_SECONDARY_HERO_MEDIA;
    return list[0]?.id || null;
  });

  useEffect(() => {
    if (activeSecondaryHeroMediaId) {
      localStorage.setItem('active_secondary_hero_media_id', activeSecondaryHeroMediaId);
    } else {
      localStorage.removeItem('active_secondary_hero_media_id');
    }
  }, [activeSecondaryHeroMediaId]);

  const [activeMediaSection, setActiveMediaSection] = useState<'TOP_HERO' | 'SECONDARY_HERO'>('TOP_HERO');
  const [heroMediaModalInitialTab, setHeroMediaModalInitialTab] = useState<'split' | 'single'>('single');
  const [isHeroMediaModalOpen, setIsHeroMediaModalOpen] = useState(false);

  // Top Hero Media Handlers
  const handleAddTopHeroMedia = (newItem: Omit<HeroMediaItem, 'id'>) => {
    const createdItem: HeroMediaItem = {
      ...newItem,
      id: `top-hero-${Date.now()}`,
    };
    setTopHeroMediaList((prev) => [createdItem, ...prev]);
    setActiveTopHeroMediaId(createdItem.id);
    if (topSplitBgConfig.isEnabled) {
      setTopSplitBgConfig((prev) => ({ ...prev, isEnabled: false }));
    }
  };

  const handleDeleteTopHeroMedia = (id: string) => {
    setTopHeroMediaList((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      if (activeTopHeroMediaId === id) {
        setActiveTopHeroMediaId(updated[0]?.id || null);
      }
      return updated;
    });
  };

  const handleUpdateTopHeroMedia = (updatedItem: HeroMediaItem) => {
    setTopHeroMediaList((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
  };

  // Secondary Hero Media Handlers
  const handleAddSecondaryHeroMedia = (newItem: Omit<HeroMediaItem, 'id'>) => {
    const createdItem: HeroMediaItem = {
      ...newItem,
      id: `sec-hero-${Date.now()}`,
    };
    setSecondaryHeroMediaList((prev) => [createdItem, ...prev]);
    setActiveSecondaryHeroMediaId(createdItem.id);
    if (secondarySplitBgConfig.isEnabled) {
      setSecondarySplitBgConfig((prev) => ({ ...prev, isEnabled: false }));
    }
  };

  const handleDeleteSecondaryHeroMedia = (id: string) => {
    setSecondaryHeroMediaList((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      if (activeSecondaryHeroMediaId === id) {
        setActiveSecondaryHeroMediaId(updated[0]?.id || null);
      }
      return updated;
    });
  };

  const handleUpdateSecondaryHeroMedia = (updatedItem: HeroMediaItem) => {
    setSecondaryHeroMediaList((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
  };

  // Sub Media List (PIP Mini Player Photo/Video list) state
  const [subMediaList, setSubMediaList] = useState<HeroMediaItem[]>(() => {
    const cached = localStorage.getItem('lux_sub_media_items');
    return cached ? JSON.parse(cached) : DEFAULT_SUB_MEDIA;
  });

  // Sync sub media list to localStorage
  useEffect(() => {
    localStorage.setItem('lux_sub_media_items', JSON.stringify(subMediaList));
  }, [subMediaList]);

  const [activeSubMediaId, setActiveSubMediaId] = useState<string | null>(() => {
    const cached = localStorage.getItem('active_sub_media_id');
    if (cached) return cached;
    const cachedList = localStorage.getItem('lux_sub_media_items');
    const list: HeroMediaItem[] = cachedList ? JSON.parse(cachedList) : DEFAULT_SUB_MEDIA;
    return list[0]?.id || null;
  });

  useEffect(() => {
    if (activeSubMediaId) {
      localStorage.setItem('active_sub_media_id', activeSubMediaId);
    } else {
      localStorage.removeItem('active_sub_media_id');
    }
  }, [activeSubMediaId]);

  const [isSubMediaModalOpen, setIsSubMediaModalOpen] = useState(false);

  const handleAddSubMedia = (newItem: Omit<HeroMediaItem, 'id'>) => {
    const createdItem: HeroMediaItem = {
      ...newItem,
      id: `sub-media-${Date.now()}`,
    };
    setSubMediaList((prev) => [createdItem, ...prev]);
    setActiveSubMediaId(createdItem.id);
  };

  const handleDeleteSubMedia = (id: string) => {
    setSubMediaList((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      if (activeSubMediaId === id) {
        setActiveSubMediaId(updated[0]?.id || null);
      }
      return updated;
    });
  };

  const handleUpdateSubMedia = (updatedItem: HeroMediaItem) => {
    setSubMediaList((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
  };

  // Admin Mode states
  const isDevEnv = (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') || Boolean((import.meta as any).env?.DEV);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Cart state stored in local state (and synced to localStorage for reliability)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const cached = localStorage.getItem('lux_electronics_cart');
    return cached ? JSON.parse(cached) : [];
  });

  // Sync cart state with localStorage
  useEffect(() => {
    localStorage.setItem('lux_electronics_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Active product for detail page. If active, middle category and lists are cleanly hidden!
  const [activeProductId, setActiveProductId] = useState<string | null>(null);

  // Modals visibility state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Simulated User Session. Simple toggler in header allows switching member vs non-member instantly.
  const [userSession, setUserSession] = useState<UserSession>({
    isLoggedIn: false,
    userType: 'guest',
  });

  // Auto-scroll helper
  const handleScrollToProducts = () => {
    // If detail is active, reset it first so lists are shown again
    if (activeProductId) {
      setActiveProductId(null);
    }
    // Smooth scroll down to the catalog grid
    setTimeout(() => {
      const element = document.getElementById('middle-products-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Toggle user login simulation (Guest <=> VIP Member)
  const handleToggleUserSession = () => {
    if (userSession.isLoggedIn) {
      setUserSession({
        isLoggedIn: false,
        userType: 'guest',
      });
    } else {
      setUserSession({
        isLoggedIn: true,
        userType: 'member',
        name: currentLang === 'ko' ? '임윤아' : 'Lim Yoona',
        email: 'yoona.vip@lux-electronics.com',
        phone: '010-1990-0530',
        address: currentLang === 'ko' ? '서울특별시 강남구 청담동 89-5 럭스팰리스 101호' : 'Phòng 101, Biệt thự Lux, Phường Thảo Điền, Quận 2, TP. Hồ Chí Minh',
      });
    }
  };

  // Add Item to Cart
  const handleAddToCart = (product: Product, color: { nameKO: string; nameVI: string; hex: string }) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedColor.hex === color.hex
      );

      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += 1;
        return copy;
      } else {
        return [...prev, { product, quantity: 1, selectedColor: color }];
      }
    });

    // Automatically trigger cart side-drawer to give excellent prompt feedback
    setIsCartOpen(true);
  };

  // Update Cart Quantity
  const handleUpdateQuantity = (idx: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(idx);
      return;
    }
    setCartItems((prev) => {
      const copy = [...prev];
      copy[idx].quantity = newQty;
      return copy;
    });
  };

  // Remove Cart Item
  const handleRemoveCartItem = (idx: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== idx));
  };

  // Instant Checkout triggers (Buy Now on detail page)
  const handleBuyNow = (product: Product, color: { nameKO: string; nameVI: string; hex: string }) => {
    // Add item to cart first
    handleAddToCart(product, color);
    // Directly close cart drawer and open checkout payment wizard immediately
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Clear Cart helper
  const handleClearCart = () => {
    setCartItems([]);
  };

  // Find currently active product details from dynamic productsList
  const activeProduct = productsList.find((p) => p.id === activeProductId);
  // Default featured hero product (LuxPhone Alpha)
  const featuredProduct = productsList[0] || PRODUCTS[0];

  // Admin Action Handlers
  const handleToggleAdminMode = () => {
    setIsAdminMode((prev) => !prev);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsAdminModalOpen(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsAdminModalOpen(true);
  };

  const handleSaveProduct = (savedProduct: Product) => {
    setProductsList((prev) => {
      const exists = prev.some((p) => p.id === savedProduct.id);
      if (exists) {
        return prev.map((p) => (p.id === savedProduct.id ? savedProduct : p));
      } else {
        return [...prev, savedProduct];
      }
    });
    setIsAdminModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId: string) => {
    setProductsList((prev) => prev.filter((p) => p.id !== productId));
    if (activeProductId === productId) {
      setActiveProductId(null);
    }
  };

  // Category Handlers
  const handleAddCategory = (newCat: CategoryItem) => {
    setCategoriesList((prev) => {
      if (prev.some((c) => c.id === newCat.id)) return prev;
      return [...prev, newCat];
    });
  };

  const handleDeleteCategory = (catId: string) => {
    setCategoriesList((prev) => prev.filter((c) => c.id !== catId));
  };

  // Helper to transition back to the top background/home
  const handleGoToTop = () => {
    setActiveProductId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div 
      id="app-container"
      onClick={(e) => {
        // Handle background click: if the user clicks the direct background of the page container
        if (
          e.target instanceof HTMLElement && 
          (e.target.id === 'app-container' || e.target.tagName === 'MAIN')
        ) {
          handleGoToTop();
        }
      }}
      className="min-h-screen bg-[#f7f7f7] text-slate-850 flex flex-col justify-between selection:bg-[#0066FF] selection:text-white"
    >
      {/* Absolute topmost glow points */}
      <div className="absolute top-0 left-1/4 w-[350px] h-[350px] bg-[#0066FF]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[350px] h-[350px] bg-[#00D1FF]/3 rounded-full blur-[100px] pointer-events-none" />

      {/* LUXURY HEADER (Bilingual + Auth status + Live Cart counters + Dropdown Navigation) */}
      <Header
        t={t}
        currentLang={currentLang}
        setLang={setCurrentLang}
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        userSession={userSession}
        onToggleUserSession={handleToggleUserSession}
        isAdminMode={isAdminMode}
        onToggleAdminMode={handleToggleAdminMode}
        onLogoClick={handleGoToTop}
        categoriesList={categoriesList}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        productsList={productsList}
        onSelectProduct={(productId) => {
          setActiveProductId(productId);
          window.scrollTo({ top: 0, behavior: 'instant' });
        }}
      />

      {/* Admin Mode Guide banner (Development Environment Only) */}
      {isAdminMode && isDevEnv && (
        <div className="sticky top-20 z-40 bg-gradient-to-r from-rose-600 to-pink-600 text-white py-3 px-4 shadow-lg flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold font-sans border-b border-rose-500">
          <Lock className="w-4 h-4 animate-pulse text-white" />
          <span>
            {currentLang === 'ko'
              ? '🔒 관리자 모드가 활성화되었습니다. 상품 카드의 연필 아이콘이나 상세페이지에서 사진/동영상을 실시간 수정 또는 추가해 보세요!'
              : '🔒 Đã bật chế độ Admin. Hãy tự do thay đổi hoặc thêm mới ảnh/video từ biểu tượng bút chì trên thẻ sản phẩm hoặc trang chi tiết!'}
          </span>
        </div>
      )}

      {/* MAIN BODY PAGES ORCHESTRATION */}
      <main className="flex-grow w-full">
        {!activeProduct && (
          <>
            {/* 1. 상단 메인 배경 섹션 (Top Hero Section - key: top_hero_media_list) */}
            <HeroSection
              sectionId="TOP_HERO"
              heroMediaList={topHeroMediaList}
              activeMediaId={activeTopHeroMediaId}
              onSelectActiveMedia={(id) => {
                setActiveTopHeroMediaId(id);
                if (topSplitBgConfig.isEnabled) {
                  setTopSplitBgConfig((prev) => ({ ...prev, isEnabled: false }));
                }
              }}
              onOpenHeroMediaModal={(tab = 'single') => {
                setActiveMediaSection('TOP_HERO');
                setHeroMediaModalInitialTab(tab);
                setIsHeroMediaModalOpen(true);
              }}
              subMediaList={subMediaList}
              activeSubMediaId={activeSubMediaId}
              onSelectActiveSubMedia={setActiveSubMediaId}
              onOpenSubMediaModal={() => setIsSubMediaModalOpen(true)}
              splitBgConfig={topSplitBgConfig}
              onUpdateSplitBgConfig={setTopSplitBgConfig}
              t={t}
              currentLang={currentLang}
              onScrollToProducts={handleScrollToProducts}
              onBannerClick={handleGoToTop}
              isAdmin={isAdminMode}
              isDev={Boolean((import.meta as any).env?.DEV)}
            />

            {/* 2. 새로 추가할 똑같은 크기의 하단 배경 섹션 (Secondary Hero Section - key: secondary_hero_media_list) */}
            <SecondaryHeroSection
              heroMediaList={secondaryHeroMediaList}
              activeMediaId={activeSecondaryHeroMediaId}
              onSelectActiveMedia={(id) => {
                setActiveSecondaryHeroMediaId(id);
                if (secondarySplitBgConfig.isEnabled) {
                  setSecondarySplitBgConfig((prev) => ({ ...prev, isEnabled: false }));
                }
              }}
              onOpenHeroMediaModal={(tab = 'single') => {
                setActiveMediaSection('SECONDARY_HERO');
                setHeroMediaModalInitialTab(tab);
                setIsHeroMediaModalOpen(true);
              }}
              splitBgConfig={secondarySplitBgConfig}
              onUpdateSplitBgConfig={setSecondarySplitBgConfig}
              t={t}
              currentLang={currentLang}
              onScrollToProducts={handleScrollToProducts}
              onBannerClick={handleGoToTop}
              isAdmin={isAdminMode}
              isDev={Boolean((import.meta as any).env?.DEV)}
            />
          </>
        )}

        {/* Dynamic Detail page insertion point (가로 100% full 확장) */}
        <AnimatePresence mode="wait">
          {activeProduct && (
            <motion.div
              key={activeProduct.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              <ProductDetailView
                product={activeProduct}
                t={t}
                currentLang={currentLang}
                userSession={userSession}
                onBackToList={() => setActiveProductId(null)}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                isAdminMode={isAdminMode}
                onEditProduct={handleEditProduct}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* PAGE 2: Middle Section (중단 - Categories and Catalogs) 
            💡 IMPORTANT: HIDDEN cleanly when activeProductId is true, to make the detailed view function as separate dedicated standalone page! */}
        <MiddleSection
          products={productsList}
          categoriesList={categoriesList}
          t={t}
          currentLang={currentLang}
          onViewProduct={(productId) => {
            setActiveProductId(productId);
            window.scrollTo({ top: 0, behavior: 'instant' });
          }}
          onAddToCart={handleAddToCart}
          userSession={userSession}
          isDetailActive={!!activeProductId}
          isAdminMode={isAdminMode}
          onEditProduct={handleEditProduct}
          onAddProduct={handleAddProduct}
          onDeleteProduct={handleDeleteProduct}
          onOpenAddCategoryModal={() => setIsAddCategoryModalOpen(true)}
          onDeleteCategory={handleDeleteCategory}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />

        {/* PAGE 3: Bottom Section (하단 - Value Propositions, FAQs, Newsletter, Brand Footer)
            💡 Note: If product detail is active, bottom simplifies into clean minimalist footer only! */}
        <BottomSection
          t={t}
          currentLang={currentLang}
          isDetailActive={!!activeProductId}
        />
      </main>

      {/* LUXURY SIDE CART DRAWER */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveCartItem}
        onUpdateQuantity={handleUpdateQuantity}
        onTriggerCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        t={t}
        currentLang={currentLang}
        userSession={userSession}
      />

      {/* FULL PAYMENT CHECKOUT WIZARD (Allows member / guest orders safely) */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        userSession={userSession}
        onToggleUserSession={handleToggleUserSession}
        onClearCart={handleClearCart}
        t={t}
        currentLang={currentLang}
      />

      {/* ADMIN PRODUCT CREATOR / MODIFIER MODAL */}
      <AdminProductModal
        isOpen={isAdminModalOpen}
        onClose={() => {
          setIsAdminModalOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        onSave={handleSaveProduct}
        currentLang={currentLang}
        categoriesList={categoriesList}
        onOpenAddCategoryModal={() => setIsAddCategoryModalOpen(true)}
      />

      {/* CATEGORY ADDITION MODAL */}
      <AddCategoryModal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
        onAddCategory={handleAddCategory}
        currentLang={currentLang}
        existingCategories={categoriesList}
      />

      {/* TOP / SECONDARY SECTION HERO MEDIA MANAGEMENT MODAL */}
      <HeroMediaModal
        isOpen={isHeroMediaModalOpen}
        onClose={() => setIsHeroMediaModalOpen(false)}
        heroMediaList={activeMediaSection === 'SECONDARY_HERO' ? secondaryHeroMediaList : topHeroMediaList}
        activeMediaId={activeMediaSection === 'SECONDARY_HERO' ? activeSecondaryHeroMediaId : activeTopHeroMediaId}
        onSelectActiveMedia={activeMediaSection === 'SECONDARY_HERO' ? setActiveSecondaryHeroMediaId : setActiveTopHeroMediaId}
        onAddHeroMedia={activeMediaSection === 'SECONDARY_HERO' ? handleAddSecondaryHeroMedia : handleAddTopHeroMedia}
        onDeleteHeroMedia={activeMediaSection === 'SECONDARY_HERO' ? handleDeleteSecondaryHeroMedia : handleDeleteTopHeroMedia}
        onUpdateHeroMedia={activeMediaSection === 'SECONDARY_HERO' ? handleUpdateSecondaryHeroMedia : handleUpdateTopHeroMedia}
        currentLang={currentLang}
        splitBgConfig={activeMediaSection === 'SECONDARY_HERO' ? secondarySplitBgConfig : topSplitBgConfig}
        onUpdateSplitBgConfig={activeMediaSection === 'SECONDARY_HERO' ? setSecondarySplitBgConfig : setTopSplitBgConfig}
        initialTab={heroMediaModalInitialTab}
        modalTitleKO={activeMediaSection === 'SECONDARY_HERO' ? '⚡ 하단 서브 배경화면 & 3분할 커스텀 관리자' : '⚡ 상단 배경화면 & 3분할 커스텀 관리자'}
        modalTitleVI={activeMediaSection === 'SECONDARY_HERO' ? '⚡ Quản lý Nền Phụ & Media' : '⚡ Quản lý Nền Top & Media'}
        modalSubtitleKO={activeMediaSection === 'SECONDARY_HERO' ? '하단 서브 배경화면 3분할 레이아웃 설정 및 대표 사진/동영상 URL을 관리합니다.' : '상단 메인 배경화면 3분할 레이아웃 설정 및 대표 사진/동영상 URL을 관리합니다.'}
      />

      {/* SUB MEDIA (PIP MINI PLAYER) MANAGEMENT MODAL */}
      <HeroMediaModal
        isOpen={isSubMediaModalOpen}
        onClose={() => setIsSubMediaModalOpen(false)}
        heroMediaList={subMediaList}
        activeMediaId={activeSubMediaId}
        onSelectActiveMedia={setActiveSubMediaId}
        onAddHeroMedia={handleAddSubMedia}
        onDeleteHeroMedia={handleDeleteSubMedia}
        onUpdateHeroMedia={handleUpdateSubMedia}
        currentLang={currentLang}
        modalTitleKO="🎥/📷 서브 메인 화면 (PIP) 미디어 관리자"
        modalTitleVI="🎥/📷 Quản lý Media Phụ (PIP)"
        modalSubtitleKO="상단 메인 배경 좌측 하단 화면(PIP Mini Player)에 표시할 사진 및 동영상을 자유롭게 추가·삭제·수정·선택합니다."
        modalSubtitleVI="Tự do thêm, xóa, sửa và chọn ảnh/video hiển thị trên trình phát nhỏ PIP."
      />
    </div>
  );
}
