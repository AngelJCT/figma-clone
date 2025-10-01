import { Template } from '@/types';

export const DESKTOP_TEMPLATES: Template[] = [
  { id: 'desktop-1', name: 'Desktop HD', deviceType: 'desktop', width: 1920, height: 1080 },
  { id: 'desktop-2', name: 'Desktop WXGA+', deviceType: 'desktop', width: 1440, height: 900 },
  { id: 'desktop-3', name: 'Desktop HD', deviceType: 'desktop', width: 1366, height: 768 },
];

export const TABLET_TEMPLATES: Template[] = [
  { id: 'tablet-1', name: 'iPad', deviceType: 'tablet', width: 768, height: 1024 },
  { id: 'tablet-2', name: 'iPad Pro 11"', deviceType: 'tablet', width: 834, height: 1194 },
  { id: 'tablet-3', name: 'iPad Pro 12.9"', deviceType: 'tablet', width: 1024, height: 1366 },
];

export const MOBILE_TEMPLATES: Template[] = [
  { id: 'mobile-1', name: 'iPhone X/XS', deviceType: 'mobile', width: 375, height: 812 },
  { id: 'mobile-2', name: 'iPhone 12/13', deviceType: 'mobile', width: 390, height: 844 },
  { id: 'mobile-3', name: 'Android', deviceType: 'mobile', width: 360, height: 800 },
];

export const ALL_TEMPLATES = [...DESKTOP_TEMPLATES, ...TABLET_TEMPLATES, ...MOBILE_TEMPLATES];
