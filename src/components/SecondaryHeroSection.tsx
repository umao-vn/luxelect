import React from 'react';
import HeroSection from './HeroSection';
import { HeroMediaItem, SplitBgConfig } from '../types';
import { TranslationSet } from '../translations';

interface SecondaryHeroSectionProps {
  heroMediaList: HeroMediaItem[];
  activeMediaId: string | null;
  onSelectActiveMedia: (id: string) => void;
  onOpenHeroMediaModal: (initialTab?: 'split' | 'single') => void;
  subMediaList?: HeroMediaItem[];
  activeSubMediaId?: string | null;
  onSelectActiveSubMedia?: (id: string) => void;
  onOpenSubMediaModal?: () => void;
  splitBgConfig?: SplitBgConfig;
  onUpdateSplitBgConfig?: (newConfig: SplitBgConfig) => void;
  t: TranslationSet;
  currentLang: 'ko' | 'vi';
  onScrollToProducts: () => void;
  onBannerClick?: () => void;
  isAdmin?: boolean;
  isDev?: boolean;
}

export default function SecondaryHeroSection(props: SecondaryHeroSectionProps) {
  return <HeroSection sectionId="SECONDARY_HERO" {...props} />;
}
