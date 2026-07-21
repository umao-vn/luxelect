import React, { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Video, Save, AlertCircle, Sparkles } from 'lucide-react';
import { Product, CategoryType } from '../types';

interface AdminProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null; // null means "Add New Product"
  onSave: (savedProduct: Product) => void;
  currentLang: 'ko' | 'vi';
}

export default function AdminProductModal({
  isOpen,
  onClose,
  product,
  onSave,
  currentLang,
}: AdminProductModalProps) {
  const isEdit = !!product;

  // Form Fields
  const [category, setCategory] = useState<CategoryType>(product?.category || 'phone');
  const [nameKO, setNameKO] = useState(product?.nameKO || '');
  const [nameVI, setNameVI] = useState(product?.nameVI || '');
  const [tagKO, setTagKO] = useState(product?.tagKO || '');
  const [tagVI, setTagVI] = useState(product?.tagVI || '');
  const [price, setPrice] = useState<number>(product?.price || 100000);
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || '');
  const [videoUrl, setVideoUrl] = useState(product?.videoUrl || '');
  const [descriptionKO, setDescriptionKO] = useState(product?.descriptionKO || '');
  const [descriptionVI, setDescriptionVI] = useState(product?.descriptionVI || '');

  // Drag-and-drop active states
  const [isImgDragActive, setIsImgDragActive] = useState(false);
  const [isVideoDragActive, setIsVideoDragActive] = useState(false);

  // Error/Success Feedback
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);

  // File Inputs references
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle Image File selection/drop
  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadFeedback(currentLang === 'ko' ? '올바른 이미지 파일을 선택해 주세요.' : 'Vui lòng chọn tệp ảnh hợp lệ.');
      return;
    }
    const localUrl = URL.createObjectURL(file);
    setImageUrl(localUrl);
    setUploadFeedback(currentLang === 'ko' ? '로컬 이미지가 임시 업로드되었습니다!' : 'Ảnh nội bộ đã được tải lên tạm thời!');
    setTimeout(() => setUploadFeedback(null), 3000);
  };

  // Handle Video File selection/drop
  const handleVideoFile = (file: File) => {
    if (!file.type.startsWith('video/') && !file.name.endsWith('.mp4')) {
      setUploadFeedback(currentLang === 'ko' ? '올바른 동영상 파일(.mp4 등)을 선택해 주세요.' : 'Vui lòng chọn tệp video (.mp4, v.v.) hợp lệ.');
      return;
    }
    const localUrl = URL.createObjectURL(file);
    setVideoUrl(localUrl);
    setUploadFeedback(currentLang === 'ko' ? '로컬 동영상이 임시 업로드되었습니다!' : 'Video nội bộ đã được tải lên tạm thời!');
    setTimeout(() => setUploadFeedback(null), 3000);
  };

  // Drag events
  const handleDragOver = (e: React.DragEvent, type: 'img' | 'video') => {
    e.preventDefault();
    if (type === 'img') setIsImgDragActive(true);
    else setIsVideoDragActive(true);
  };

  const handleDragLeave = (type: 'img' | 'video') => {
    if (type === 'img') setIsImgDragActive(false);
    else setIsVideoDragActive(false);
  };

  const handleDrop = (e: React.DragEvent, type: 'img' | 'video') => {
    e.preventDefault();
    if (type === 'img') {
      setIsImgDragActive(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleImageFile(file);
    } else {
      setIsVideoDragActive(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleVideoFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nameKO || !nameVI || !imageUrl) {
      alert(currentLang === 'ko' ? '상품 이름과 이미지는 필수 항목입니다.' : 'Tên sản phẩm và hình ảnh là bắt buộc.');
      return;
    }

    const savedProduct: Product = {
      id: product?.id || `lux-custom-${Date.now()}`,
      category,
      nameKO,
      nameVI,
      tagKO: tagKO || (currentLang === 'ko' ? '럭셔리 에디션 테크 디바이스' : 'Thiết bị công nghệ cao cấp'),
      tagVI: tagVI || (currentLang === 'ko' ? '럭셔리 에디션 테크 디바이스' : 'Thiết bị công nghệ cao cấp'),
      price: Number(price),
      rating: product?.rating || 5.0,
      reviewsCount: product?.reviewsCount || 1,
      imageUrl,
      videoUrl: videoUrl || undefined,
      specsKO: product?.specsKO || {
        "제조사": "Lux Electronics (Korea)",
        "품질보증": "VIP 5년 무상 서비스 지원",
        "특징": "고정밀 항공우주 등급 메탈 설계"
      },
      specsVI: product?.specsVI || {
        "Nhà sản xuất": "Lux Electronics (Korea)",
        "Bảo hành": "Hỗ trợ dịch vụ VIP 5 năm",
        "Đặc điểm": "Thiết kế kim loại chuẩn hàng không"
      },
      featuresKO: product?.featuresKO || [
        "최고급 마스터피스 한정판 컬렉션",
        "독보적인 프리미엄 디자인 설계 공정 거침",
        "VIP 고객 전용 라이브 전담 가이드 응대 서비스 제공"
      ],
      featuresVI: product?.featuresVI || [
        "Bộ sưu tập giới hạn Masterpiece cực kỳ đẳng cấp",
        "Trải qua quy trình thiết kế và chế tác thủ công cao cấp nhất",
        "Đội ngũ chuyên viên tư vấn trực tiếp 1:1 tận tâm"
      ],
      descriptionKO: descriptionKO || `${nameKO}는 럭스 일렉트로닉스가 제안하는 최첨단 럭셔리 마스터피스 가전제품입니다. 최고 등급 소재와 설계 철학이 만나 당신의 일상에 격조를 더합니다.`,
      descriptionVI: descriptionVI || `${nameVI} là kiệt tác công nghệ gia dụng cao cấp do Lux Electronics thiết kế, kết hợp vật liệu thượng hạng mang lại sự sang trọng tột cùng cho cuộc sống của bạn.`,
      colors: product?.colors || [
        { nameKO: "럭셔리 플래티넘", nameVI: "Bạch Kim Sang Trọng", hex: "#E5E7EB" },
        { nameKO: "옵시디언 블랙", nameVI: "Đen Tuyển", hex: "#111827" }
      ],
      isNew: product?.isNew !== undefined ? product.isNew : true,
      isBest: product?.isBest !== undefined ? product.isBest : false,
    };

    onSave(savedProduct);
  };

  return (
    <div className="fixed inset-0 z-55 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header bar */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5.5 h-5.5 text-[#0066FF]" />
            <h3 className="text-lg font-bold text-slate-900 font-sans">
              {isEdit 
                ? (currentLang === 'ko' ? '상품 사진 및 동영상 관리' : 'Quản lý ảnh và video sản phẩm')
                : (currentLang === 'ko' ? '새 럭셔리 상품 등록' : 'Thêm sản phẩm Luxury mới')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-850 transition-colors cursor-pointer"
            id="admin-modal-close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-left">
          
          {/* Instructions box */}
          <div className="p-4 bg-[#0066FF]/5 border border-[#0066FF]/25 rounded-2xl flex gap-3">
            <AlertCircle className="w-5 h-5 text-[#0066FF] shrink-0 mt-0.5" />
            <div className="text-xs text-slate-650 leading-relaxed font-sans space-y-1">
              <p>
                <strong>{currentLang === 'ko' ? '💡 관리자 미디어 안내 가이드' : '💡 Hướng dẫn đa phương tiện Admin'}</strong>
              </p>
              <p>
                {currentLang === 'ko'
                  ? '각 상품의 사진 및 동영상은 직접 로컬 파일을 드래그하여 업로드하거나, ImgBB/외부 호스팅의 직접 링크 URL을 입력할 수 있습니다. 로컬 파일을 업로드 시 브라우저 내에 즉시 완벽 반영되며, 영구적인 보관 및 타인 공유를 원하시면 외부 이미지/동영상 주소를 권장합니다.'
                  : 'Ảnh và video sản phẩm có thể được kéo trực tiếp từ máy của bạn hoặc dán liên kết URL ngoài (ImgBB, v.v.). Tải lên tệp nội bộ sẽ hiển thị lập tức, nhưng khuyên dùng URL ngoài để duy trì lâu dài và chia sẻ cho người khác.'}
              </p>
            </div>
          </div>

          {uploadFeedback && (
            <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-semibold animate-pulse text-center">
              {uploadFeedback}
            </div>
          )}

          {/* Core metadata: category, name, price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-500 uppercase font-bold">
                {currentLang === 'ko' ? '카테고리' : 'Danh mục'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-[#0066FF] font-sans cursor-pointer"
              >
                <option value="phone">{currentLang === 'ko' ? '스마트폰 (Phone)' : 'Điện thoại (Phone)'}</option>
                <option value="laptop">{currentLang === 'ko' ? '노트북 (Laptop)' : 'Máy tính (Laptop)'}</option>
                <option value="audio">{currentLang === 'ko' ? '오디오 (Audio)' : 'Âm thanh (Audio)'}</option>
                <option value="display">{currentLang === 'ko' ? '디스플레이 (Display)' : 'Màn hình (Display)'}</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-500 uppercase font-bold">
                {currentLang === 'ko' ? '판매가 (KRW)' : 'Giá bán (KRW)'}
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="1000000"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-[#0066FF] font-sans font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-500 uppercase font-bold">
                {currentLang === 'ko' ? '상품명 (한국어)' : 'Tên sản phẩm (Tiếng Hàn)'}
              </label>
              <input
                type="text"
                required
                value={nameKO}
                onChange={(e) => setNameKO(e.target.value)}
                placeholder="럭스폰 베타"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-[#0066FF] font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-500 uppercase font-bold">
                {currentLang === 'ko' ? '상품명 (베트남어)' : 'Tên sản phẩm (Tiếng Việt)'}
              </label>
              <input
                type="text"
                required
                value={nameVI}
                onChange={(e) => setNameVI(e.target.value)}
                placeholder="LuxPhone Beta"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-[#0066FF] font-sans"
              />
            </div>
          </div>

          {/* Media Sections: Images (Drag/Drop + URL) */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono flex items-center gap-1.5 border-b border-slate-200 pb-2">
              <ImageIcon className="w-4 h-4 text-[#0066FF]" />
              <span>{currentLang === 'ko' ? '1. 대표 상품 이미지 설정' : '1. Thiết lập hình ảnh đại diện'}</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Drag and drop Area */}
              <div
                onDragOver={(e) => handleDragOver(e, 'img')}
                onDragLeave={() => handleDragLeave('img')}
                onDrop={(e) => handleDrop(e, 'img')}
                onClick={() => imageInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                  isImgDragActive 
                    ? 'border-[#0066FF] bg-[#0066FF]/5 scale-[0.99]' 
                    : 'border-slate-200 bg-white hover:border-[#0066FF]/50'
                }`}
              >
                <input
                  type="file"
                  ref={imageInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageFile(file);
                  }}
                  accept="image/*"
                  className="hidden"
                />
                <Upload className="w-8 h-8 text-[#0066FF]" />
                <span className="text-xs font-bold text-slate-750">
                  {currentLang === 'ko' ? '여기에 사진 드래그 또는 클릭' : 'Kéo ảnh vào đây hoặc nhấp chuột'}
                </span>
                <span className="text-[10px] text-slate-400">
                  (JPG, PNG, WEBP, GIF)
                </span>
              </div>

              {/* URL input and Preview */}
              <div className="space-y-3 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-500 uppercase font-bold">
                    {currentLang === 'ko' ? '이미지 웹 주소 (URL)' : 'Đường dẫn ảnh ngoài (URL)'}
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://imgbb.com/direct-link.jpg"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-[#0066FF] font-sans font-mono"
                  />
                </div>

                {imageUrl && (
                  <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-slate-200">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-12 h-12 object-cover rounded-lg border border-slate-100"
                      onError={(e) => {
                        // fallback or notify
                        (e.target as any).src = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=80&q=80";
                      }}
                    />
                    <div className="text-left">
                      <span className="text-[10px] text-emerald-600 font-bold font-mono uppercase block">✔ IMAGE DETECTED</span>
                      <span className="text-[10px] text-slate-400 font-mono line-clamp-1 max-w-[200px]">{imageUrl}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Media Sections: Videos (Drag/Drop + URL) */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono flex items-center gap-1.5 border-b border-slate-200 pb-2">
              <Video className="w-4 h-4 text-[#0066FF]" />
              <span>{currentLang === 'ko' ? '2. 홍보 및 특장점 동영상 설정 (선택)' : '2. Thiết lập video giới thiệu (Tùy chọn)'}</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Drag and drop Area */}
              <div
                onDragOver={(e) => handleDragOver(e, 'video')}
                onDragLeave={() => handleDragLeave('video')}
                onDrop={(e) => handleDrop(e, 'video')}
                onClick={() => videoInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                  isVideoDragActive 
                    ? 'border-[#0066FF] bg-[#0066FF]/5 scale-[0.99]' 
                    : 'border-slate-200 bg-white hover:border-[#0066FF]/50'
                }`}
              >
                <input
                  type="file"
                  ref={videoInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleVideoFile(file);
                  }}
                  accept="video/*"
                  className="hidden"
                />
                <Upload className="w-8 h-8 text-[#0066FF]" />
                <span className="text-xs font-bold text-slate-750">
                  {currentLang === 'ko' ? '여기에 동영상 드래그 또는 클릭' : 'Kéo video vào đây hoặc nhấp chuột'}
                </span>
                <span className="text-[10px] text-slate-400">
                  (MP4, WEBM)
                </span>
              </div>

              {/* URL input and Preview */}
              <div className="space-y-3 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-500 uppercase font-bold">
                    {currentLang === 'ko' ? '동영상 웹 주소 (Direct MP4 URL)' : 'Đường dẫn video ngoài (Direct MP4 URL)'}
                  </label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://example.com/video.mp4"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-[#0066FF] font-sans font-mono"
                  />
                </div>

                {videoUrl && (
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-left">
                    <span className="text-[10px] text-[#0066FF] font-bold font-mono uppercase block">🎬 VIDEO DETECTED</span>
                    <span className="text-[10px] text-slate-500 font-mono line-clamp-1 max-w-[220px]">{videoUrl}</span>
                    <video
                      src={videoUrl}
                      muted
                      className="w-full h-12 object-cover rounded-lg border border-slate-100 mt-1.5"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Optional Tagline and Description */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono border-b border-slate-200 pb-2">
              {currentLang === 'ko' ? '3. 추가 상세 정보 (선택)' : '3. Thông tin bổ sung (Tùy chọn)'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-500 uppercase font-bold">
                  {currentLang === 'ko' ? '한 줄 광고문구 (한국어)' : 'Khẩu hiệu ngắn (Tiếng Hàn)'}
                </label>
                <input
                  type="text"
                  value={tagKO}
                  onChange={(e) => setTagKO(e.target.value)}
                  placeholder="새로운 혁신의 아이콘"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-[#0066FF] font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-500 uppercase font-bold">
                  {currentLang === 'ko' ? '한 줄 광고문구 (베트남어)' : 'Khẩu hiệu ngắn (Tiếng Việt)'}
                </label>
                <input
                  type="text"
                  value={tagVI}
                  onChange={(e) => setTagVI(e.target.value)}
                  placeholder="Biểu tượng của sự đổi mới"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-[#0066FF] font-sans"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-500 uppercase font-bold">
                  {currentLang === 'ko' ? '상세 설명 (한국어)' : 'Mô tả chi tiết (Tiếng Hàn)'}
                </label>
                <textarea
                  rows={3}
                  value={descriptionKO}
                  onChange={(e) => setDescriptionKO(e.target.value)}
                  placeholder="상세한 명품 제품 정보를 입력해 주세요..."
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-[#0066FF] font-sans resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-500 uppercase font-bold">
                  {currentLang === 'ko' ? '상세 설명 (베트남어)' : 'Mô tả chi tiết (Tiếng Việt)'}
                </label>
                <textarea
                  rows={3}
                  value={descriptionVI}
                  onChange={(e) => setDescriptionVI(e.target.value)}
                  placeholder="Nhập mô tả sản phẩm chi tiết..."
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-[#0066FF] font-sans resize-none"
                />
              </div>
            </div>
          </div>

          {/* Action buttons footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 border border-slate-200 hover:bg-slate-50 text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              {currentLang === 'ko' ? '취소' : 'Hủy bỏ'}
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-3 bg-[#0066FF] hover:bg-blue-600 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors shadow-lg cursor-pointer"
              id="admin-submit-btn"
            >
              <Save className="w-4 h-4" />
              <span>{isEdit ? (currentLang === 'ko' ? '변경 사항 저장' : 'Lưu thay đổi') : (currentLang === 'ko' ? '새 상품 등록' : 'Đăng ký sản phẩm')}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
