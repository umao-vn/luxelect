import React from 'react';
import { Headphones, ShieldCheck, Layers, HelpCircle } from 'lucide-react';
import { TranslationSet } from '../translations';

interface BottomSectionProps {
  t: TranslationSet;
  currentLang: 'ko' | 'vi';
  isDetailActive: boolean;
}

export default function BottomSection({ t, currentLang, isDetailActive }: BottomSectionProps) {
  const isDevEnv = (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') || Boolean((import.meta as any).env?.DEV);

  // If detailed view is active, we cleanly show only the minimalist luxury footer
  if (isDetailActive) {
    return (
      <footer className="w-full bg-slate-50 border-t border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
          <p className="text-xs text-slate-600 tracking-wider uppercase font-mono font-bold text-[#0066FF]">
            {t.brand}
          </p>
          <div className="text-[11px] text-slate-500 max-w-2xl mx-auto font-sans leading-relaxed space-y-1">
            <p>(주)럭스 일렉트로닉스 | 대표자: 김민기 | 사업자등록번호: 310-11-81132</p>
            <p>통신판매업신고: 2025-경기성남-1001호 | 주소: 경기도 성남시 분당구 정자원로 1</p>
            <p className="pt-1">© 2026 LUX ELECTRONICS. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <section className="w-full bg-[#f7f7f7] pt-10">
      {/* Dev Indicator */}
      {isDevEnv && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-6">
          <div className="inline-block text-[10px] font-mono font-black tracking-widest text-[#0066FF] uppercase px-3 py-1 bg-[#0066FF]/5 border border-[#0066FF]/20 rounded-md">
          </div>
        </div>
      )}

      {/* Xiaomi Style Support Section */}
      <div className="bg-[#f7f7f7] py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-12 font-sans tracking-tight">
            {currentLang === 'ko' ? 'LUX ELECTRONICS Support (고객 지원)' : 'LUX ELECTRONICS Support'}
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

          {/* Business Info & Copyright */}
          <div className="text-[11px] text-slate-500 text-center md:text-right font-sans leading-relaxed space-y-1">
            <p>(주)럭스 일렉트로닉스 | 대표자: 김민기 | 사업자등록번호: 310-11-81132</p>
            <p>통신판매업신고: 2025-경기성남-1001호 | 주소: 경기도 성남시 분당구 정자원로 1</p>
            <p className="pt-1">© 2026 LUX ELECTRONICS. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </section>
  );
}

