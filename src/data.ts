import { Product } from './types';

/**
 * =========================================================================
 * 📢 [사용자 안내 가이드] 이미지 및 동영상 외부 URL 설정 안내
 * =========================================================================
 * 본 파일(data.ts)의 모든 상품 이미지(imageUrl)와 동영상(videoUrl)은 외부 URL을 사용합니다.
 * 
 * 1. 이미지 변경 방법 (PostImg / ImgBB / Unsplash 등 사용):
 *    - PostImg(https://postimages.org/), ImgBB(https://imgbb.com/) 등에 이미지를 업로드합니다.
 *    - 아래 'PRODUCT_CUSTOM_MEDIA_MAP' 객체에 '상품ID: 이미지URL' 형태로 등록하면 자동으로 적용 및 정제됩니다.
 * =========================================================================
 */

// =========================================================================
// 🔗 [상품 ID : 이미지/비디오 URL 자동 매핑 테이블 및 헬퍼 로직]
// 앞으로 '상품ID: 이미지URL' 형태로 전달되면 이 곳에 등록하여 자동 연결할 수 있습니다.
// =========================================================================
export const PRODUCT_CUSTOM_MEDIA_MAP: Record<string, string | { imageUrl?: string; videoUrl?: string }> = {
  "lux-phone-alpha": "https://i.postimg.cc/s2sHdhjD/jadongbium1(1).png",
};

/**
 * 전달받은 커스텀 매핑 정보를 기반으로 상품 목록의 imageUrl/videoUrl을 자동 반영하는 함수
 */
export const applyCustomMediaToProducts = (
  productsList: Product[],
  customMap: Record<string, string | { imageUrl?: string; videoUrl?: string }>
): Product[] => {
  return productsList.map((product) => {
    const custom = customMap[product.id];
    if (!custom) {
      return {
        ...product,
        imageUrl: cleanMediaUrl(product.imageUrl),
        videoUrl: product.videoUrl ? cleanMediaUrl(product.videoUrl) : product.videoUrl,
      };
    }

    if (typeof custom === 'string') {
      return {
        ...product,
        imageUrl: cleanMediaUrl(custom),
        videoUrl: product.videoUrl ? cleanMediaUrl(product.videoUrl) : product.videoUrl,
      };
    }

    return {
      ...product,
      imageUrl: custom.imageUrl ? cleanMediaUrl(custom.imageUrl) : cleanMediaUrl(product.imageUrl),
      videoUrl: custom.videoUrl ? cleanMediaUrl(custom.videoUrl) : (product.videoUrl ? cleanMediaUrl(product.videoUrl) : product.videoUrl),
    };
  });
};

/**
 * '상품ID: 이미지URL' 등록 헬퍼 함수
 */
export const registerProductMedia = (productId: string, imageUrl?: string, videoUrl?: string) => {
  if (!productId) return;
  const existing = PRODUCT_CUSTOM_MEDIA_MAP[productId];
  const existingObj = typeof existing === 'object' && existing !== null ? existing : { imageUrl: typeof existing === 'string' ? existing : undefined };

  PRODUCT_CUSTOM_MEDIA_MAP[productId] = {
    ...existingObj,
    ...(imageUrl ? { imageUrl: cleanMediaUrl(imageUrl) } : {}),
    ...(videoUrl ? { videoUrl: cleanMediaUrl(videoUrl) } : {}),
  };
};

const BASE_PRODUCTS: Product[] = [
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
    imageUrl: "https://i.postimg.cc/s2sHdhjD/jadongbium1(1).png",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
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
    nameVI: "LuxBook Pro 16 (Máy tính xách tay)",
    tagKO: "크리에이터와 프로페셔널을 위한 최강의 연산 퍼포먼스",
    tagVI: "Hiệu năng tính toán đỉnh cao dành cho người sáng tạo và chuyên nghiệp",
    price: 2980000, // 2,980,000 KRW
    rating: 5.0,
    reviewsCount: 94,
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    specsKO: {
      "프로세서": "Lux Silicon M4 Ultra Pro (16코어 CPU / 40코어 GPU)",
      "디스플레이": "16.2인치 Liquid Retina-XDR Pro (1600nits 최대 밝기, ProMotion)",
      "메모리": "64GB 고대역폭 통합 메모리",
      "저장장치": "1TB NVMe Gen5 SSD (초당 14GB 읽기 속도)",
      "포트": "Thunderbolt 4 x3, HDMI 2.1 x1, SDXC 카드 슬롯, MagSafe 3",
      "배터리": "100Wh 대용량 배터리 (최대 22시간 연속 사용 가능)"
    },
    specsVI: {
      "Bộ vi xử lý": "Lux Silicon M4 Ultra Pro (16 nhân CPU / 40 nhân GPU)",
      "Màn hình": "16.2 inch Liquid Retina-XDR Pro (Độ sáng tối đa 1600nits, ProMotion)",
      "Bộ nhớ RAM": "64GB Unified Memory băng thông siêu cao",
      "Ổ cứng": "1TB NVMe Gen5 SSD (Tốc độ đọc siêu việt lên đến 14GB/s)",
      "Cổng kết nối": "Thunderbolt 4 x3, HDMI 2.1 x1, Khe thẻ nhớ SDXC, MagSafe 3",
      "Thời lượng Pin": "Dung lượng pin 100Wh (Thời lượng sử dụng liên tục lên đến 22 giờ)"
    },
    featuresKO: [
      "업계 최고 전성비를 달성한 차세대 저소음 듀얼 터보 쿨링 팬 내장",
      "스튜디오 품질의 6스피커 시스템 적용으로 풍부한 저음과 Dolby Atmos 선사",
      "알루미늄 모노코크 일체형 바디로 강인함과 심플함의 극치",
      "최고 사양의 풀사이즈 가위식 백라이트 기계식 키감 키보드"
    ],
    featuresVI: [
      "Quạt tản nhiệt kép Turbo siêu êm ái đạt hiệu suất tiêu thụ điện tối ưu",
      "Hệ thống âm thanh 6 loa chất lượng Studio với âm trầm sâu lắng và Dolby Atmos",
      "Vỏ nhôm nguyên khối Monocoque mang lại sự tinh tế và chắc chắn tối đa",
      "Bàn phím đèn nền với hành trình phím kéo cắt sâu cực kỳ êm ái và nhạy bén"
    ],
    descriptionKO: "럭스북 프로 16은 상상할 수 없던 강력한 컴퓨터 연산 성능을 품고 있습니다. 3D 렌더링, 8K 무압축 동영상 편집, 그리고 하드웨어 가속 레이 트레이싱 등 전문가급 영역에서 극상의 빠름을 유지합니다. 놀라운 점은 이 모든 압도적인 퍼포먼스를 발휘하는 순간에도 초저소음 냉각 설계 덕분에 도서관 수준의 정숙함을 보장한다는 것입니다.",
    descriptionVI: "LuxBook Pro 16 sở hữu khả năng xử lý máy tính mạnh mẽ vượt ngoài sức tưởng tượng. Phù hợp hoàn hảo cho các tác vụ dựng hình 3D phức tạp, chỉnh sửa video không nén 8K, và dò tia phần cứng thời gian thực. Đáng ngạc nhiên là máy vẫn duy trì sự yên tĩnh tuyệt đối nhờ hệ thống tản nhiệt tối ưu được thiết kế thông minh.",
    colors: [
      { nameKO: "스페이스 그레이", nameVI: "Xám không gian", hex: "#374151" },
      { nameKO: "고급 스노우 실버", nameVI: "Bạc tuyết cao cấp", hex: "#f3f4f6" }
    ],
    isNew: true,
    isBest: false
  },
  {
    id: "lux-sound-aura",
    category: "audio",
    nameKO: "럭스사운드 아우라 (LuxSound Aura)",
    nameVI: "LuxSound Aura (Tai nghe cao cấp)",
    tagKO: "소음 없는 우주 속 무중력 음향의 경험",
    tagVI: "Trải nghiệm âm thanh không trọng lực trong không gian tĩnh lặng",
    price: 650000, // 650,000 KRW
    rating: 4.8,
    reviewsCount: 218,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    specsKO: {
      "드라이버": "45mm 맞춤 설계 다이내믹 드라이버 유닛",
      "노이즈 캔슬링": "하이브리드 액티브 노이즈 캔슬링 (주변 소음 99.8% 감쇄)",
      "무선 성능": "Bluetooth 5.4 / 초고음질 하이레스 LDAC, aptX Adaptive 코덱",
      "배터리": "노이즈 캔슬링 활성화 시 최대 45시간, 비활성화 시 60시간 지속",
      "충전": "USB Type-C (10분 충전으로 최대 8시간 사용 가능)",
      "착용감": "최고급 양가죽 메모리폼 이어컵 패드 사용"
    },
    specsVI: {
      "Màng loa": "Màng loa Dynamic 45mm được thiết kế riêng biệt",
      "Chống ồn": "Chống ồn chủ động Hybrid ANC (Giảm tiếng ồn xung quanh đến 99.8%)",
      "Kết nối không dây": "Bluetooth 5.4 / Mã hóa âm thanh Hi-Res LDAC & aptX Adaptive",
      "Thời lượng Pin": "Lên tới 45 giờ khi bật chống ồn, và 60 giờ khi tắt chống ồn",
      "Sạc": "Cổng sạc nhanh USB Type-C (Sạc 10 phút dùng liên tục trong 8 giờ)",
      "Cảm giác đeo": "Đệm tai Memory Foam bọc da cừu tự nhiên siêu cao cấp"
    },
    featuresKO: [
      "스마트 자이로센서 기반의 실시간 360도 공간 음향 헤드트래킹 구현",
      "고해상도 6개 마이크가 장착되어 거센 바람 속에서도 수정처럼 맑은 통화품질 제공",
      "착용 감지 센서가 있어 헤드폰을 벗으면 일시정지, 쓰면 다시 자동 재생",
      "헤드폰 외부의 세련된 아날로그 메탈 다이얼을 통해 미세 볼륨 조절 가능"
    ],
    featuresVI: [
      "Công nghệ theo dõi chuyển động đầu thông minh tái tạo âm thanh vòm 360 độ",
      "Trang bị 6 mic độ phân giải cao mang lại cuộc gọi rõ nét như pha lê ngay cả trong gió mạnh",
      "Cảm biến tự động tạm dừng nhạc khi tháo tai nghe và phát tiếp khi đeo lại",
      "Núm xoay kim loại cơ học tinh tế bên ngoài giúp điều chỉnh âm lượng chuẩn xác"
    ],
    descriptionKO: "럭스사운드 아우라는 소리의 차원을 한 단계 높여줍니다. 외부 소음을 완벽히 차단하는 하이브리드 ANC 기술은 고객님을 고요한 클래식 음악 홀의 정중앙으로 안내합니다. 장인이 엄선한 이탈리아산 최고급 천연 양가죽 패드는 장시간 착용에도 압박감 없이 구름을 얹은 듯 포근한 착용감을 유지해 줍니다.",
    descriptionVI: "LuxSound Aura nâng tầm trải nghiệm âm thanh lên một chiều không gian hoàn toàn mới. Công nghệ chống ồn chủ động Hybrid ANC triệt tiêu mọi tạp âm, đưa bạn vào trung tâm của khán phòng âm nhạc cổ điển sang trọng nhất. Đệm tai bằng da cừu thật cao cấp được lựa chọn tỉ mỉ mang lại sự mềm mại hoàn hảo ngay cả khi sử dụng liên tục nhiều giờ.",
    colors: [
      { nameKO: "헤일로 화이트", nameVI: "Trắng Hào Quang", hex: "#f9fafb" },
      { nameKO: "옵시디언 블랙", nameVI: "Đen Đá Núi Lửa", hex: "#0f172a" },
      { nameKO: "럭셔리 새들 브라운", nameVI: "Nâu Yên Ngựa", hex: "#7c2d12" }
    ],
    isNew: false,
    isBest: true
  },
  {
    id: "lux-vision-infinity",
    category: "display",
    nameKO: "럭스비전 인피니티 (LuxVision Infinity)",
    nameVI: "LuxVision Infinity (Màn hình 8K)",
    tagKO: "인간의 시각 한계를 아득히 넘어서는 8K 곡면 디스플레이",
    tagVI: "Màn hình cong 8K vượt qua mọi giới hạn thị giác của con người",
    price: 4200000, // 4,200,000 KRW
    rating: 4.9,
    reviewsCount: 65,
    imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    specsKO: {
      "화면 크기": "49인치 울트라 와이드 (32:9 화면 비율)",
      "해상도": "8K UHD (7680 x 2160 초고해상도 Dual UHD)",
      "패널 종류": "곡률 1000R QD-OLED (Quantum Dot OLED)",
      "주사율/응답속도": "240Hz 주사율 / 0.03ms 초고속 GtG 응답속도",
      "색 표현력": "DCI-P3 99.3% 만족, 디바이스 자동 캘리브레이션 칩 내장",
      "최대 밝기": "2000nits 피크 밝기 (VESA DisplayHDR True Black 400 인증)"
    },
    specsVI: {
      "Kích thước": "49 inch Ultra-wide (Tỷ lệ màn hình siêu rộng 32:9)",
      "Độ phân giải": "8K UHD (Độ phân giải siêu cao 7680 x 2160 Dual UHD)",
      "Loại tấm nền": "Tấm nền cong 1000R QD-OLED (Quantum Dot OLED)",
      "Tần số & Phản hồi": "Tần số quét 240Hz / Tốc độ phản hồi siêu tốc 0.03ms (GtG)",
      "Độ bao phủ màu": "DCI-P3 99.3%, Tích hợp chip tự động hiệu chuẩn màu chuyên nghiệp",
      "Độ sáng tối đa": "Độ sáng đỉnh 2000nits (Chứng nhận VESA DisplayHDR True Black 400)"
    },
    featuresKO: [
      "1000R 곡률 설계로 인간의 주변부 시야각을 완전히 커버하여 극한의 몰입감 제공",
      "화면에 고정된 이미지가 있어도 번인을 완전 방지하는 전용 스마트 히트싱크 및 AI 가드 알고리즘",
      "뒷면에 은은한 조명 효과를 내는 럭스 앰비언트 글로우 LED 링 시스템 내장",
      "USB-C 케이블 하나로 90W 노트북 충전과 고해상도 비디오 입력을 동시 해결"
    ],
    featuresVI: [
      "Thiết kế cong 1000R ôm trọn tầm nhìn ngoại vi của mắt người, mang lại trải nghiệm nhập vai",
      "Thuật toán AI tự động bảo vệ chống lưu ảnh (burn-in) và hệ thống tản nhiệt thông minh chuyên biệt",
      "Tích hợp hệ thống vòng đèn LED ánh sáng thông minh Lux Ambient Glow ở mặt lưng",
      "Sử dụng duy nhất 1 cáp USB-C để sạc Laptop công suất 90W và truyền tải tín hiệu video 8K"
    ],
    descriptionKO: "럭스비전 인피니티는 가전 예술의 극치를 보여주는 32:9 와이드 디스플레이입니다. 독보적인 8K QD-OLED 화질이 뿜어내는 깊은 블랙과 오차 없는 완벽한 색 표현은 마치 창을 통해 실재하는 자연을 감상하는 것과 같은 생동감을 선물합니다. 고해상도 미디어 작업부터 박진감 넘치는 하이엔드 레이싱 시뮬레이션 게이밍까지 최고의 생산성과 화려한 만족을 선사합니다.",
    descriptionVI: "LuxVision Infinity là màn hình siêu rộng tỷ lệ 32:9 đỉnh cao nghệ thuật hiển thị. Tấm nền QD-OLED 8K mang lại chiều sâu sắc đen tuyệt đối và độ chuẩn màu không sai lệch, tựa như bạn đang ngắm nhìn thế giới tự nhiên chân thực qua ô cửa kính. Sản phẩm mang lại năng suất làm việc vượt trội và trải nghiệm giải trí tột cùng.",
    colors: [
      { nameKO: "메탈릭 실버", nameVI: "Bạc Ánh Kim", hex: "#e2e8f0" },
      { nameKO: "미드나잇 제트", nameVI: "Đen Tuyển", hex: "#020617" }
    ],
    isNew: false,
    isBest: false
  }
];

export const PRODUCTS: Product[] = applyCustomMediaToProducts(BASE_PRODUCTS, PRODUCT_CUSTOM_MEDIA_MAP);

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
    aVI: "Khi bạn đăng nhập và thanh toán với tư cách thành viên, ưu đãi giảm giá VIP 10% sẽ được tự động áp dụng ngay vào tổng hóa đơn. Bên cạnh đó, bạn cũng được tham gia chương trình đặc quyền VIP (Bảo hành 5 năm, cố vấn kỹ thuật tận nhà). Khách thường có thể mua hàng nhanh chóng nhưng thanh toán theo giá niêmết và được hưởng gói bảo hành tiêu chuẩn 1 năm."
  },
  {
    qKO: "프리미엄 VIP 배송 과정은 어떻게 되나요?",
    qVI: "Quy trình giao hàng VIP diễn ra như thế nào?",
    aKO: "결제가 완료되면 기재하신 휴대전화와 이메일로 고유 주문 안전 번호가 발송됩니다. 가전 설치 전문 출장 크루가 고객님께 사전에 연락드려 원하시는 세심한 설치 일정과 장소를 예약을 받은 후 무결점 VIP 무료 특송으로 방문 설치해 드립니다.",
    aVI: "Sau khi hoàn tất thanh toán, hệ thống sẽ gửi một mã đơn hàng an toàn qua số điện thoại và email của bạn. Đội ngũ kỹ sư lắp đặt chuyên nghiệp của chúng tôi sẽ chủ động liên hệ trước để xác nhận ngày giờ và lắp đặt miễn phí, bảo đảm không có bất kỳ thiếu sót nào."
  }
];
];
