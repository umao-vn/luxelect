import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, Landmark, Wallet, CheckCircle, ShieldCheck, ShoppingBag, BadgeHelp, ClipboardCheck } from 'lucide-react';
import { CartItem, UserSession, OrderDetails } from '../types';
import { TranslationSet } from '../translations';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  userSession: UserSession;
  onToggleUserSession: () => void;
  onClearCart: () => void;
  t: TranslationSet;
  currentLang: 'ko' | 'vi';
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  userSession,
  onToggleUserSession,
  onClearCart,
  t,
  currentLang,
}: CheckoutModalProps) {
  // Input fields state
  const [fullName, setFullName] = useState(userSession.name || '');
  const [email, setEmail] = useState(userSession.email || '');
  const [phone, setPhone] = useState(userSession.phone || '');
  const [address, setAddress] = useState(userSession.address || '');
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'card' | 'wallet'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<OrderDetails | null>(null);

  if (!isOpen) return null;

  // Calculate Subtotal and Totals
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discount = userSession.isLoggedIn ? Math.round(subtotal * 0.1) : 0;
  const finalTotal = subtotal - discount;

  // Handle Checkout submission
  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim() || !address.trim()) return;

    setIsProcessing(true);

    // Simulate luxury verification delays
    setTimeout(() => {
      // Create random simulated order details
      const randomOrderNumber = `LUX-${new Date().toISOString().replace(/[-:T]/g, '').slice(0, 12)}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      const order: OrderDetails = {
        id: randomOrderNumber,
        userSession: {
          isLoggedIn: userSession.isLoggedIn,
          userType: userSession.isLoggedIn ? 'member' : 'guest',
          name: fullName,
          email,
          phone,
          address,
        },
        items: [...cartItems],
        totalAmount: finalTotal,
        paymentMethod: paymentMethod === 'bank' ? t.bankTransfer : paymentMethod === 'card' ? t.creditCard : t.eWallet,
        orderDate: new Date().toLocaleString(),
        status: 'completed',
      };

      setCompletedOrder(order);
      setIsProcessing(false);
    }, 1500);
  };

  const handleFinishCheckout = () => {
    onClearCart();
    setCompletedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,102,255,0.03)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative w-full max-w-5xl bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header bar */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5.5 h-5.5 text-[#0066FF]" />
            <h3 className="text-lg font-bold text-slate-900 font-sans">{t.checkout}</h3>
          </div>
          
          {!completedOrder && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              id="checkout-close-btn"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content Panel Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {!completedOrder ? (
              // STEP 1: Billing Form and Order Summary Split View
              <motion.div
                key="form-step"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
              >
                {/* Left Side (7 cols): User info & credentials selection */}
                <form onSubmit={handleSubmitPayment} className="lg:col-span-7 space-y-6 text-left">
                  
                  {/* Member / Guest Quick Selector Indicator banner */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#0066FF] animate-ping" />
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-sans">
                          {userSession.isLoggedIn ? t.memberLogin : t.nonMemberCheckout}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-600 max-w-md font-sans">
                        {userSession.isLoggedIn ? t.loginSuccess : t.guestNotice}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={onToggleUserSession}
                      className="px-4 py-2 rounded-xl border border-slate-200 hover:border-[#0066FF] bg-white text-xs text-[#0066FF] font-semibold transition-colors shrink-0 cursor-pointer"
                      id="checkout-auth-toggle-btn"
                    >
                      {userSession.isLoggedIn ? t.logout : t.memberLogin.split(' ')[0]}
                    </button>
                  </div>

                  {/* Shipping credentials inputs */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-sans border-b border-slate-200 pb-2">
                      {currentLang === 'ko' ? '배송지 정보 입력' : 'Thông tin người nhận'}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name input */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono text-slate-500 uppercase font-bold">{t.fullName}</label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Jane Doe"
                          className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-[#0066FF] font-sans"
                          id="checkout-name-input"
                        />
                      </div>

                      {/* Phone input */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono text-slate-500 uppercase font-bold">{t.phone}</label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="010-XXXX-XXXX"
                          className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-[#0066FF] font-sans"
                          id="checkout-phone-input"
                        />
                      </div>
                    </div>

                    {/* Email input */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-slate-500 uppercase font-bold">{t.email}</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-[#0066FF] font-sans"
                        id="checkout-email-input"
                      />
                    </div>

                    {/* Address input */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-slate-500 uppercase font-bold">{t.address}</label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder={currentLang === 'ko' ? "서울특별시 강남구 테헤란로..." : "Địa chỉ cụ thể, Quận, Thành phố..."}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-[#0066FF] font-sans"
                        id="checkout-address-input"
                      />
                    </div>
                  </div>

                  {/* Payment method selector */}
                  <div className="space-y-4 pt-4">
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-sans border-b border-slate-200 pb-2">
                      {t.paymentMethod}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Credit Card option */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-4 rounded-xl border text-left flex flex-col justify-between h-24 transition-all duration-300 cursor-pointer ${
                          paymentMethod === 'card'
                            ? 'border-[#0066FF] bg-[#0066FF]/5 text-[#0066FF] shadow-sm shadow-[#0066FF]/5'
                            : 'border-slate-200 bg-white text-slate-500 hover:text-[#0066FF] hover:border-[#0066FF]'
                        }`}
                        id="pay-method-card"
                      >
                        <CreditCard className="w-5 h-5 text-[#0066FF]" />
                        <div>
                          <span className="text-xs sm:text-sm font-bold block">{t.creditCard.split(' ')[0]}</span>
                          <span className="text-[9px] text-slate-400 block font-mono">Secure API Gateway</span>
                        </div>
                      </button>

                      {/* Bank transfer option */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('bank')}
                        className={`p-4 rounded-xl border text-left flex flex-col justify-between h-24 transition-all duration-300 cursor-pointer ${
                          paymentMethod === 'bank'
                            ? 'border-[#0066FF] bg-[#0066FF]/5 text-[#0066FF] shadow-sm shadow-[#0066FF]/5'
                            : 'border-slate-200 bg-white text-slate-500 hover:text-[#0066FF] hover:border-[#0066FF]'
                        }`}
                        id="pay-method-bank"
                      >
                        <Landmark className="w-5 h-5 text-[#0066FF]" />
                        <div>
                          <span className="text-xs sm:text-sm font-bold block">{t.bankTransfer.split(' ')[0]}</span>
                          <span className="text-[9px] text-slate-400 block font-mono">Virtual Account</span>
                        </div>
                      </button>

                      {/* Mobile Wallet option */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('wallet')}
                        className={`p-4 rounded-xl border text-left flex flex-col justify-between h-24 transition-all duration-300 cursor-pointer ${
                          paymentMethod === 'wallet'
                            ? 'border-[#0066FF] bg-[#0066FF]/5 text-[#0066FF] shadow-sm shadow-[#0066FF]/5'
                            : 'border-slate-200 bg-white text-slate-500 hover:text-[#0066FF] hover:border-[#0066FF]'
                        }`}
                        id="pay-method-wallet"
                      >
                        <Wallet className="w-5 h-5 text-[#0066FF]" />
                        <div>
                          <span className="text-xs sm:text-sm font-bold block">{t.eWallet.split(' ')[0]}</span>
                          <span className="text-[9px] text-slate-400 block font-mono">Instant QR Pay</span>
                        </div>
                      </button>
                    </div>

                    {paymentMethod === 'bank' && (
                      <p className="text-[11px] text-[#0066FF] font-semibold font-sans leading-normal">
                        ℹ️ {t.bankTransferDesc}
                      </p>
                    )}
                  </div>

                  {/* Complete Payment Button */}
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#00D1FF] text-white text-sm font-black tracking-wide transition-all duration-300 shadow-xl shadow-[#0066FF]/10 flex items-center justify-center gap-2"
                    id="submit-payment-btn"
                  >
                    {isProcessing ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{currentLang === 'ko' ? 'VIP 안전결제망 연결 중...' : 'Đang xử lý thanh toán...'}</span>
                      </>
                    ) : (
                      <span>{t.completePayment}</span>
                    )}
                  </button>

                </form>

                {/* Right Side (5 cols): Order Summary Items List */}
                <div className="lg:col-span-5 bg-slate-50 border border-slate-200 p-6 rounded-3xl space-y-6 text-left">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-sans border-b border-slate-200 pb-2">
                    {currentLang === 'ko' ? '구매 상품 내역' : 'Giỏ hàng đặt mua'}
                  </h4>

                  <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2">
                    {cartItems.map((item, idx) => {
                      const name = currentLang === 'ko' ? item.product.nameKO : item.product.nameVI;
                      const colName = currentLang === 'ko' ? item.selectedColor.nameKO : item.selectedColor.nameVI;
                      
                      return (
                        <div key={idx} className="flex gap-3 items-center border-b border-slate-200 pb-3">
                          <img
                            src={item.product.imageUrl}
                            alt={name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 object-cover bg-white border border-slate-200 rounded shrink-0"
                          />
                          <div className="flex-1 text-xs">
                            <span className="font-bold text-slate-800 block line-clamp-1 font-sans">{name}</span>
                            <span className="text-[10px] text-slate-500 font-sans">
                              {colName} · Qty: {item.quantity}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-[#0066FF] font-mono">
                            {(item.product.price * item.quantity).toLocaleString()} KRW
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Calculations summary */}
                  <div className="space-y-2 text-xs sm:text-sm text-slate-600 font-sans">
                    <div className="flex justify-between">
                      <span>{currentLang === 'ko' ? '정가 합계' : 'Tổng giá gốc'}</span>
                      <span className="font-mono text-slate-800 font-bold">{subtotal.toLocaleString()} KRW</span>
                    </div>

                    {userSession.isLoggedIn && (
                      <div className="flex justify-between text-[#0066FF] font-semibold">
                        <span>{t.memberDiscount} (-10%)</span>
                        <span className="font-mono">- {discount.toLocaleString()} KRW</span>
                      </div>
                    )}

                    <div className="flex justify-between border-b border-slate-200 pb-3 text-xs">
                      <span>{t.shippingFee}</span>
                      <span className="text-[#0066FF] font-bold">{t.freeShipping}</span>
                    </div>

                    <div className="flex justify-between text-slate-900 font-extrabold text-sm sm:text-base pt-2">
                      <span>{t.total}</span>
                      <span className="text-lg font-black text-[#0066FF] font-mono">
                        {finalTotal.toLocaleString()} KRW
                      </span>
                    </div>
                  </div>

                  {/* Secure payment shield badge */}
                  <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center gap-2.5 shadow-sm">
                    <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span className="text-[10px] text-slate-500 font-sans">
                      {currentLang === 'ko'
                        ? '128비트 최고 보안 규격 가상 SSL 터널 및 정밀 안심 결제 게이트웨이가 작동 중입니다.'
                        : 'Hệ thống bảo mật SSL 128-bit bảo đảm giao dịch tuyệt đối bí mật và an toàn.'}
                    </span>
                  </div>

                </div>
              </motion.div>
            ) : (
              // STEP 2: Beautiful Payment Success Receipt
              <motion.div
                key="success-step"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-xl mx-auto text-center space-y-8 py-8"
              >
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/5">
                  <CheckCircle className="w-9 h-9" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900 font-sans">{t.paymentSuccess}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans max-w-md mx-auto">
                    {t.paymentSuccessDesc}
                  </p>
                </div>

                {/* Digital Invoice Box */}
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-4">
                  <div className="flex justify-between border-b border-slate-200 pb-3">
                    <span className="text-xs text-slate-500 font-sans flex items-center gap-1">
                      <ClipboardCheck className="w-3.5 h-3.5 text-[#0066FF]" /> {t.orderNumber}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#0066FF] select-all">
                      {completedOrder.id}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs sm:text-sm text-slate-650 font-sans">
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t.fullName}</span>
                      <span className="font-semibold text-slate-800">{completedOrder.userSession.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t.phone}</span>
                      <span className="font-mono text-slate-800">{completedOrder.userSession.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t.email}</span>
                      <span className="font-mono text-slate-600">{completedOrder.userSession.email}</span>
                    </div>
                    <div className="flex flex-col text-left border-t border-slate-200 pt-2.5">
                      <span className="text-slate-500 text-xs">{t.address}</span>
                      <span className="text-xs text-slate-700 mt-1">{completedOrder.userSession.address}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-2.5">
                      <span className="text-slate-500">{currentLang === 'ko' ? '결제 수단' : 'Phương thức'}</span>
                      <span className="text-slate-700 font-bold">{completedOrder.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-slate-900 border-t border-slate-200 pt-3">
                      <span>{t.total}</span>
                      <span className="text-[#0066FF] font-mono font-black">
                        {completedOrder.totalAmount.toLocaleString()} KRW
                      </span>
                    </div>
                  </div>

                  {paymentMethod === 'bank' && (
                    <div className="p-3 rounded-lg bg-[#0066FF]/5 border border-[#0066FF]/25 text-xs text-[#0066FF] font-sans space-y-1">
                      <strong className="block">🏦 {currentLang === 'ko' ? '가상 입금 계좌 안내' : 'Tài khoản chuyển khoản ảo'}</strong>
                      <p>{currentLang === 'ko' ? '우리은행: 1002-999-XXXXXX' : 'VietinBank: 101-999-XXXXXX'}</p>
                      <p>{currentLang === 'ko' ? '예금주: (주)럭스일렉트로닉스' : 'Chủ tài khoản: LUX ELECTRONICS'}</p>
                      <p className="text-[10px] text-slate-500">
                        {currentLang === 'ko' ? '30분 내에 미입금 시 자동 주문 취소됩니다.' : 'Đơn hàng tự động hủy nếu quá 30 phút chưa chuyển khoản.'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Continue Shopping button */}
                <button
                  onClick={handleFinishCheckout}
                  className="w-full py-3.5 rounded-xl bg-[#0066FF] hover:bg-blue-500 text-white text-sm font-bold tracking-wide transition-colors"
                  id="checkout-finish-btn"
                >
                  {t.backToHome}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
