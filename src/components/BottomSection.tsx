import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Shield, ShieldCheck, HeartHandshake, PhoneCall, ChevronDown, ChevronUp } from 'lucide-react';
import { FAQS } from '../data';
import { TranslationSet } from '../translations';

interface BottomSectionProps {
  t: TranslationSet;
  currentLang: 'ko' | 'vi';
  isDetailActive: boolean;
}

export default function BottomSection({ t, currentLang, isDetailActive }: BottomSectionProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [emailSub, setEmailSub] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailSub.trim()) {
      setIsSubscribed(true);
      setEmailSub('');
      setTimeout(() => setIsSubscribed(false), 5000);
    }
  };

  // If detailed view is active, we cleanly show only the minimalist luxury footer to make the detail view stand out!
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
    <section className="w-full bg-white border-t border-slate-200/80 pt-16">
      {/* 3-Section Segment Indicator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10">
        <div className="inline-block text-[10px] font-mono font-black tracking-widest text-[#0066FF] uppercase px-3 py-1 bg-[#0066FF]/5 border border-[#0066FF]/20 rounded-md">
          [ 03. BOTTOM SECTION / VIP PILLARS & FAQ SERVICES ]
        </div>
      </div>

      {/* 1. Value Proposition Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 pb-16">
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#0066FF] hover:bg-white hover:shadow-md transition-all duration-300 text-left space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#0066FF]/10 border border-[#0066FF]/20 flex items-center justify-center text-[#0066FF]">
            <Shield className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-bold text-slate-800 font-sans">
            {currentLang === 'ko' ? '5년 글로벌 품질 보증' : 'Bảo hành toàn cầu 5 năm'}
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
            {currentLang === 'ko' 
               ? '럭스 일렉트로닉스의 VIP 회원들은 구매하신 제품에 대해 업계 최고 규격인 5개년 무상 부품 보증을 보장받으십니다.'
               : 'Thành viên VIP của Lux Electronics được hưởng chính sách bảo hành linh kiện miễn phí lên đến 5 năm tiêu chuẩn cao nhất.'}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#0066FF] hover:bg-white hover:shadow-md transition-all duration-300 text-left space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#0066FF]/10 border border-[#0066FF]/20 flex items-center justify-center text-[#0066FF]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-bold text-slate-800 font-sans">
            {currentLang === 'ko' ? '무결점 맞춤 완벽배송' : 'Giao hàng cài đặt hoàn hảo'}
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
            {currentLang === 'ko' 
               ? '전문 엔지니어팀이 지정한 장소로 직접 안전 배송 및 정밀 설치를 완료한 후 오작동 점검까지 무상으로 대행해 드립니다.'
               : 'Đội ngũ kỹ sư chuyên nghiệp sẽ giao hàng trực tiếp, lắp đặt chuẩn xác và kiểm tra vận hành hoàn chỉnh miễn phí cho quý khách.'}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#0066FF] hover:bg-white hover:shadow-md transition-all duration-300 text-left space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#0066FF]/10 border border-[#0066FF]/20 flex items-center justify-center text-[#0066FF]">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-bold text-slate-800 font-sans">
            {currentLang === 'ko' ? '1:1 명품 컨설팅 서비스' : 'Dịch vụ tư vấn VIP 1:1'}
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
            {currentLang === 'ko' 
               ? '제품의 작동법, ImgBB 외부 자산 연동 방법, 라이프스타일 가전 배치 가이드 등 전문 인력이 연중무휴 실시간 답변을 대기합니다.'
               : 'Nhân viên tư vấn luôn sẵn sàng giải đáp 24/7 về cách vận hành, tích hợp liên kết ngoài ImgBB hay hướng dẫn bố trí phòng tinh tế.'}
          </p>
        </div>
      </div>

      {/* 2. Interactive FAQs */}
      <div className="bg-slate-50/50 border-t border-b border-slate-200 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 space-y-3">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans">
              {t.faqTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-sans">
              {t.faqDesc}
            </p>
          </div>

          <div className="space-y-4 text-left">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              const question = currentLang === 'ko' ? faq.qKO : faq.qVI;
              const answer = currentLang === 'ko' ? faq.aKO : faq.aVI;

              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:border-[#0066FF] transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none hover:bg-[#0066FF]/5 transition-colors cursor-pointer"
                    id={`faq-btn-${idx}`}
                  >
                    <span className="text-sm sm:text-base font-bold text-slate-700 font-sans pr-4">
                      {question}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#0066FF] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 font-sans">
                      {answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Newsletter and Consultation Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Newsletter Signup */}
        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 text-left space-y-6 shadow-sm">
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
                ? '가전 마스터의 실시간 응대를 받으실 수 있습니다. 구매 전 궁금한 사양이나 맞춤 가전 조율 서비스를 문의하십시오.'
                : 'Nhận tư vấn ngay lập tức từ chuyên gia. Hãy đặt các câu hỏi về thông số sản phẩm hoặc yêu cầu hỗ trợ lắp đặt phù hợp.'}
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
              <span className="w-2 h-2 rounded-full bg-emerald-555 bg-emerald-550 bg-emerald-500 animate-ping" />
              <span>ONLINE AGENTS ACTIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Core Footer */}
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
