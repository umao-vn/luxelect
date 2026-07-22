import { Product } from './types';
import { cleanAndConvertImageUrl, cleanAndConvertVideoUrl } from './utils';

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
    id: "lux-phone-alpha",
    category: "phone",
    nameKO: "럭스폰 알파 (LuxPhone Alpha)",
    nameVI: "LuxPhone Alpha (Điện thoại thông minh)",
    tagKO: "티타늄 보디와 2억 화소 스페이스 줌의 결합",
    tagVI: "Sự kết hợp giữa vỏ Titan và ống kính siêu zoom 200MP",
    price: 1590000, // 1,590,000 KRW
    rating: 4.9,
    reviewsCount: 142,
    imageUrl: "https://i.ibb.co/x8c7FpDJ/H27ed46bf176243f4b53f6917f30b0d03o-jpg.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    specsKO: {
      "프로세서": "Lux Core X3 Max (4나노 초정밀 공정)",
      "디스플레이": "6.8인치 Dynamic Super AMOLED 3X (1-120Hz 가변 주사율)",
      "카메라": "후면 2억 화소 광각 + 5000만 화소 초광각 + 1200만 화소 망원 / 전면 4000만 화소",
      "배터리": "5500 mAh (100W 초고속 유선 충전 / 50W 무선 충전 지원)",
      "메모리": "16GB LPDDR5X RAM / 512GB UFS 4.0 스토리지",
      "내구성": "IP68 등급 방수 방진 & 티타늄 Grade 5 프레임 적용"
    },
    specsVI: {
      "Bộ vi xử lý": "Lux Core X3 Max (Tiến trình siêu chính xác 4nm)",
      "Màn hình": "6.8 inch Dynamic Super AMOLED 3X (Tần số quét biến thiên 1-120Hz)",
      "Camera": "Sau 200MP Góc rộng + 50MP Góc siêu rộng + 12MP Ống kính zoom / Trước 40MP",
      "Pin": "5500 mAh (Sạc siêu nhanh có dây 100W / Sạc không dây 50W)",
      "Bộ nhớ": "16GB LPDDR5X RAM / 512GB UFS 4.0 Lưu trữ",
      "Độ bền": "Kháng nước kháng bụi chuẩn IP68 & Khung viền Titan Grade 5"
    },
    featuresKO: [
      "스페이스 줌 150배율 울트라 센서 탑재",
      "빛 반사를 99% 차단하는 고기능 저반사 무광 유리 코팅 적용",
      "인공지능 실시간 음성 통역 및 사진 피사체 완벽 AI 제거 기능 지원",
      "프리미엄 햅틱 모터 탑재로 더욱 입체감 있는 터치 감각 선사"
    ],
    featuresVI: [
      "Trang bị cảm biến siêu Zoom không gian lên tới 150x",
      "Phủ lớp kính nhám chống chói giảm thiểu phản xạ ánh sáng đến 99%",
      "Hỗ trợ dịch thuật giọng nói thời gian thực và xóa vật thể thông minh",
      "Mô-tơ rung phản hồi xúc giác cao cấp mang lại trải nghiệm chạm chân thực"
    ],
    descriptionKO: "럭스폰 알파는 모바일 테크놀로지의 절대적인 정점을 상징합니다. 항공우주 공학 등급의 Grade 5 티타늄 프레임으로 제작되어 뛰어난 강도와 놀라울 정도로 가벼운 무게감을 동시에 만족시킵니다. 초미세 4나노 공정으로 튜닝된 Lux Core X3 Max 칩셋이 탑재되어 어떠한 고사양 작업이나 3D 게이밍도 끊김 없이 부드럽게 소화해 냅니다.",
    descriptionVI: "LuxPhone Alpha đại diện cho đỉnh cao tuyệt đối của công nghệ di động. Được thiết kế với khung viền Titan Grade 5 chuẩn hàng không vũ trụ, mang lại độ bền siêu hạng cùng cảm giác cầm nắm nhẹ nhàng khó tin. Bộ vi xử lý Lux Core X3 Max sản xuất trên tiến trình 4nm tiên tiến giúp xử lý mượt mà mọi tác vụ đồ họa và các tựa game 3D nặng nhất.",
    colors: [
      { nameKO: "티타늄 블랙", nameVI: "Titan Đen", hex: "#1c1d21" },
      { nameKO: "티타늄 실버", nameVI: "Titan Bạc", hex: "#d1d5db" },
      { nameKO: "내추럴 골드", nameVI: "Titan Vàng", hex: "#e5c158" }
    ],
    isNew: true,
    isBest: true
  },
  {
    id: "lux-book-pro-16",
    category: "laptop",
    nameKO: "럭스북 프로 16 (LuxBook Pro 16)",
    nameVI: "LuxBook Pro 16 (Máy tính xách tay cao cấp)",
    tagKO: "M3 Ultra 칩셋과 Liquid Retina XDR 디스플레이의 압도적 성능",
    tagVI: "Hiệu năng vượt trội với chip M3 Ultra và màn hình Liquid Retina XDR",
    price: 3490000,
    rating: 4.95,
    reviewsCount: 88,
    imageUrl: "https://i.ibb.co/Pz4KqM31/dibea.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
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
    nameKO: "럭스 사운드 오라 (Lux Sound Aura)",
    nameVI: "Lux Sound Aura (Tai nghe VIP)",
    tagKO: "액티브 노이즈 캔슬링과 공간 음향의 맞춤형 오디오",
    tagVI: "Chống ồn chủ động ANC & Âm thanh vòm không gian 3D",
    price: 890000,
    rating: 4.88,
    reviewsCount: 210,
    imageUrl: "https://i.ibb.co/x8c7FpDJ/H27ed46bf176243f4b53f6917f30b0d03o-jpg.jpg",
    videoUrl: "https://i.ibb.co/x8c7FpDJ/H27ed46bf176243f4b53f6917f30b0d03o-jpg.jpg",
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
  },
  {
    id: "lux-custom-1784700690204",
    category: "display",
    nameKO: "럭스 시그니처 8K 올레드 디스플레이",
    nameVI: "Màn hình Lux Signature 8K OLED",
    tagKO: "초고화질 8K HDR 10+ 및 자발광 올레드 패널의 극상 화질",
    tagVI: "Chất lượng hình ảnh 8K HDR 10+ & Tấm nền OLED tự phát sáng",
    price: 4890000,
    rating: 5.0,
    reviewsCount: 64,
    imageUrl: "https://i.ibb.co/nMCCPR7M/1.png",
    videoUrl: "https://i.ibb.co/nMCCPR7M/1.png",
    specsKO: {
      "화면 크기": "32인치 / 8K UHD (7680x4320)",
      "패널": "Quantum OLED (178도 광시야각)",
      "주사율": "240Hz (0.03ms 응답속도)",
      "색재현율": "DCI-P3 99% / Adobe RGB 99%"
    },
    specsVI: {
      "Kích thước": "32 inch / 8K UHD (7680x4320)",
      "Tấm nền": "Quantum OLED (Góc nhìn rộng 178 độ)",
      "Tần số quét": "240Hz (Thời gian phản hồi 0.03ms)",
      "Độ bao phủ màu": "DCI-P3 99% / Adobe RGB 99%"
    },
    featuresKO: [
      "무선 8K 실시간 시그널 전송 지원",
      "슬림 메탈 베젤 & 마그네틱 모듈러 스탠드",
      "자동 눈 보호 모드 & 스마트 센서 탑재"
    ],
    featuresVI: [
      "Hỗ trợ truyền tín hiệu 8K không dây thời gian thực",
      "Viền kim loại siêu mỏng & Chân đế hít từ tính",
      "Chế độ bảo vệ mắt tự động & Cảm biến thông minh"
    ],
    descriptionKO: "럭스 시그니처 8K 올레드 디스플레이는 현존하는 최고 레벨의 색 정확도와 압도적 명암비를 선보입니다. 8K 초고해상도로 완벽한 시각적 몰입감을 선사합니다.",
    descriptionVI: "Màn hình Lux Signature 8K OLED mang đến độ chính xác màu sắc vượt trội và tỷ lệ tương phản ấn tượng nhất. Độ phân giải 8K cho trải nghiệm thị giác hoàn hảo.",
    colors: [
      { nameKO: "티타늄 실버", nameVI: "Titan Bạc", hex: "#e2e8f0" }
    ],
    isNew: true,
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
    qKO: "원하는 ImgBB 사진이나 직접 촬영한 MP4 동영상 주소를 어떻게 적용하나요?",
    qVI: "Làm thế nào tôi có thể áp dụng ảnh ImgBB hoặc liên kết video MP4 của riêng tôi?",
    aKO: "이 사이트는 템플릿 완성도가 매우 높습니다! 프로젝트 내의 '/src/data.ts' 파일을 열어보시면, 각 제품 항목마다 'imageUrl'과 'videoUrl' 필드가 친절한 한글 및 베트남어 안내 주석과 함께 마련되어 있습니다. ImgBB에 제품 사진을 올리고 발급받은 '직접 주소(Direct Link)'나 MP4 비디오 파일의 경로를 복사하여 그 자리에 덮어쓰기 하시면 바로 반영됩니다.",
    aVI: "Trang web này được thiết kế để dễ dàng tùy chỉnh! Vui lòng mở tệp `/src/data.ts` trong dự án. Tại đây, mỗi sản phẩm đều có trường 'imageUrl' và 'videoUrl' được đính kèm chú thích hướng dẫn bằng tiếng Hàn và tiếng Việt. Bạn chỉ cần tải ảnh lên ImgBB và lấy liên kết trực tiếp (Direct Link) hoặc sao chép liên kết tệp MP4 của bạn để dán đè lên đường dẫn hiện có."
  },
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
