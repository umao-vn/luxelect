import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2, Image as ImageIcon, Video, Check, Link as LinkIcon, AlertCircle, Edit3, Eye, Upload, FileVideo, FileImage } from 'lucide-react';
import { HeroMediaItem } from '../types';
import { cleanAndConvertImageUrl, cleanAndConvertVideoUrl, DEFAULT_FALLBACK_IMAGE } from '../utils';

interface HeroMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  heroMediaList: HeroMediaItem[];
  activeMediaId: string | null;
  onSelectActiveMedia: (id: string) => void;
  onAddHeroMedia: (newItem: Omit<HeroMediaItem, 'id'>) => void;
  onDeleteHeroMedia: (id: string) => void;
  onUpdateHeroMedia: (updatedItem: HeroMediaItem) => void;
  currentLang: 'ko' | 'vi';
}

export default function HeroMediaModal({
  isOpen,
  onClose,
  heroMediaList,
  activeMediaId,
  onSelectActiveMedia,
  onAddHeroMedia,
  onDeleteHeroMedia,
  onUpdateHeroMedia,
  currentLang,
}: HeroMediaModalProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states for adding/editing
  const [type, setType] = useState<'photo' | 'video'>('photo');
  const [titleKO, setTitleKO] = useState('');
  const [titleVI, setTitleVI] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [formError, setFormError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFileSize, setUploadedFileSize] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Process input URL live
  const processedUrl = type === 'photo'
    ? cleanAndConvertImageUrl(urlInput)
    : cleanAndConvertVideoUrl(urlInput);

  const resetForm = () => {
    setEditingId(null);
    setType('photo');
    setTitleKO('');
    setTitleVI('');
    setUrlInput('');
    setFormError('');
    setUploadedFileName('');
    setUploadedFileSize('');
  };

  const handleStartEdit = (item: HeroMediaItem) => {
    setEditingId(item.id);
    setType(item.type);
    setTitleKO(item.titleKO);
    setTitleVI(item.titleVI);
    setUrlInput(item.url);
    setFormError('');
    setUploadedFileName('');
    setUploadedFileSize('');
  };

  // Direct File Reader Handler for Videos & Photos
  const handleMediaFile = (file: File) => {
    if (!file) return;

    const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|ogg|mov|m4v)$/i.test(file.name);
    const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(file.name);

    if (!isVideo && !isImage) {
      setFormError(
        currentLang === 'ko'
          ? '지원되지 않는 파일 형식입니다. MP4, WEBM, MOV 동영상 또는 JPG, PNG, WEBP 이미지 파일을 선택해 주세요.'
          : 'Định dạng tệp không được hỗ trợ. Vui lòng chọn tệp MP4, WEBM, MOV hoặc JPG, PNG, WEBP.'
      );
      return;
    }

    const detectedType: 'photo' | 'video' = isVideo ? 'video' : 'photo';
    setType(detectedType);

    // Format file size
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    setUploadedFileName(file.name);
    setUploadedFileSize(`${sizeInMB} MB`);

    // Auto-fill title if empty
    const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
    if (!titleKO) setTitleKO(fileNameWithoutExt);
    if (!titleVI) setTitleVI(fileNameWithoutExt);

    // Read file into Data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setUrlInput(e.target.result as string);
        setFormError('');
      }
    };
    reader.onerror = () => {
      setFormError(currentLang === 'ko' ? '파일을 읽는 중 오류가 발생했습니다.' : 'Lỗi đọc tệp.');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) {
      setFormError(currentLang === 'ko' ? '사진 또는 동영상 URL 주소를 입력해 주세요.' : 'Vui lòng nhập đường dẫn URL.');
      return;
    }

    const finalTitleKO = titleKO.trim() || (type === 'photo' ? '상단 스페셜 사진' : '상단 시네마틱 동영상');
    const finalTitleVI = titleVI.trim() || (type === 'photo' ? 'Ảnh đặc biệt Top' : 'Video đặc biệt Top');

    if (editingId) {
      onUpdateHeroMedia({
        id: editingId,
        type,
        titleKO: finalTitleKO,
        titleVI: finalTitleVI,
        url: processedUrl,
      });
    } else {
      onAddHeroMedia({
        type,
        titleKO: finalTitleKO,
        titleVI: finalTitleVI,
        url: processedUrl,
      });
    }

    resetForm();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 my-8 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#0066FF] text-white shadow-md">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold font-sans flex items-center gap-2">
                  <span>{currentLang === 'ko' ? '📷/🎥 상단 배경 미디어 관리자' : '📷/🎥 Quản lý Media Top'}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#0066FF] text-white font-mono uppercase font-semibold">
                    독립 연동 Mode
                  </span>
                </h3>
                <p className="text-xs text-slate-300 font-sans">
                  {currentLang === 'ko'
                    ? '하단 제품 목록과 별개로 상단 섹션에만 노출할 사진 및 동영상 URL을 자유롭게 추가·삭제합니다.'
                    : 'Thêm hoặc xóa riêng URL ảnh/video chỉ hiển thị ở phần trên cùng (độc lập với danh sách bên dưới).'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-grow text-left">
            {/* Registered Media Items List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider font-mono flex items-center gap-2">
                  <span>등록된 상단 미디어 목록 ({heroMediaList.length}개)</span>
                </h4>
                {editingId && (
                  <button
                    onClick={resetForm}
                    className="text-xs text-[#0066FF] hover:underline font-medium font-sans"
                  >
                    {currentLang === 'ko' ? '+ 신규 등록으로 전환' : '+ Chuyển sang thêm mới'}
                  </button>
                )}
              </div>

              {heroMediaList.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 space-y-2">
                  <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs font-bold text-slate-600">
                    {currentLang === 'ko' ? '등록된 상단 미디어가 없습니다.' : 'Chưa có media nào ở phần trên.'}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {currentLang === 'ko' ? '아래 서식에서 사진 또는 동영상 URL을 등록해 보세요.' : 'Hãy thêm URL bên dưới.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
                  {heroMediaList.map((item) => {
                    const isActive = item.id === activeMediaId;
                    return (
                      <div
                        key={item.id}
                        className={`p-3 rounded-2xl border transition-all duration-200 flex items-center gap-3 relative ${
                          isActive
                            ? 'bg-[#0066FF]/5 border-[#0066FF] shadow-sm'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {/* Thumbnail */}
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 flex-shrink-0 relative group">
                          {item.type === 'photo' ? (
                            <img
                              src={item.url}
                              alt={item.titleKO}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
                              }}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <video
                              key={item.id}
                              src={item.url}
                              autoPlay
                              loop
                              muted
                              playsInline
                              onCanPlay={(e) => {
                                (e.currentTarget as HTMLVideoElement).play().catch(() => {});
                              }}
                              className="w-full h-full object-cover"
                            />
                          )}
                          <div className="absolute top-1 left-1 px-1 py-0.5 rounded bg-black/70 text-white text-[8px] font-mono">
                            {item.type === 'photo' ? '📷' : '🎥'}
                          </div>
                        </div>

                        {/* Text Detail */}
                        <div className="flex-grow min-w-0 space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold font-mono uppercase ${
                              item.type === 'photo' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                            }`}>
                              {item.type === 'photo' ? '사진 Photo' : '동영상 Video'}
                            </span>
                            {isActive && (
                              <span className="px-1.5 py-0.5 rounded bg-[#0066FF] text-white text-[9px] font-bold font-mono">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <h5 className="text-xs font-bold text-slate-800 truncate">
                            {currentLang === 'ko' ? item.titleKO : item.titleVI}
                          </h5>
                          <p className="text-[10px] text-slate-400 font-mono truncate max-w-[180px]">
                            {item.url}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-1 items-end flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => onSelectActiveMedia(item.id)}
                            title={currentLang === 'ko' ? '상단 화면에 대표로 노출' : 'Chọn hiển thị chính'}
                            className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                              isActive
                                ? 'bg-[#0066FF] text-white shadow'
                                : 'bg-slate-200 hover:bg-[#0066FF] hover:text-white text-slate-600'
                            }`}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStartEdit(item)}
                            title={currentLang === 'ko' ? '수정' : 'Sửa'}
                            className="p-1.5 rounded-lg bg-slate-200 hover:bg-amber-500 hover:text-white text-slate-600 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteHeroMedia(item.id)}
                            title={currentLang === 'ko' ? '삭제' : 'Xóa'}
                            className="p-1.5 rounded-lg bg-slate-200 hover:bg-rose-600 hover:text-white text-slate-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <hr className="border-slate-200" />

            {/* Add / Edit Form */}
            <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs sm:text-sm font-bold text-slate-800 font-sans flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#0066FF]" />
                  <span>
                    {editingId
                      ? (currentLang === 'ko' ? '✏️ 상단 미디어 정보 수정' : '✏️ Chỉnh sửa Media Top')
                      : (currentLang === 'ko' ? '➕ 상단 미디어 신규 등록 (URL 삽입)' : '➕ Thêm Media Top Mới')}
                  </span>
                </h4>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setType('photo')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold font-sans transition-all flex items-center gap-1.5 ${
                      type === 'photo'
                        ? 'bg-emerald-600 text-white shadow'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>사진 (ImgBB 등)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('video')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold font-sans transition-all flex items-center gap-1.5 ${
                      type === 'video'
                        ? 'bg-purple-600 text-white shadow'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>동영상 (MP4 등)</span>
                  </button>
                </div>
              </div>

              {/* Title Field */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    미디어 제목 (한국어)
                  </label>
                  <input
                    type="text"
                    value={titleKO}
                    onChange={(e) => setTitleKO(e.target.value)}
                    placeholder="예: 메인 시그니처 배너 사진"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#0066FF] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    미디어 제목 (Tiếng Việt)
                  </label>
                  <input
                    type="text"
                    value={titleVI}
                    onChange={(e) => setTitleVI(e.target.value)}
                    placeholder="VD: Ảnh Banner Chính"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#0066FF] bg-white"
                  />
                </div>
              </div>

              {/* Direct File Upload Area (Drag & Drop or Browser File Picker) */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-[#0066FF]" />
                    <span>{currentLang === 'ko' ? '내 컴퓨터에서 동영상 또는 사진 파일 직접 선택 업로드' : 'Tải lên tệp Video hoặc Ảnh từ máy tính'}</span>
                  </span>
                  <span className="text-[10px] text-purple-600 font-bold font-mono">
                    {currentLang === 'ko' ? '★ MP4, WEBM, MOV 동영상 지원' : '★ Hỗ trợ Video MP4, WEBM, MOV'}
                  </span>
                </label>

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleMediaFile(file);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-5 rounded-2xl border-2 border-dashed text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${
                    isDragOver
                      ? 'border-[#0066FF] bg-[#0066FF]/10 scale-[0.99]'
                      : 'border-slate-300 bg-white hover:border-[#0066FF] hover:bg-blue-50/40'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleMediaFile(file);
                    }}
                    accept="video/*,image/*"
                    className="hidden"
                  />

                  <div className="flex items-center justify-center gap-3">
                    <div className="p-3 rounded-2xl bg-purple-100 text-purple-700">
                      <FileVideo className="w-6 h-6" />
                    </div>
                    <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700">
                      <FileImage className="w-6 h-6" />
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-800 font-sans">
                      {currentLang === 'ko'
                        ? '여기에 동영상(MP4) 또는 사진 파일 드래그 / 클릭하여 선택'
                        : 'Kéo thả tệp Video (MP4) hoặc Ảnh vào đây hoặc nhấp chuột'}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {currentLang === 'ko'
                        ? '동영상: MP4, WEBM, MOV / 사진: JPG, PNG, WEBP, GIF'
                        : 'Video: MP4, WEBM, MOV / Ảnh: JPG, PNG, WEBP, GIF'}
                    </p>
                  </div>

                  {uploadedFileName && (
                    <div className="mt-1 px-3 py-1 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 text-xs font-mono font-bold flex items-center gap-2">
                      <span>✓ 선택된 파일: {uploadedFileName}</span>
                      {uploadedFileSize && <span className="text-[10px] opacity-75">({uploadedFileSize})</span>}
                    </div>
                  )}
                </div>
              </div>

              {/* URL Input Field */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <LinkIcon className="w-3 h-3 text-[#0066FF]" />
                    <span>{type === 'photo' ? '또는 사진 웹 URL 주소 (ImgBB 링크 등)' : '또는 동영상 웹 URL 주소 (Direct MP4 URL)'}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {type === 'photo' ? '마크다운, HTML, 일반링크 모두 자동 변환' : '직접 재생 가능한 MP4 URL 입력'}
                  </span>
                </label>
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => {
                    setUrlInput(e.target.value);
                    setFormError('');
                  }}
                  placeholder={type === 'photo' ? 'https://i.ibb.co/... 또는 <img src="...">' : 'https://.../sample.mp4'}
                  className="w-full px-3 py-2.5 text-xs font-mono rounded-xl border border-slate-300 focus:outline-none focus:border-[#0066FF] bg-white shadow-inner"
                />
              </div>

              {/* Quick Preset Buttons for user testing */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[10px] text-slate-400 font-mono">빠른 샘플 채우기:</span>
                <button
                  type="button"
                  onClick={() => {
                    setType('photo');
                    setUrlInput('https://i.ibb.co/DPSdv7wD/No-14-10.png');
                  }}
                  className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-[10px] text-slate-600 hover:text-[#0066FF] hover:border-[#0066FF]"
                >
                  📷 ImgBB 사진 1
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setType('photo');
                    setUrlInput('https://i.ibb.co/Pz4KqM31/dibea.jpg');
                  }}
                  className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-[10px] text-slate-600 hover:text-[#0066FF] hover:border-[#0066FF]"
                >
                  📷 ImgBB 사진 2
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setType('video');
                    setUrlInput('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
                  }}
                  className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-[10px] text-slate-600 hover:text-purple-600 hover:border-purple-600"
                >
                  🎥 샘플 MP4 동영상
                </button>
              </div>

              {/* Realtime Live Preview Box */}
              {urlInput.trim() && (
                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1.5 text-left">
                  <span className="text-[10px] font-bold font-mono uppercase text-[#0066FF] block">
                    LIVE PREVIEW (실시간 미리보기)
                  </span>
                  <div className="w-full h-32 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center relative">
                    {type === 'photo' ? (
                      <img
                        src={processedUrl}
                        alt="Preview"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
                        }}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        key={processedUrl}
                        src={processedUrl}
                        controls
                        autoPlay
                        loop
                        muted
                        playsInline
                        onCanPlay={(e) => {
                          (e.currentTarget as HTMLVideoElement).play().catch(() => {});
                        }}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>
              )}

              {formError && (
                <p className="text-xs text-rose-600 font-bold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{formError}</span>
                </p>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs font-bold"
                  >
                    취소
                  </button>
                )}
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-[#0066FF]/20 flex items-center gap-1.5 transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingId ? '수정사항 저장' : '상단 미디어에 추가하기'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 text-right">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-all"
            >
              닫기 (Close)
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
