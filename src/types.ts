export interface HeroMediaItem {
  id: string;
  type: 'photo' | 'video';
  titleKO: string;
  titleVI: string;
  url: string;
}

export interface SplitBgPanel {
  id: 'panel-1' | 'panel-2' | 'panel-3';
  type: 'photo' | 'video';
  url: string;
  titleKO?: string;
  titleVI?: string;
  tagKO?: string;
  tagVI?: string;
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
  price: number; // in KRW (South Korean Won) or converted to USD / VND
  rating: number;
  reviewsCount: number;
  imageUrl: string; // User can replace this with their ImgBB URL
  videoUrl?: string; // User can replace this with their direct MP4 URL
  specsKO: Record<string, string>;
  specsVI: Record<string, string>;
  featuresKO: string[];
  featuresVI: string[];
  descriptionKO: string;
  descriptionVI: string;
  colors: { nameKO: string; nameVI: string; hex: string }[];
  isNew?: boolean;
  isBest?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: { nameKO: string; nameVI: string; hex: string };
}

export interface UserSession {
  isLoggedIn: boolean;
  userType: 'member' | 'guest';
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface OrderDetails {
  id: string;
  userSession: UserSession;
  items: CartItem[];
  totalAmount: number;
  paymentMethod: string;
  orderDate: string;
  status: 'pending' | 'completed';
}
