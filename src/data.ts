import { Product } from './types';

/**
 * =========================================================================
 * 📢 [사용자 안내 가이드] 이미지 및 동영상 외부 URL 설정 안내
 * =========================================================================
 * 본 파일(data.ts)의 모든 상품 이미지(imageUrl)와 동영상(videoUrl)은 외부 URL을 사용합니다.
 * 
 * 이미지/비디오 변경 방법 (PostImg, ImgBB, Unsplash 등 사용):
 * - 원하는 이미지 또는 MP4 동영상을 업로드한 후 직접 링크 주소를 아래 상품의 'imageUrl' 또는 'videoUrl' 필드에 입력하십시오.
 * =========================================================================
 */

export const PRODUCTS: Product[] = [
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
  }
];

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
