export interface HeroMediaItem {
  id: string;
  type: 'photo' | 'video';
  title?: string;
  titleKO: string;
  titleVI: string;
  subtitle?: string;
  subtitleKO?: string;
  subtitleVI?: string;
  url: string;
  targetProductId?: string;
}

export interface SplitBgPanel {
  id: 'panel-1' | 'panel-2' | 'panel-3';
  type: 'photo' | 'video';
  url: string;
  titleKO?: string;
  titleVI?: string;
  tagKO?: string;
  tagVI?: string;
  targetProductId?: string;
}

export interface SplitBgConfig {
  isEnabled: boolean;
  panels: [SplitBgPanel, SplitBgPanel, SplitBgPanel];
}

export interface SubBgMediaItem {
  url: string;
  type: 'video' | 'photo';
  titleKO?: string;
  titleVI?: string;
  badgeKO?: string;
  badgeVI?: string;
  subtitleKO?: string;
  subtitleVI?: string;
}

export interface CategoryItem {
  id: string;
  labelKO: string;
  labelVI: string;
  isAdminOnly?: boolean;
}

export interface CategorySubMenu {
  titleKO: string;
  titleVI: string;
  subCategoriesKO: string[];
  subCategoriesVI: string[];
}

export type CategoryType = string;

export interface Product {
  id: string;
  category: CategoryType;
  nameKO: string;
  nameVI: string;
  tagKO: string;
  tagVI: string;
  price: number; // in KRW
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  videoUrl?: string;
  specsKO: Record<string, string>;
  specsVI: Record<string, string>;
  featuresKO: string[];
  featuresVI: string[];
  descriptionKO: string;
  descriptionVI: string;
  colors: { nameKO: string; nameVI: string; hex: string }[];
  isNew?: boolean;
  isBest?: boolean;
  stock?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: { nameKO: string; nameVI: string; hex: string };
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  provider: 'email' | 'kakao' | 'naver' | 'google' | 'guest';
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSession {
  isLoggedIn: boolean;
  userType: 'member' | 'guest';
  uid?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  provider?: string;
  photoURL?: string;
}

export type OrderStatus = 'PENDING' | 'PAID' | 'CANCELLED' | 'FAILED' | 'SHIPPED' | 'DELIVERED';

export interface OrderDetails {
  id: string;
  orderId: string;
  userId: string;
  userEmail: string;
  userName: string;
  userPhone?: string;
  userAddress?: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod?: string;
  paymentKey?: string;
  orderName: string;
  approvedAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
  createdAt: string;
  updatedAt: string;
}
