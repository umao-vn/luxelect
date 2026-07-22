import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Types & Data
import { Product, CartItem, UserSession } from './types';
import { PRODUCTS } from './data';
import { translations } from './translations';

// Components
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import MiddleSection from './components/MiddleSection';
import BottomSection from './components/BottomSection';
import ProductDetailView from './components/ProductDetailView';
import CartModal from './components/CartModal';
import CheckoutModal from './components/CheckoutModal';
import AdminProductModal from './components/AdminProductModal';
import { Lock } from 'lucide-react';

export default function App() {
  // Localization state (Default is Korean 'ko')
  const [currentLang, setCurrentLang] = useState<'ko' | 'vi'>('ko');
  const t = translations[currentLang];

  // Products list state initialized from localStorage for persistence
  const [productsList, setProductsList] = useState<Product[]>(() => {
    const cached = localStorage.getItem('lux_electronics_products');
    return cached ? JSON.parse(cached) : PRODUCTS;
  });

  // Sync products list state to localStorage
  useEffect(() => {
    localStorage.setItem('lux_electronics_products', JSON.stringify(productsList));
  }, [productsList]);

  // Admin Mode states
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
      className="min-h-screen bg-white text-slate-850 flex flex-col justify-between selection:bg-[#0066FF] selection:text-white"
    >
      {/* Absolute topmost glow points */}
      <div className="absolute top-0 left-1/4 w-[350px] h-[350px] bg-[#0066FF]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[350px] h-[350px] bg-[#00D1FF]/3 rounded-full blur-[100px] pointer-events-none" />

      {/* LUXURY HEADER (Bilingual + Auth status + Live Cart counters) */}
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
      />

      {/* Admin Mode Guide banner */}
      {isAdminMode && (
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
        {/* PAGE 1: Upper Section (상단 - Hero cinematic billboard) */}
        <HeroSection
          featuredProduct={featuredProduct}
          t={t}
          currentLang={currentLang}
          onViewProduct={setActiveProductId}
          onScrollToProducts={handleScrollToProducts}
          onBannerClick={handleGoToTop}
        />

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
          t={t}
          currentLang={currentLang}
          onViewProduct={setActiveProductId}
          onAddToCart={handleAddToCart}
          userSession={userSession}
          isDetailActive={!!activeProductId}
          isAdminMode={isAdminMode}
          onEditProduct={handleEditProduct}
          onAddProduct={handleAddProduct}
          onDeleteProduct={handleDeleteProduct}
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
      />
    </div>
  );
}
