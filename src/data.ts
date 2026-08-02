import { Product, HeroMediaItem, SubBgMediaItem, SplitBgConfig, CategorySubMenu } from './types';
import { cleanAndConvertImageUrl, cleanAndConvertVideoUrl } from './utils';

export const DEFAULT_SPLIT_BG_CONFIG: SplitBgConfig = {
  isEnabled: false,
  panels: [
    {
      id: 'panel-1',
      type: 'photo',
      url: 'https://i.ibb.co/DPSdv7wD/No-14-10.png',
      titleKO: '패널 01: 모션 시네마 비주얼',
      titleVI: 'Bảng 01: Điện Ảnh Chuyển Động',
      tagKO: 'PANEL 01 / TOP',
      tagVI: 'BẢNG 01 / TRÊN',
    },
    {
      id: 'panel-2',
      type: 'photo',
      url: 'https://i.ibb.co/F4XxSjPM/vn-feature-nbsp-549228901.jpg',
      titleKO: '패널 02: 마스터피스 하드웨어',
      titleVI: 'Bảng 02: Phần Cứng Thông Minh',
      tagKO: 'PANEL 02 / MIDDLE',
      tagVI: 'BẢNG 02 / GIỮA',
    },
    {
      id: 'panel-3',
      type: 'photo',
      url: 'https://i.ibb.co/F4XxSjPM/vn-feature-nbsp-549228901.jpg',
      titleKO: '패널 03: 미래형 하이테크 테크놀로지',
      titleVI: 'Bảng 03: Công Nghệ Tương Lai',
      tagKO: 'PANEL 03 / BOTTOM',
      tagVI: 'BẢNG 03 / DƯỚI',
    }
  ]
};

export const DEFAULT_HERO_MEDIA: HeroMediaItem[] = [
  {
    id: 'hero-media-1',
    type: 'photo',
    titleKO: '상단 브랜드 비주얼 메인 사진',
    titleVI: 'Ảnh Thương Hiệu Chính Top',
    url: 'https://i.ibb.co/DPSdv7wD/No-14-10.png'
  },
  {
    id: 'hero-media-2',
    type: 'video',
    titleKO: '상단 시네마틱 브랜드 영상 (MP4)',
    titleVI: 'Video Điện Ảnh Top (MP4)',
    url: 'https://files.catbox.moe/l21bbv.mp4'
  }
];

export const DEFAULT_SECONDARY_HERO_MEDIA: HeroMediaItem[] = [
  {
    id: 'sec-hero-media-1',
    type: 'photo',
    titleKO: 'Feel Every beat',
    titleVI: 'lux samsung sound',
    subtitleKO: 'Saumsung Audio',
    subtitleVI: 'Pure sound, pure comfort',
    url: 'https://i.ibb.co/F4XxSjPM/vn-feature-nbsp-549228901.jpg',
    targetProductId: 'lux-sound-aura'
  },
  {
    id: 'sec-hero-media-2',
    type: 'photo',
    titleKO: 'Built for Professionals',
    titleVI: 'Được thiết kế dành cho các chuyên gia',
    subtitleKO: 'Macbook Pro16',
    subtitleVI: 'Light up every beat',
    url: 'https://i.ibb.co/bRNJs0ZL/macbookpro16.jpg',
    targetProductId: 'lux-book-pro-16'
  },
];

export const DEFAULT_SUB_MEDIA: HeroMediaItem[] = [
  {
    id: 'sub-media-1',
    type: 'video',
    titleKO: '서브 라이브 미니 동영상 (MP4)',
    titleVI: 'Video Phụ Live (MP4)',
    url: 'https://files.catbox.moe/l21bbv.mp4'
  },
  {
    id: 'sub-media-2',
    type: 'photo',
    titleKO: '서브 프리미엄 비주얼 사진',
    titleVI: 'Ảnh Phụ Cao Cấp',
    url: 'https://i.ibb.co/F4XxSjPM/vn-feature-nbsp-549228901.jpg'
  }
];

/**
 * =========================================================================
 * 📢 [사용자 커스텀 가이드] 드롭다운 서브 카테고리 ('주요 세부 라인업') 설정
 * =========================================================================
 * 상단 헤더 카테고리 드롭다운 메뉴의 좌측 '주요 세부 라인업' 항목을 자유롭게 직접 수정/추가/삭제할 수 있습니다!
 * 
 * [수정 가이드]
 * 1. 세부 항목 변경: subCategoriesKO (한글) 및 subCategoriesVI (베트남어) 배열 내부 문구를 자유롭게 고치세요.
 * 2. 항목 추가/삭제: 배열 항목을 추가하거나 삭제하면 드롭다운 화면에 즉시 반영됩니다.
 * 3. 좌측 영역 완전 숨김 (Full Width 모드):
 *    특정 카테고리의 subCategoriesKO/subCategoriesVI 배열을 빈 값 [] 으로 비워두시면,
 *    좌측 서브 메뉴가 완전히 숨겨지고 우측 대표 상품 카드가 드롭다운 전체 폭(Full Width)으로 펼쳐집니다!
 * =========================================================================
 */
export const CATEGORY_SUB_MENUS: Record<string, CategorySubMenu> = {
  phone: {
    titleKO: '스마트폰 & 워치',
    titleVI: 'Điện thoại & Di động',
    subCategoriesKO: [
      '스마트워치',
    ],
    subCategoriesVI: [
      'Đồng hồ thông minh VIP',
    ],
  },
  laptop: {
    titleKO: '노트북',
    titleVI: 'Máy tính',
    subCategoriesKO: [
      'MACBOOK',

    ],
    subCategoriesVI: [
      'MACBOOK',
    ],
  },
  audio: {
    titleKO: '프리미엄 오디오',
    titleVI: 'Âm thanh VIP & Hi-Fi',
    subCategoriesKO: [
      '오디오',
    ],
    subCategoriesVI: [
      'Mấy âm thanh',
    ],
  },
  smarthome: {
    titleKO: '스마트 홈',
    titleVI: 'Nhà thông minh',
    subCategoriesKO: [
      '초음속 음이온 스마트 헤어 드라이어',
      'H13 헤파 필터 초미세 공기청정기',
      'AI 스마트 로봇청소기',
      '무선청소기 자동비움 F-26'
    ],
    subCategoriesVI: [
      'Máy sấy tóc siêu tốc AI',
      'Máy lọc không khí HEPA H13',
      'Robot hút bụi AI thông minh',
      'Máy hút bụi thông minh F-26'
    ],
  },
};

/**
 * =========================================================================
 * 📢 [사용자 안내 가이드] 이미지 및 동영상 외부 URL 설정 안내
 * =========================================================================
 * 본 파일(data.ts)의 모든 상품 이미지(imageUrl)와 동영상(videoUrl)은 외부 URL을 사용합니다.
 * 
 * 이미지/비디오 변경 방법 (PostImg, ImgBB, Unsplash, Google Drive 등 사용):
 * - 원하는 이미지 또는 MP4 동영상을 업로드한 후 주소, 마크다운 링크, HTML 태그를
 *   아래 상품의 'imageUrl' 또는 'videoUrl' 필드에 입력하시면 자동으로 정제 및 변환되어 적용됩니다.
 * =========================================================================
 */

export const RAW_PRODUCTS: Product[] = [
  {
    id: "smarthome-dryer",
    category: "smarthome",
    nameKO: "초음속 음이온 스마트 헤어 드라이어",
    nameVI: "Máy sấy tóc siêu tốc AI",
    tagKO: "초음속 음이온 및 고밀도 모터 케어 드라이어",
    tagVI: "Máy sấy tóc ion âm kiểm soát nhiệt độ thông minh",
    price: 490000,
    rating: 4.9,
    reviewsCount: 56,
    imageUrl: "https://i.ibb.co/3mFB7J96/element5-digital-yutg-Pvm-Hx-YQ-unsplash.jpg",
    videoUrl: "",
    specsKO: {
      "모터": "11만 RPM 고속 디지털 모터",
      "기능": "스마트 지능형 온도 제어 & 2억 개 음이온 케어"
    },
    specsVI: {
      "Động cơ": "Động cơ kỹ thuật số 110.000 vòng/phút",
      "Tính năng": "Kiểm soát nhiệt độ thông minh & 200 triệu Ion âm"
    },
    featuresKO: [
      "초초속 고속 모터로 3분 모발 초스피드 건조",
      "음이온 집중 케어로 모발 손상 차단 및 윤기 부여"
    ],
    featuresVI: [
      "Sấy khô tóc siêu tốc chỉ trong 3 phút",
      "Bảo vệ tóc khỏi hư tổn với ion âm cao cấp"
    ],
    descriptionKO: "11만 RPM 초고속 디지털 모터와 스마트 지능형 온도 센서가 모발 손상 없이 쾌속 건조를 도와주는 프리미엄 스마트 헤어 드라이어입니다.",
    descriptionVI: "Máy sấy tóc cao cấp với động cơ kỹ thuật số 110.000 vòng/phút và cảm biến nhiệt thông minh bảo vệ tóc.",
    colors: [
      { nameKO: "매트 미드나잇", nameVI: "Đen Nhám", hex: "#1F2937" },
      { nameKO: "로즈 골드", nameVI: "Vàng Hồng", hex: "#F43F5E" }
    ],
    isNew: true,
    isBest: true
  },
  {
    id: "smarthome-robot",
    category: "smarthome",
    nameKO: "AI 스마트 로봇청소기",
    nameVI: "Robot hút bụi AI thông minh",
    tagKO: "AI 스마트 로봇청소기",
    tagVI: "Robot hút bụi AI thông minh",
    price: 1390000,
    rating: 4.8,
    reviewsCount: 28,
    imageUrl: "https://i.ibb.co/vxG63NmW/ron2025-robot-vacuum-cleaner-5073580.jpg",
    videoUrl: "",
    specsKO: {
      "기능": "AI 장애물 회피 센서 & 자동 충전",
      "센서": "LiDAR 3D 공간 매핑 센서"
    },
    specsVI: {
      "Tính năng": "Cảm biến AI né vật cản & Tự sạc",
      "Cảm biến": "Cảm biến 3D LiDAR"
    },
    featuresKO: [
      "초정밀 AI 장애물 회피 및 3D 공간 센서",
      "자율주행 최적화 듀얼 카메라 탑재"
    ],
    featuresVI: [
      "Tránh vật cản AI siêu chính xác",
      "Camera kép tối ưu hóa tự động"
    ],
    descriptionKO: "AI 장애물 회피 기술과 3D LiDAR 센서가 탑재된 최첨단 자율주행 스마트 로봇청소기입니다. 관리자 모드에서 사진과 동영상을 자유롭게 변경하거나 수정하실 수 있습니다.",
    descriptionVI: "Robot hút bụi thông minh tự động tránh vật cản với cảm biến LiDAR 3D cao cấp.",
    colors: [
      { nameKO: "스노우 화이트", nameVI: "Trắng Tuyết", hex: "#F8FAFC" },
      { nameKO: "스페이스 그레이", nameVI: "Xám Không Gian", hex: "#475569" }
    ],
    isNew: true,
    isBest: false
  },
  {
    id: "smarthome-air",
    category: "smarthome",
    nameKO: "H13 헤파 필터 초미세 공기청정기",
    nameVI: "Máy lọc không khí HEPA H13",
    tagKO: "H13 헤파 필터 초미세 공기청정기",
    tagVI: "Máy lọc không khí HEPA H13",
    price: 890000,
    rating: 4.9,
    reviewsCount: 45,
    imageUrl: "https://i.ibb.co/tTH04Ryv/No-13-2.jpg",
    videoUrl: "",
    specsKO: {
      "필터": "H13 헤파 필터 (99.97% 미세먼지 제거)",
      "청정면적": "85㎡ 대형 공간 지원"
    },
    specsVI: {
      "Bộ lọc": "Màng lọc HEPA H13 (Lọc 99.97%)",
      "Diện tích": "Phủ diện tích lớn 85m2"
    },
    featuresKO: [
      "H13 360도 초미세먼지 집진 필터",
      "초저음 저소음 수면 모드 지원"
    ],
    featuresVI: [
      "Bộ lọc bụi mịn H13 360 độ",
      "Chế độ ngủ yên tĩnh cực thấp"
    ],
    descriptionKO: "H13 등급 헤파 필터로 초미세먼지를 99.97% 제거하는 초고성능 프리미엄 공기청정기입니다. 관리자 모드에서 사진과 동영상을 자유롭게 변경하거나 수정하실 수 있습니다.",
    descriptionVI: "Máy lọc không khí cao cấp với màng lọc HEPA H13 loại bỏ 99.97% bụi mịn.",
    colors: [
      { nameKO: "퓨어 화이트", nameVI: "Trắng Tinh Khôi", hex: "#FFFFFF" },
      { nameKO: "매트 블랙", nameVI: "Đen Nhám", hex: "#1E293B" }
    ],
    isNew: true,
    isBest: false
  },
  {
    id: "smarthome",
    category: "smarthome",
    nameKO: "무선청소기 자동비움 F-26",
    nameVI: "Máy hút bụi thông minh F-26",
    tagKO:  "무선청소기 자동비움 F-26",
    tagVI: "Máy hút bụi tự động làm sạch F-26",
    price: 1590000, // 1,590,000 KRW
    rating: 4.9,
    reviewsCount: 142,
    imageUrl: "https://i.ibb.co/DPSdv7wD/No-14-10.png",
    videoUrl: "",
    specsKO: {
      "흡입력": "30,000Pa 강력 초고성능 수퍼 흡입력",
      "클린스테이션": "자동 먼지 비움 & 살균 덤핑 스테이션",
      "배터리": "최대 70시간 고용량 리튬이온 패키지",
      "필터": "H13 초미세 다중 사이클론 헤파 필터"
    },
    specsVI: {
      "Lực hút": "Lực hút siêu mạnh 30.000Pa",
      "Trạm sạc": "Tự động hút bụi & diệt khuẩn Trạm rác",
      "Pin": "Pin Lithium-ion dung lượng cao dùng đến 70 phút",
      "Bộ lọc": "Bộ lọc HEPA đa chu trình H13"
    },
    featuresKO: [
      "자동 먼지 감지 및 스마트 흡입력 조절",
      "클린 스테이션 자동 비움 시스템 탑재",
      "LED 정밀 헤드 라이트로 어두운 구석 먼지 시각화",
      "인체공학적 경량 설계로 손목 부담 최소화"
    ],
    featuresVI: [
      "Cảm biến bụi tự động điều chỉnh lực hút",
      "Trạm tự động dọn rác khép kín thông minh",
      "Đèn LED chiếu sáng siêu sáng soi bụi ẩn",
      "Thiết kế công thái học siêu nhẹ giảm mỏi tay"
    ],
    descriptionKO: "무선청소기 자동비움 F-26은 30,000Pa의 압도적인 흡입력과 먼지통을 자동으로 비워주는 스마트 클린스테이션을 탑재한 최상위 스틱 무선 청소기입니다.",
    descriptionVI: "Máy hút bụi F-26 với lực hút mạnh mẽ 30.000Pa cùng trạm rác tự động thông minh giúp dọn dẹp nhà cửa dễ dàng.",
    colors: [
      { nameKO: "티타늄 블랙", nameVI: "Titan Đen", hex: "#1c1d21" },
      { nameKO: "티타늄 실버", nameVI: "Titan Bạc", hex: "#d1d5db" }
    ],
    isNew: true,
    isBest: true
  },
  {
    id: "lux-book-pro-16",
    category: "laptop",
    nameKO: "맥북 프로 16 (MACBook Pro 16)",
    nameVI: "LuxBook Pro 16 (Máy tính xách tay cao cấp)",
    tagKO: "M3 Ultra 칩셋과 Liquid Retina XDR 디스플레이의 압도적 성능",
    tagVI: "Hiệu năng vượt trội với chip M3 Ultra và màn hình Liquid Retina XDR",
    price: 3490000,
    rating: 4.95,
    reviewsCount: 88,
    imageUrl: "https://i.ibb.co/bRNJs0ZL/macbookpro16.jpg",
    videoUrl: "",
    specsKO: {
      "프로세서": "Lux Core M3 Ultra 16코어 CPU / 40코어 GPU",
      "디스플레이": "16.2인치 Mini-LED XDR (3240x2160, 1600nits 피크 밝기)",
      "메모리": "64GB 통합 메모리 / 2TB NVMe SSD",
      "배터리": "최대 22시간 연속 사용 지원 (140W USB-C MagSafe 3 충전)"
    },
    specsVI: {
      "Bộ vi xử lý": "Lux Core M3 Ultra CPU 16 nhân / GPU 40 nhân",
      "Màn hình": "16.2 inch Mini-LED XDR (3240x2160, Độ sáng tối đa 1600nits)",
      "Bộ nhớ": "64GB RAM hợp nhất / 2TB NVMe SSD",
      "Pin": "Thời lượng pin lên đến 22 giờ (Sạc 140W USB-C MagSafe 3)"
    },
    featuresKO: [
      "100% 리사이클 알루미늄 유니바디 커스텀 마감",
      "스튜디오 급 3-마이크 어레이 및 6-스피커 사운드 시스템",
      "풀사이즈 리얼 햅틱 키보드 및 스페이스 드라이브 트랙패드"
    ],
    featuresVI: [
      "Vỏ nhôm nguyên khối 100% tái chế cao cấp",
      "Hệ thống 3 micro chuẩn studio và 6 loa âm thanh vòm",
      "Bàn phím haptic kích thước đầy đủ & Trackpad siêu rộng"
    ],
    descriptionKO: "럭스북 프로 16은 크리에이터와 비즈니스 리더를 위한 최고의 모바일 워크스테이션입니다. 차세대 M3 Ultra 칩의 압도적인 그래픽 처리 능력과 1,600nits 피크 밝기의 Liquid Retina XDR 화면으로 어떠한 대용량 그래픽 작업도 완벽하게 지원합니다.",
    descriptionVI: "LuxBook Pro 16 là trạm làm việc di động đỉnh cao dành cho các nhà sáng tạo và lãnh đạo doanh nghiệp. Được trang bị chip M3 Ultra mạnh mẽ cùng màn hình Liquid Retina XDR độ sáng 1,600 nits giúp xử lý mượt mà mọi dự án đồ họa nặng nhất.",
    colors: [
      { nameKO: "스페이스 블랙", nameVI: "Đen Không Gian", hex: "#111215" },
      { nameKO: "실버", nameVI: "Bạc Lux", hex: "#e2e8f0" }
    ],
    isNew: true,
    isBest: true
  },
  {
    id: "lux-sound-aura",
    category: "audio",
    nameKO: "삼성 사운드 오라 (Lux Sound Aura)",
    nameVI: "Lux Sound Aura (Tai nghe VIP)",
    tagKO: "액티브 노이즈 캔슬링과 공간 음향의 맞춤형 오디오",
    tagVI: "Chống ồn chủ động ANC & Âm thanh vòm không gian 3D",
    price: 890000,
    rating: 4.88,
    reviewsCount: 210,
    imageUrl: "https://i.ibb.co/F4XxSjPM/vn-feature-nbsp-549228901.jpg",
    videoUrl: "",
    specsKO: {
      "드라이버": "40mm 맞춤 제작 티타늄 듀얼 다이내믹 드라이버",
      "노이즈 캔슬링": "스마트 적응형 ANC (초당 48,000회 음파 분석)",
      "연결성": "Bluetooth 5.4 / 무손실 LDAC & Hi-Res Audio 지원",
      "배터리": "ANC 온 상태에서 최대 35시간 재생 (10분 충전 시 5시간 사용)"
    },
    specsVI: {
      "Màng loa": "Màng loa kép Titan 40mm được tinh chỉnh riêng",
      "Chống ồn": "Chống ồn chủ động ANC thông minh (Phân tích 48,000 lần/giây)",
      "Kết nối": "Bluetooth 5.4 / Hỗ trợ âm thanh không nén LDAC & Hi-Res",
      "Pin": "Phát liên tục 35 giờ khi bật ANC (Sạc 10 phút dùng 5 giờ)"
    },
    featuresKO: [
      "메모리 폼 메모리 이어쿠션과 천연 가죽 헤드밴드",
      "머리 방향 추적 맞춤형 3D spatial 오디오 기술",
      "터치 패널 방식의 정밀 볼륨 및 트랙 조작"
    ],
    featuresVI: [
      "Đệm tai Memory Foam êm ái và quai đeo bằng da thật",
      "Công nghệ âm thanh vòm 3D theo dõi chuyển động đầu",
      "Bảng điều khiển cảm ứng mượt mà trên củ tai"
    ],
    descriptionKO: "럭스 사운드 오라는 소리의 깊이가 다른 극상의 청음 환경을 선사합니다. 맞춤 티타늄 드라이버가 선명한 고음과 깊고 웅장한 베이스를 구현하며, 초정밀 ANC 기술로 오직 음악에만 몰입할 수 있도록 도와줍니다.",
    descriptionVI: "Lux Sound Aura mang đến không gian âm nhạc riêng tư vượt trội. Màng loa Titan tinh chỉnh mang lại dải âm trầm sâu lắng cùng âm cao trong trẻo, kết hợp công nghệ ANC cho bạn đắm chìm hoàn toàn vào âm nhạc.",
    colors: [
      { nameKO: "매트 블랙", nameVI: "Đen Nhám", hex: "#1e1e1e" },
      { nameKO: "아틱 화이트", nameVI: "Trắng Băng", hex: "#f8fafc" }
    ],
    isNew: false,
    isBest: true
  }
];

// 자동 변환 및 정제된 상품 데이터 Export
export const PRODUCTS: Product[] = RAW_PRODUCTS.map((p) => ({
  ...p,
  imageUrl: cleanAndConvertImageUrl(p.imageUrl),
  videoUrl: p.videoUrl ? cleanAndConvertVideoUrl(p.videoUrl) : p.videoUrl,
}));

export const FAQS = [
  {
    qKO: "회원 결제와 비회원 결제는 무엇이 다른가요?",
    qVI: "Sự khác biệt giữa thanh toán thành viên và khách thường là gì?",
    aKO: "회원으로 로그인 및 인증을 거쳐 결제하시면 전 상품 기본 10%의 프리미엄 상시 할인이 즉시 정가 대비 차감됩니다. 또한 VIP 케어 프로그램(5년 무상 품질보증, VIP 전용 전문 매니저 응대 서비스)이 자동으로 누적 및 제공됩니다. 비회원은 추가 할인 없이 간편하게 신속한 결제가 가능하며 일반 1년 무상보증 혜택이 적용됩니다.",
    aVI: "Khi bạn đăng nhập và thanh toán với tư cách thành viên, ưu đãi giảm giá VIP 10% sẽ được tự động áp dụng ngay vào tổng hóa đơn. Bên cạnh đó, bạn cũng được tham gia chương trình đặc quyền VIP (Bảo hành 5 năm, cố vấn kỹ thuật tận nhà). Khách thường có thể mua hàng nhanh chóng nhưng thanh toán theo giá niêm yết và được hưởng gói bảo hành tiêu chuẩn 1 năm."
  },
  {
    qKO: "프리미엄 VIP 배송 과정은 어떻게 되나요?",
    qVI: "Quy trình giao hàng VIP diễn ra như thế nào?",
    aKO: "결제가 완료되면 기재하신 휴대전화와 이메일로 고유 주문 안전 번호가 발송됩니다. 가전 설치 전문 출장 크루가 고객님께 사전에 연락드려 원하시는 세심한 설치 일정과 장소를 예약을 받은 후 무결점 VIP 무료 특송으로 방문 설치해 드립니다.",
    aVI: "Sau khi hoàn tất thanh toán, hệ thống sẽ gửi một mã đơn hàng an toàn qua số điện thoại và email của bạn. Đội ngũ kỹ sư lắp đặt chuyên nghiệp của chúng tôi sẽ chủ động liên hệ trước để xác nhận ngày giờ và lắp đặt miễn phí, bảo đảm không có bất kỳ thiếu sót nào."
  }
];
