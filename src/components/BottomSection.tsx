import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Headphones, ShieldCheck, Layers, HelpCircle, PhoneCall } from 'lucide-react';
import { TranslationSet } from '../translations';

interface BottomSectionProps {
  t: TranslationSet;
  currentLang: 'ko' | 'vi';
  isDetailActive: boolean;
}

export default function BottomSection({ t, currentLang, isDetailActive }: BottomSectionProps) {
  const [emailSub, setEmailSub] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const isDevEnv = (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') || Boolean((import.meta as any).env?.DEV);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailSub.trim()) {
      setIsSubscribed(true);
      setEmailSub('');
      setTimeout(() => setIsSubscribed(false), 5000);
    }
  };

  // If detailed view is active, we cleanly show only the minimalist luxury footer
  if (isDetailActive) {
    return (
      <footer className="w-full bg-slate-50 border-t border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <p className="text-xs text-slate-600 tracking-wider uppercase font-mono font-bold text-[#0066FF]">
            {t.brand} · Dedicated Masterpiece Detail Screen
          </p>
          <p className="text-[11px] text-slate-500 max-w-2xl mx-auto font-sans leading-relaxed">
            {t.copyright}
          </p>
        </div>
      </footer>
    );
  }

  return (
    <section className="w-full bg-[#f7f7f7] border-t border-slate-200/80 pt-10">
      {/* Dev Indicator */}
      {isDevEnv && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-6">
          <div className="inline-block text-[10px] font-mono font-black tracking-widest text-[#0066FF] uppercase px-3 py-1 bg-[#0066FF]/5 border border-[#0066FF]/20 rounded-md">
            [ 03. BOTTOM SECTION / XIAOMI SUPPORT ]
          </div>
        </div>
      )}

      {/* Xiaomi Style Support Section */}
      <div className="bg-[#f7f7f7] py-16 border-t border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-12 font-sans tracking-tight">
            {currentLang === 'ko' ? 'Xiaomi Support (고객 지원)' : 'Xiaomi Support'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {/* 1. Customer Support */}
            <div className="flex flex-col items-center text-center group cursor-pointer">
              <div className="w-16 h-16 flex items-center justify-center text-slate-700 group-hover:text-[#0066FF] transition-colors mb-4">
                <Headphones className="w-12 h-12 stroke-[1.5]" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2 font-sans">
                {currentLang === 'ko' ? 'Customer Support' : 'Customer Support'}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-sans max-w-[220px]">
                {currentLang === 'ko' 
                  ? '실시간 채팅, 이메일, 전화 상담을 통한 빠른 지원' 
                  : 'Contact us via live-chat, email, and phone call'}
              </p>
            </div>

            {/* 2. Warranty */}
            <div className="flex flex-col items-center text-center group cursor-pointer">
              <div className="w-16 h-16 flex items-center justify-center text-slate-700 group-hover:text-[#0066FF] transition-colors mb-4">
                <ShieldCheck className="w-12 h-12 stroke-[1.5]" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2 font-sans">
                {currentLang === 'ko' ? 'Warranty' : 'Warranty'}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-sans max-w-[220px]">
                {currentLang === 'ko' 
                  ? '공식 정품 보증 및 안심 무상 A/S 정책 제공' 
                  : 'Local warranty policy protection is provided'}
              </p>
            </div>

            {/* 3. User Guides */}
            <div className="flex flex-col items-center text-center group cursor-pointer">
              <div className="w-16 h-16 flex items-center justify-center text-slate-700 group-hover:text-[#0066FF] transition-colors mb-4">
                <Layers className="w-12 h-12 stroke-[1.5]" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2 font-sans">
                {currentLang === 'ko' ? 'User Guides' : 'User Guides'}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-sans max-w-[220px]">
                {currentLang === 'ko' 
                  ? '제품별 사용자 가이드 확인 및 다운로드' 
                  : 'Find and download your Xiaomi product user guide'}
              </p>
            </div>

            {/* 4. FAQ */}
            <div className="flex flex-col items-center text-center group cursor-pointer">
              <div className="w-16 h-16 flex items-center justify-center text-slate-700 group-hover:text-[#0066FF] transition-colors mb-4">
                <HelpCircle className="w-12 h-12 stroke-[1.5]" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2 font-sans">
                FAQ
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-sans max-w-[220px]">
                {currentLang === 'ko' 
                  ? '제품 관련 자주 묻는 질문 검색 및 정보 안내' 
                  : 'Search for help about Xiaomi'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter and Consultation Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Newsletter Signup */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 text-left space-y-6 shadow-sm">
          <div className="space-y-2">
            <h4 className="text-xl font-bold text-slate-900 font-sans">{t.newsletterTitle}</h4>
            <p className="text-xs sm:text-sm text-slate-600 font-sans">{t.newsletterDesc}</p>
          </div>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={emailSub}
              onChange={(e) => setEmailSub(e.target.value)}
              placeholder="name@luxury-brand.com"
              className="flex-1 px-4 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-[#0066FF] text-slate-800 text-sm font-sans"
              required
              id="newsletter-email-input"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#0066FF] hover:bg-blue-500 text-white text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center justify-center gap-2 cursor-pointer"
              id="newsletter-sub-btn"
            >
              <Mail className="w-4 h-4" />
              <span>{t.subscribe}</span>
            </button>
          </form>

          {isSubscribed && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-[#0066FF] font-semibold font-sans"
            >
              {currentLang === 'ko' 
                ? '구독해주셔서 감사합니다! VIP 전용 특별 혜택 메일이 곧 발송됩니다.'
                : 'Cảm ơn bạn đã đăng ký! Thư mời đặc quyền VIP sẽ sớm được gửi tới email của bạn.'}
            </motion.p>
          )}
        </div>

        {/* 1:1 Live consult Action panel */}
        <div className="text-left space-y-6 lg:pl-6">
          <div className="space-y-2">
            <h4 className="text-xl font-bold text-slate-900 font-sans">{t.contactUs}</h4>
            <p className="text-xs sm:text-sm text-slate-600 font-sans">
              {currentLang === 'ko'
                ? '실시간 상담을 받으실 수 있습니다. 궁금한 사양이나 맞춤 조율 서비스를 문의하십시오.'
                : 'Nhận tư vấn ngay lập tức từ chuyên gia. Hãy đặt các câu hỏi về thông số sản phẩm hoặc yêu cầu hỗ trợ.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-left">
            <a
              href="tel:16000000"
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#0066FF] text-sm font-semibold text-slate-750 hover:text-[#0066FF] hover:bg-white hover:shadow-sm transition-all"
              id="call-consult-btn"
            >
              <PhoneCall className="w-4 h-4 text-[#0066FF]" />
              <span>{currentLang === 'ko' ? '대표 번호 연결 (1600-0000)' : 'Tổng đài VIP (1600-0000)'}</span>
            </a>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>ONLINE AGENTS ACTIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Core Footer */}
      <footer className="w-full bg-slate-50 border-t border-slate-200 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-[#0066FF] to-[#00D1FF] text-white rounded flex items-center justify-center font-mono font-extrabold text-sm">
              L
            </div>
            <span className="text-sm font-extrabold tracking-widest text-slate-700 font-sans">
              {t.brand}
            </span>
          </div>

          {/* Copyright description */}
          <p className="text-[11px] text-slate-500 max-w-xl text-center md:text-right font-sans leading-relaxed">
            {t.copyright}
          </p>
        </div>
      </footer>
    </section>
  );
}

