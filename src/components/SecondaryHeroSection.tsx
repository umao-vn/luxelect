import React, { useState } from 'react';
import { HeroMediaItem, Product } from '../types';
import { TranslationSet } from '../translations';
import { cleanAndConvertImageUrl, DEFAULT_FALLBACK_IMAGE } from '../utils';
import { Image as ImageIcon, Edit3, Trash2, Plus, X, Check } from 'lucide-react';

interface SecondaryHeroSectionProps {
  heroMediaList?: HeroMediaItem[];
  activeMediaId?: string | null;
  onSelectActiveMedia?: (id: string) => void;
  onOpenHeroMediaModal?: (initialTab?: 'split' | 'single') => void;
  onAddHeroMedia?: (newItem: Omit<HeroMediaItem, 'id'>) => void;
  onDeleteHeroMedia?: (id: string) => void;
  onUpdateHeroMedia?: (updatedItem: HeroMediaItem) => void;
  splitBgConfig?: any;
  onUpdateSplitBgConfig?: (newConfig: any) => void;
  t: TranslationSet;
  currentLang: 'ko' | 'vi';
  onScrollToProducts?: () => void;
  onViewProduct?: (productId: string) => void;
  products?: Product[];
  onBannerClick?: () => void;
  isAdmin?: boolean;
  isDev?: boolean;
}

export default function SecondaryHeroSection({
  heroMediaList = [],
  onOpenHeroMediaModal,
  onDeleteHeroMedia,
  onUpdateHeroMedia,
  currentLang = 'ko',
  onScrollToProducts,
  onViewProduct,
  products = [],
  isAdmin = false,
  isDev = false,
}: SecondaryHeroSectionProps) {
  const isDevEnv = (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') || Boolean((import.meta as any).env?.DEV);
  const showAdminUI = Boolean(isAdmin && (isDev || isDevEnv));

  // Edit Modal State
  const [editingItem, setEditingItem] = useState<{
    id?: string;
    type?: 'photo' | 'video';
    index: number;
    url: string;
    titleKO?: string;
    titleVI?: string;
    subtitleKO?: string;
    subtitleVI?: string;
    targetProductId?: string;
  } | null>(null);

  const [urlInput, setUrlInput] = useState('');
  const [titleKOInput, setTitleKOInput] = useState('');
  const [titleVIInput, setTitleVIInput] = useState('');
  const [subtitleKOInput, setSubtitleKOInput] = useState('');
  const [subtitleVIInput, setSubtitleVIInput] = useState('');
  const [targetProductInput, setTargetProductInput] = useState('');

  // Navigation Helper
  const handleNavigate = (productId?: string) => {
    if (productId && onViewProduct) {
      onViewProduct(productId);
    } else if (onScrollToProducts) {
      onScrollToProducts();
    }
  };

  const handleOpenEditModal = (item: HeroMediaItem, index: number, defaultTitle?: string, defaultSub?: string) => {
    setEditingItem({
      id: item.id,
      type: item.type,
      index,
      url: item.url,
      titleKO: item.titleKO || item.title || defaultTitle || '',
      titleVI: item.titleVI || defaultTitle || '',
      subtitleKO: item.subtitleKO || item.subtitle || defaultSub || '',
      subtitleVI: item.subtitleVI || defaultSub || '',
      targetProductId: item.targetProductId || '',
    });

    setUrlInput(item.url || '');
    setTitleKOInput(item.titleKO || item.title || defaultTitle || '');
    setTitleVIInput(item.titleVI || defaultTitle || '');
    setSubtitleKOInput(item.subtitleKO || item.subtitle || defaultSub || '');
    setSubtitleVIInput(item.subtitleVI || defaultSub || '');
    setTargetProductInput(item.targetProductId || '');
  };

  const handleSaveEdit = () => {
    if (!editingItem || !onUpdateHeroMedia) return;

    // 비어있는 언어값이 있다면 다른 입력값이나 기존값으로 채워주는 Fallback 처리
    const finalTitleKO = titleKOInput || titleVIInput || editingItem.titleKO || '';
    const finalTitleVI = titleVIInput || titleKOInput || editingItem.titleVI || '';
    const finalSubKO = subtitleKOInput || subtitleVIInput || editingItem.subtitleKO || '';
    const finalSubVI = subtitleVIInput || subtitleKOInput || editingItem.subtitleVI || '';

    const updated: HeroMediaItem = {
      id: editingItem.id || `media-${Date.now()}`,
      type: editingItem.type || 'photo',
      url: urlInput || DEFAULT_FALLBACK_IMAGE,
      titleKO: finalTitleKO,
      titleVI: finalTitleVI,
      title: currentLang === 'ko' ? finalTitleKO : finalTitleVI,
      subtitleKO: finalSubKO,
      subtitleVI: finalSubVI,
      subtitle: currentLang === 'ko' ? finalSubKO : finalSubVI,
      targetProductId: targetProductInput,
    };

    onUpdateHeroMedia(updated);
    setEditingItem(null);
  };
  // Helper to accurately resolve the matching product for each card
  const getMatchingProduct = (item?: HeroMediaItem, defaultIdx: number = 0): Product | undefined => {
    if (!products || products.length === 0) return undefined;

    // 1. If explicit targetProductId exists and matches a product
    if (item?.targetProductId) {
      const match = products.find((p) => p.id === item.targetProductId);
      if (match) return match;
    }

    // 2. Direct item.id match if item.id equals a product id
    if (item?.id) {
      const match = products.find((p) => p.id === item.id);
      if (match) return match;
    }

    // 3. Match by image URL (if card image matches product imageUrl)
    if (item?.url) {
      const cardImgClean = cleanAndConvertImageUrl(item.url);
      const match = products.find((p) => {
        const pImgClean = cleanAndConvertImageUrl(p.imageUrl);
        return pImgClean === cardImgClean || p.imageUrl === item.url;
      });
      if (match) return match;
    }

    // 4. Match by Title / Name / Subtitle text similarity
    const titleText = (item?.titleKO || item?.titleVI || item?.title || '').toLowerCase();
    const subText = (item?.subtitleKO || item?.subtitleVI || item?.subtitle || '').toLowerCase();
    const combined = `${titleText} ${subText}`.trim();

    if (combined) {
      const nameMatch = products.find((p) => {
        const pKo = (p.nameKO || '').toLowerCase();
        const pVi = (p.nameVI || '').toLowerCase();
        return (
          (pKo && combined.includes(pKo)) ||
          (pKo && titleText.includes(pKo)) ||
          (pKo && pKo.includes(titleText) && titleText.length > 3) ||
          (pVi && combined.includes(pVi)) ||
          (pVi && titleText.includes(pVi))
        );
      });
      if (nameMatch) return nameMatch;

      if (combined.includes('bud') || combined.includes('이어폰') || combined.includes('버즈') || combined.includes('드라이어')) {
        const match = products.find((p) => p.id === 'smarthome-dryer' || p.category === 'audio');
        if (match) return match;
      }
      if (combined.includes('sound') || combined.includes('스피커') || combined.includes('사운드') || combined.includes('공기청정기')) {
        const match = products.find((p) => p.id === 'lux-sound-aura' || p.id === 'smarthome-air' || p.category === 'audio');
        if (match) return match;
      }
    }

    // 5. Default position fallback
    if (defaultIdx === 0) {
      return products.find((p) => p.id === 'lux-sound-aura') || products.find((p) => p.id === 'smarthome-dryer') || products[0];
    } else {
      return (
        products.find((p) => p.id === 'lux-book-pro-16') ||
        products.find((p) => p.id === 'smarthome-air') ||
        products[1] ||
        products[0]
      );
    }
  };

  const getMatchingProductId = (item?: HeroMediaItem, defaultIdx: number = 0): string => {
    return getMatchingProduct(item, defaultIdx)?.id || '';
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Admin Action Bar */}
      {showAdminUI && (
        <div className="flex justify-between items-center bg-slate-900 text-white px-4 py-2.5 rounded-xl mb-6 shadow-md text-xs sm:text-sm">
          <span className="font-semibold flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-orange-400" /> 서브 히어로 섹션 관리자 모드
          </span>
          <button
            onClick={() => onOpenHeroMediaModal?.('split')}
            className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 px-3 py-1.5 rounded-lg text-white font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> 미디어 관리 modal
          </button>
        </div>
      )}

      {/* 2-Column Xiaomi Style Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {Array.from({ length: 2 }).map((_, idx) => {
          const item = heroMediaList[idx];
          const defaultTitle = idx === 0 ? 'Xiaomi Buds 6' : 'Xiaomi Sound Play';
          const defaultSub =
            idx === 0
              ? currentLang === 'ko'
                ? '순수한 사운드, 편안한 착용감'
                : 'Pure sound, pure comfort'
              : currentLang === 'ko'
                ? '비트마다 빛나는 시네마틱 사운드'
                : 'Light up every beat';

          const defaultImage =
            idx === 0
              ? 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800&auto=format&fit=crop'
              : 'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=800&auto=format&fit=crop';

          const cardTitle = item
            ? currentLang === 'ko'
              ? item.titleKO || item.title || item.titleVI || defaultTitle
              : item.titleVI || item.title || item.titleKO || defaultTitle
            : defaultTitle;

          const cardSubtitle = item
            ? currentLang === 'ko'
              ? item.subtitleKO || item.subtitle || item.subtitleVI || defaultSub
              : item.subtitleVI || item.subtitle || item.subtitleKO || defaultSub
            : defaultSub;

          const matchedProduct = getMatchingProduct(item, idx);
          const cardTargetProduct = matchedProduct?.id || item?.targetProductId || 'smarthome-dryer';
          const cardImage = matchedProduct?.imageUrl ? cleanAndConvertImageUrl(matchedProduct.imageUrl) : (item?.url ? cleanAndConvertImageUrl(item.url) : defaultImage);

          return (
            <div
              key={item?.id || `secondary-hero-card-${idx}`}
              onClick={() => handleNavigate(cardTargetProduct)}
              className="relative bg-[#f7f8fa] hover:bg-[#f2f3f5] rounded-[24px] overflow-hidden h-[200px] sm:h-[220px] md:h-[240px] flex flex-row items-center justify-between cursor-pointer group hover:shadow-md transition-all duration-300 border border-gray-100/80"
            >
              {/* Left Image Section */}
              <div style={{ width: '50%', height: '100%' }} className="relative flex-shrink-0 overflow-hidden bg-transparent flex items-center justify-center p-2">
                <img
                  src={cardImage}
                  alt={cardTitle}
                  referrerPolicy="no-referrer"
                  style={{ width: '100%', height: '100%' }}
                  className="object-contain object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Right Text Content Section */}
              <div style={{ width: '50%', height: '100%' }} className="flex flex-col justify-center p-6 sm:p-8 min-w-0">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5 tracking-tight group-hover:text-[#0066FF] transition-colors leading-snug">
                  {cardTitle}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed line-clamp-2">
                  {cardSubtitle}
                </p>
              </div>

              {/* Admin Quick Action Buttons */}
              {showAdminUI && item && (
                <div
                  className="absolute top-3 right-3 z-20 flex items-center gap-1.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(item, idx, cardTitle, cardSubtitle)}
                    className="p-1.5 bg-slate-900/90 hover:bg-black text-white rounded-xl shadow-md transition cursor-pointer"
                    title="수정"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#0066FF]" />
                  </button>
                  {onDeleteHeroMedia && (
                    <button
                      type="button"
                      onClick={() => onDeleteHeroMedia(item.id)}
                      className="p-1.5 bg-red-600/90 hover:bg-red-700 text-white rounded-xl shadow-md transition cursor-pointer"
                      title="삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-gray-900">서브 카드 빠른 수정</h3>
              <button onClick={() => setEditingItem(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">이미지 URL</label>
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">제목 (한국어)</label>
                  <input
                    type="text"
                    value={titleKOInput}
                    onChange={(e) => setTitleKOInput(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">제목 (베트남어)</label>
                  <input
                    type="text"
                    value={titleVIInput}
                    onChange={(e) => setTitleVIInput(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">설명 (한국어)</label>
                  <input
                    type="text"
                    value={subtitleKOInput}
                    onChange={(e) => setSubtitleKOInput(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">설명 (베트남어)</label>
                  <input
                    type="text"
                    value={subtitleVIInput}
                    onChange={(e) => setSubtitleVIInput(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">연결할 상품 (Product ID)</label>
                <select
                  value={targetProductInput}
                  onChange={(e) => setTargetProductInput(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-xs bg-white"
                >
                  <option value="">기본 상품 연결</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      [{p.category}] {p.nameKO || p.nameVI}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6 pt-3 border-t border-gray-100">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                취소
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 text-xs font-medium bg-orange-500 hover:bg-orange-600 text-white rounded-xl flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" /> 저장하기
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}