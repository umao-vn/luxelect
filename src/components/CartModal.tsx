import { X, Trash2, ShoppingBag, Plus, Minus, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, UserSession } from '../types';
import { TranslationSet } from '../translations';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (index: number) => void;
  onUpdateQuantity: (index: number, newQty: number) => void;
  onTriggerCheckout: () => void;
  t: TranslationSet;
  currentLang: 'ko' | 'vi';
  userSession: UserSession;
}

export default function CartModal({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onUpdateQuantity,
  onTriggerCheckout,
  t,
  currentLang,
  userSession,
}: CartModalProps) {
  if (!isOpen) return null;

  // Calculate Subtotal
  const subtotal = cartItems.reduce((acc, item) => {
    return acc + item.product.price * item.quantity;
  }, 0);

  // Apply 10% membership discount if logged in
  const discount = userSession.isLoggedIn ? Math.round(subtotal * 0.1) : 0;
  const finalTotal = subtotal - discount;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
          id="cart-backdrop"
        />

        <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-[#0066FF]" />
                <h3 className="text-lg font-bold text-slate-900 font-sans">{t.cart}</h3>
                <span className="text-xs text-slate-500 font-mono">({cartItems.length})</span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                id="cart-close-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                  <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <p className="text-sm text-slate-500 max-w-xs font-sans leading-relaxed">
                    {t.emptyCart}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item, idx) => {
                    const name = currentLang === 'ko' ? item.product.nameKO : item.product.nameVI;
                    const colorName = currentLang === 'ko' ? item.selectedColor.nameKO : item.selectedColor.nameVI;
                    const itemPrice = item.product.price;
                    const itemSum = itemPrice * item.quantity;

                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex gap-4 items-start"
                      >
                        {/* Img frame */}
                        <div className="w-16 h-16 rounded-lg bg-white border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                          <img
                            src={item.product.imageUrl}
                            alt={name}
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80';
                            }}
                            className="w-full h-full object-cover opacity-90"
                          />
                        </div>

                        {/* Text description */}
                        <div className="flex-1 text-left space-y-1">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-1 font-sans">
                            {name}
                          </h4>
                          
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-slate-200"
                              style={{ backgroundColor: item.selectedColor.hex }}
                            />
                            <span className="text-[10px] text-slate-500 font-sans font-medium">
                              {colorName}
                            </span>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            {/* Quantity Toggles */}
                            <div className="flex items-center border border-slate-200 bg-white rounded-lg">
                              <button
                                onClick={() => onUpdateQuantity(idx, item.quantity - 1)}
                                className="px-2 py-1 text-slate-500 hover:text-slate-850 transition-colors cursor-pointer"
                                id={`qty-minus-${idx}`}
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 text-xs text-slate-800 font-mono font-bold">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                                className="px-2 py-1 text-slate-500 hover:text-slate-850 transition-colors cursor-pointer"
                                id={`qty-plus-${idx}`}
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Total price */}
                            <span className="text-xs sm:text-sm font-bold text-[#0066FF] font-mono">
                              {itemSum.toLocaleString()} KRW
                            </span>
                          </div>
                        </div>

                        {/* Delete btn */}
                        <button
                          onClick={() => onRemoveItem(idx)}
                          className="p-1 rounded text-slate-400 hover:text-rose-500 transition-colors shrink-0 cursor-pointer"
                          title="Remove item"
                          id={`cart-remove-${idx}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Sticky Summary & Actions Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-5">
                
                {/* Membership badge reminder */}
                <div className="flex items-start gap-2 p-3 rounded-lg bg-[#0066FF]/5 border border-[#0066FF]/25 text-left">
                  <ShieldAlert className="w-4 h-4 text-[#0066FF] shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-600 leading-normal font-sans">
                    {userSession.isLoggedIn
                      ? (currentLang === 'ko' ? 'VIP 회원이 인증되었습니다. 주문 총합에 10% 상시 웰컴 할인이 적용됩니다.' : 'Đã xác thực VIP. Đơn hàng áp dụng ưu đãi giảm giá VIP 10% đặc biệt.')
                      : (currentLang === 'ko' ? '회원가입/로그인 상태로 결제하시면 10% 금액이 즉시 차감됩니다. (헤더 우측에서 시뮬레이션 가능)' : 'Đăng nhập thành viên trước khi mua để giảm ngay 10% trên tổng giá trị.')}
                  </p>
                </div>

                {/* Calculation breakdown list */}
                <div className="space-y-2 text-sm text-slate-650 font-sans">
                  <div className="flex justify-between">
                    <span>{currentLang === 'ko' ? '제품 합계' : 'Tổng tiền hàng'}</span>
                    <span className="font-mono text-slate-800 font-bold">{subtotal.toLocaleString()} KRW</span>
                  </div>

                  {userSession.isLoggedIn && (
                    <div className="flex justify-between text-[#0066FF] font-semibold">
                      <span>{t.memberDiscount} (-10%)</span>
                      <span className="font-mono">- {discount.toLocaleString()} KRW</span>
                    </div>
                  )}

                  <div className="flex justify-between border-b border-slate-200 pb-3">
                    <span>{t.shippingFee}</span>
                    <span className="text-[#0066FF] font-mono text-xs font-bold">{t.freeShipping}</span>
                  </div>

                  <div className="flex justify-between text-base font-bold text-slate-900 pt-2">
                    <span>{t.total}</span>
                    <span className="text-lg font-black text-[#0066FF] font-mono">{finalTotal.toLocaleString()} KRW</span>
                  </div>
                </div>

                {/* Checkout triggers */}
                <button
                  onClick={onTriggerCheckout}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#00D1FF] hover:opacity-90 text-white text-sm font-extrabold tracking-wide transition-all duration-300 shadow-lg shadow-[#0066FF]/10 cursor-pointer"
                  id="cart-checkout-trigger"
                >
                  {t.checkout}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
