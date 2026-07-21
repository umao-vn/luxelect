export interface TranslationSet {
  brand: string;
  slogan: string;
  allProducts: string;
  phones: string;
  laptops: string;
  audio: string;
  displays: string;
  newArrival: string;
  bestSeller: string;
  addToCart: string;
  buyNow: string;
  specs: string;
  features: string;
  colors: string;
  reviews: string;
  relatedProducts: string;
  backToList: string;
  cart: string;
  checkout: string;
  memberLogin: string;
  nonMemberCheckout: string;
  guestMode: string;
  guestDescription: string;
  memberDescription: string;
  loginSuccess: string;
  logout: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  completePayment: string;
  paymentSuccess: string;
  paymentSuccessDesc: string;
  orderNumber: string;
  backToHome: string;
  total: string;
  shippingFee: string;
  freeShipping: string;
  paymentMethod: string;
  bankTransfer: string;
  creditCard: string;
  eWallet: string;
  bankTransferDesc: string;
  emptyCart: string;
  items: string;
  topSectionTitle: string;
  topSectionDesc: string;
  middleSectionTitle: string;
  middleSectionDesc: string;
  bottomSectionTitle: string;
  bottomSectionDesc: string;
  memberDiscount: string;
  memberBenefits: string;
  guestNotice: string;
  faqTitle: string;
  faqDesc: string;
  contactUs: string;
  newsletterTitle: string;
  newsletterDesc: string;
  subscribe: string;
  copyright: string;
}

export const translations: Record<'ko' | 'vi', TranslationSet> = {
  ko: {
    brand: "LUX ELECTRONICS",
    slogan: "미래의 혁신을 입다, 프리미엄 가전 브랜드",
    allProducts: "전체 상품",
    phones: "스마트폰",
    laptops: "노트북",
    audio: "프리미엄 오디오",
    displays: "디스플레이",
    newArrival: "신상품",
    bestSeller: "베스트셀러",
    addToCart: "장바구니 담기",
    buyNow: "바로 구매하기",
    specs: "제품 사양 상세",
    features: "핵심 기술 기능",
    colors: "색상 선택",
    reviews: "고객 리뷰",
    relatedProducts: "함께 보면 좋은 프리미엄 제품",
    backToList: "목록으로 돌아가기",
    cart: "장바구니",
    checkout: "프리미엄 안전 결제",
    memberLogin: "회원 로그인 및 결제",
    nonMemberCheckout: "비회원 일반 결제",
    guestMode: "비회원으로 계속하기",
    guestDescription: "가입 없이 즉시 결제를 진행하며, 주문번호로 배송 현황 조회가 가능합니다.",
    memberDescription: "회원 가입 및 로그인 후 구매하시면 추가 10% 멤버십 할인을 제공받으실 수 있습니다.",
    loginSuccess: "인증되었습니다! 10% 회원 할인이 자동 적용됩니다.",
    logout: "로그아웃",
    fullName: "수령인 성명",
    email: "이메일 주소",
    phone: "연락처 (휴대폰)",
    address: "배송지 주소",
    completePayment: "주문 및 결제 완료하기",
    paymentSuccess: "럭셔리 에디션 주문 완료",
    paymentSuccessDesc: "고객님의 명품 전자제품 주문이 안전하게 접수되었습니다. 프리미엄 배송팀이 곧 연락드릴 예정입니다.",
    orderNumber: "안전 주문 번호",
    backToHome: "쇼핑 계속하기",
    total: "총 결제 금액",
    shippingFee: "배송비",
    freeShipping: "무료 배송 (VIP 특송)",
    paymentMethod: "프리미엄 결제 수단 선택",
    bankTransfer: "가상계좌 신속 무통장입금",
    creditCard: "신용카드 안전결제 (삼성/국민/현대)",
    eWallet: "간편 모바일 페이 (네이버/카카오/Toss)",
    bankTransferDesc: "신청 완료 후 30분 내에 임시 가상 계좌번호로 입금해 주셔야 주문이 최종 출고됩니다.",
    emptyCart: "장바구니가 비어 있습니다. 혁신적인 제품들을 만나보세요.",
    items: "개의 상품",
    topSectionTitle: "신세대 고품격 혁신 라인업",
    topSectionDesc: "전 세계 오피니언 리더들이 극찬한 가장 혁신적인 테크 디바이스를 한 곳에서 만나보십시오.",
    middleSectionTitle: "마스터피스 컬렉션",
    middleSectionDesc: "당신의 삶의 가치를 높여줄 고성능 전자제품 카테고리입니다.",
    bottomSectionTitle: "장인정신과 테크놀로지의 결합",
    bottomSectionDesc: "모든 디바이스는 최고 품질의 소재와 고도화된 정밀 가공 기술로 완성됩니다.",
    memberDiscount: "회원 상시 10% 특별 할인",
    memberBenefits: "회원 가입 시 무료 반품, 5년 품질 보증, 긴급 출장 서비스 등 VIP 혜택이 제공됩니다.",
    guestNotice: "비회원으로 구매 시 정가 결제 및 기본 1년 품질 보증만 적용됩니다.",
    faqTitle: "자주 묻는 질문 (FAQ)",
    faqDesc: "고객님들의 편의를 위해 배송, 품질보증, 결제 수단에 대한 정보를 모았습니다.",
    contactUs: "전문 컨설턴트 1:1 라이브 문의",
    newsletterTitle: "VIP 전용 뉴스레터 구독",
    newsletterDesc: "새로운 한정판 스마트 디바이스 소식 및 프리미엄 특별 할인 코드를 가장 먼저 받아보세요.",
    subscribe: "무료 소식 받기",
    copyright: "© 2026 LUX ELECTRONICS. All Rights Reserved. 본 사이트의 템플릿과 디자인은 상업적 명품 가전 유통에 최적화되어 있습니다.",
  },
  vi: {
    brand: "LUX ELECTRONICS",
    slogan: "Khoác lên mình sự đổi mới của tương lai, Thương hiệu thiết bị cao cấp",
    allProducts: "Tất cả sản phẩm",
    phones: "Điện thoại thông minh",
    laptops: "Máy tính xách tay",
    audio: "Âm thanh cao cấp",
    displays: "Màn hình hiển thị",
    newArrival: "Sản phẩm mới",
    bestSeller: "Bán chạy nhất",
    addToCart: "Thêm vào giỏ hàng",
    buyNow: "Mua ngay lập tức",
    specs: "Thông số kỹ thuật chi tiết",
    features: "Tính năng công nghệ cốt lõi",
    colors: "Chọn màu sắc",
    reviews: "Đánh giá của khách hàng",
    relatedProducts: "Sản phẩm cao cấp cùng loại",
    backToList: "Quay lại danh sách",
    cart: "Giỏ hàng",
    checkout: "Thanh toán an toàn cao cấp",
    memberLogin: "Đăng nhập thành viên & Thanh toán",
    nonMemberCheckout: "Thanh toán cho khách thường",
    guestMode: "Tiếp tục với tư cách khách",
    guestDescription: "Tiến hành thanh toán ngay mà không cần đăng ký. Bạn có thể tra cứu đơn hàng bằng mã đơn hàng.",
    memberDescription: "Mua hàng sau khi đăng ký & đăng nhập để nhận ngay ưu đãi giảm giá thành viên thêm 10%.",
    loginSuccess: "Đã xác thực! Giảm giá thành viên 10% được tự động áp dụng.",
    logout: "Đăng xuất",
    fullName: "Họ và tên người nhận",
    email: "Địa chỉ Email",
    phone: "Số điện thoại liên hệ",
    address: "Địa chỉ giao hàng",
    completePayment: "Hoàn tất đơn hàng & Thanh toán",
    paymentSuccess: "Đặt hàng phiên bản Luxury thành công",
    paymentSuccessDesc: "Đơn đặt hàng thiết bị điện tử cao cấp của quý khách đã được tiếp nhận an toàn. Đội ngũ giao hàng VIP sẽ liên hệ sớm nhất.",
    orderNumber: "Mã đơn hàng an toàn",
    backToHome: "Tiếp tục mua sắm",
    total: "Tổng số tiền thanh toán",
    shippingFee: "Phí vận chuyển",
    freeShipping: "Miễn phí vận chuyển (Hỏa tốc VIP)",
    paymentMethod: "Chọn phương thức thanh toán cao cấp",
    bankTransfer: "Chuyển khoản ngân hàng ảo nhanh chóng",
    creditCard: "Thẻ tín dụng an toàn (Visa/Mastercard/JCB)",
    eWallet: "Ví điện tử tiện lợi (Momo/ZaloPay/ShopeePay)",
    bankTransferDesc: "Quý khách vui lòng chuyển khoản trong vòng 30 phút vào số tài khoản ảo để đơn hàng được xuất kho.",
    emptyCart: "Giỏ hàng hiện tại đang trống. Hãy trải nghiệm những sản phẩm đột phá của chúng tôi.",
    items: " sản phẩm",
    topSectionTitle: "Dòng sản phẩm đổi mới đẳng cấp thế hệ mới",
    topSectionDesc: "Khám phá các thiết bị công nghệ đột phá nhất, được các chuyên gia và nhà lãnh đạo hàng đầu thế giới đánh giá cao.",
    middleSectionTitle: "Bộ sưu tập Kiệt tác",
    middleSectionDesc: "Danh mục thiết bị điện tử hiệu năng cao giúp nâng tầm giá trị cuộc sống của bạn.",
    bottomSectionTitle: "Sự kết hợp giữa nghệ thuật thủ công và công nghệ",
    bottomSectionDesc: "Mỗi thiết bị được hoàn thiện hoàn hảo từ các vật liệu tốt nhất và công nghệ chế tác chính xác cao.",
    memberDiscount: "Ưu đãi thành viên thường trực 10%",
    memberBenefits: "Đăng ký thành viên để hưởng các quyền lợi VIP như trả hàng miễn phí, bảo hành 5 năm, hỗ trợ khẩn cấp tận nơi.",
    guestNotice: "Mua hàng với tư cách khách sẽ thanh toán theo giá niêm yết và chỉ áp dụng bảo hành tiêu chuẩn 1 năm.",
    faqTitle: "Câu hỏi thường gặp (FAQ)",
    faqDesc: "Tổng hợp thông tin về giao hàng, bảo hành và các phương thức thanh toán để thuận tiện cho quý khách.",
    contactUs: "Tư vấn trực tiếp 1:1 với chuyên viên",
    newsletterTitle: "Đăng ký nhận bản tin dành riêng cho VIP",
    newsletterDesc: "Nhận tin tức sớm nhất về các thiết bị thông minh giới hạn và mã giảm giá đặc biệt cao cấp.",
    subscribe: "Nhận thông tin miễn phí",
    copyright: "© 2026 LUX ELECTRONICS. Bảo lưu mọi quyền. Giao diện tối ưu hóa cho phân phối thiết bị công nghệ cao cấp.",
  }
};
