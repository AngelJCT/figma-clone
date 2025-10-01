export type DeviceType = 'desktop' | 'tablet' | 'mobile' | 'custom';

export interface Template {
  id: string;
  name: string;
  deviceType: DeviceType;
  width: number;
  height: number;
  icon?: string;
}

export interface Artboard {
  id: string;
  name: string;
  templateId: string;
  position: {
    x: number;
    y: number;
  };
  width: number;
  height: number;
  backgroundColor: string;
  elements: string[];
}
