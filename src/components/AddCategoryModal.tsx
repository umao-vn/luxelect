import React, { useState } from 'react';
import { X, FolderPlus, Sparkles, Plus, Check } from 'lucide-react';
import { CategoryItem } from '../types';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCategory: (category: CategoryItem) => void;
  currentLang: 'ko' | 'vi';
  existingCategories: CategoryItem[];
}

const PRESET_CATEGORIES: { id: string; labelKO: string; labelVI: string; icon: string }[] = [
  { id: 'watch', labelKO: '스마트 워치', labelVI: 'Đồng hồ thông minh', icon: '⌚' },
  { id: 'tablet', labelKO: '태블릿', labelVI: 'Máy tính bảng', icon: '📱' },
  { id: 'smarthome', labelKO: '스마트 홈', labelVI: 'Nhà thông minh', icon: '🏠' },
  { id: 'accessory', labelKO: '액세서리', labelVI: 'Phụ kiện cao cấp', icon: '⚡' },
  { id: 'camera', labelKO: '카메라/드론', labelVI: 'Máy ảnh & Drone', icon: '📷' },
  { id: 'gaming', labelKO: '게이밍/VR', labelVI: 'Thiết bị Gaming & VR', icon: '🎮' },
];

export default function AddCategoryModal({
  isOpen,
  onClose,
  onAddCategory,
  currentLang,
  existingCategories,
}: AddCategoryModalProps) {
  const [labelKO, setLabelKO] = useState('');
  const [labelVI, setLabelVI] = useState('');
  const [customId, setCustomId] = useState('');
  const [isAdminOnly, setIsAdminOnly] = useState(false);

  if (!isOpen) return null;

  const handleApplyPreset = (preset: { id: string; labelKO: string; labelVI: string }) => {
    setCustomId(preset.id);
    setLabelKO(preset.labelKO);
    setLabelVI(preset.labelVI);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedKO = labelKO.trim();
    const trimmedVI = labelVI.trim() || trimmedKO;
    
    // Auto-generate ID if empty
    let id = customId.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (!id) {
      id = `cat-${Date.now()}`;
    }

    if (!trimmedKO) {
      alert(currentLang === 'ko' ? '카테고리 이름을 입력해 주세요.' : 'Vui lòng nhập tên danh mục.');
      return;
    }

    // Check duplicate
    if (existingCategories.some((c) => c.id === id)) {
      alert(currentLang === 'ko' ? '이미 존재하는 카테고리 ID입니다.' : 'Mã danh mục này đã tồn tại.');
      return;
    }

    const newCategory: CategoryItem = {
      id,
      labelKO: trimmedKO,
      labelVI: trimmedVI,
      isAdminOnly,
    };

    onAddCategory(newCategory);
    setLabelKO('');
    setLabelVI('');
    setCustomId('');
    setIsAdminOnly(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-55 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header bar */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <FolderPlus className="w-5.5 h-5.5 text-[#0066FF]" />
            <h3 className="text-lg font-bold text-slate-900 font-sans">
              {currentLang === 'ko' ? '새 제품 카테고리 추가' : 'Thêm danh mục sản phẩm mới'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-850 transition-colors cursor-pointer"
            id="close-add-category-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 text-left">
          
          {/* Preset Buttons */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono text-slate-500 uppercase font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#0066FF]" />
              <span>{currentLang === 'ko' ? '추천 프리셋 빠른 선택' : 'Chọn nhanh danh mục mẫu'}</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_CATEGORIES.map((preset) => {
                const isSelected = customId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-sm font-semibold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-[#0066FF] hover:bg-[#0066FF]/5'
                    }`}
                  >
                    <span>{preset.icon}</span>
                    <span>{currentLang === 'ko' ? preset.labelKO : preset.labelVI}</span>
                    {isSelected && <Check className="w-3 h-3 ml-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-4">
            {/* Category Label KO */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-500 uppercase font-bold">
                {currentLang === 'ko' ? '카테고리명 (한국어) *' : 'Tên danh mục (Tiếng Hàn) *'}
              </label>
              <input
                type="text"
                required
                value={labelKO}
                onChange={(e) => {
                  setLabelKO(e.target.value);
                  if (!customId) {
                    setCustomId(`cat-${Date.now().toString().slice(-4)}`);
                  }
                }}
                placeholder={currentLang === 'ko' ? '예: 스마트 워치, 액세서리' : 'Ví dụ: 스마트 워치'}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-[#0066FF] font-sans"
              />
            </div>

            {/* Category Label VI */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-500 uppercase font-bold">
                {currentLang === 'ko' ? '카테고리명 (베트남어)' : 'Tên danh mục (Tiếng Việt)'}
              </label>
              <input
                type="text"
                value={labelVI}
                onChange={(e) => setLabelVI(e.target.value)}
                placeholder={currentLang === 'ko' ? '예: Đồng hồ thông minh' : 'Ví dụ: Đồng hồ thông minh'}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-[#0066FF] font-sans"
              />
            </div>

            {/* Custom Category ID (Slug) */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-500 uppercase font-bold flex items-center justify-between">
                <span>{currentLang === 'ko' ? '카테고리 ID (영문/숫자 식별자)' : 'Mã danh mục (ID Slug)'}</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  {currentLang === 'ko' ? '비워두면 자동 생성' : 'Tự động tạo nếu bỏ trống'}
                </span>
              </label>
              <input
                type="text"
                value={customId}
                onChange={(e) => setCustomId(e.target.value)}
                placeholder="예: smartwatch, smarthome, accessory"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm focus:outline-none focus:border-[#0066FF] font-mono"
              />
            </div>

            {/* Admin Only Toggle Checkbox */}
            <div className="pt-2">
              <label className="flex items-center gap-2.5 p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-2xl cursor-pointer hover:bg-amber-100/60 transition-colors">
                <input
                  type="checkbox"
                  checked={isAdminOnly}
                  onChange={(e) => setIsAdminOnly(e.target.checked)}
                  className="w-4 h-4 text-[#0066FF] border-slate-300 rounded focus:ring-[#0066FF] cursor-pointer"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-800 block">
                    {currentLang === 'ko' ? '🔒 관리자 전용 카테고리 (외부/Netlify 고객 접속시 숨김)' : '🔒 Danh mục chỉ dành cho Admin (Ẩn với khách)'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {currentLang === 'ko' ? '체크하면 관리자 모드에서만 보이고 외부 고객 화면에서는 감춰집니다.' : 'Ẩn khỏi người dùng thông thường khi không ở chế độ Admin.'}
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              {currentLang === 'ko' ? '취소' : 'Hủy bỏ'}
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2.5 bg-[#0066FF] hover:bg-blue-600 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors shadow-lg cursor-pointer"
              id="submit-new-category-btn"
            >
              <Plus className="w-4 h-4" />
              <span>{currentLang === 'ko' ? '카테고리 생성' : 'Tạo danh mục'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
