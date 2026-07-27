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
    <section className="w-full bg-[#f7f7f7]">
      {/* Core Footer */}
      <footer className="w-full bg-slate-50 border-t border-slate-200 py-12">
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

