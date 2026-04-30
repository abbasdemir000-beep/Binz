export type StationType = 'government' | 'private';

export interface Station {
  id: number;
  name: string;
  city: string;
  type: StationType;
  crowd: number | null; // 0-100
  wait: string;
  fresh: string;
  address?: string;
  note?: string;
}

export const cities = [
  'كركوك', 'أربيل', 'السليمانية', 'بغداد', 'الموصل', 'البصرة', 'النجف', 'كربلاء'
];

export const mockStations: Station[] = [
  { id: 1, name: 'محطة الشرقية', city: 'كركوك', type: 'government', crowd: 42, wait: '20 min', fresh: '2 min ago' },
  { id: 2, name: 'محطة عقبة بن نافع', city: 'كركوك', type: 'government', crowd: 72, wait: '90 min', fresh: '5 min ago' },
  { id: 3, name: 'KurdNeft KN01', city: 'أربيل', type: 'government', crowd: 55, wait: '45 min', fresh: '3 min ago' },
  { id: 4, name: 'KurdNeft KN09', city: 'أربيل', type: 'government', crowd: 25, wait: '10 min', fresh: '8 min ago' },
  { id: 5, name: 'Darwaza Oil', city: 'السليمانية', type: 'government', crowd: 63, wait: '70 min', fresh: '4 min ago' },
  { id: 6, name: 'Qaiwan 1 Gas Station', city: 'السليمانية', type: 'government', crowd: null, wait: 'Unknown', fresh: 'Old' },
  { id: 7, name: 'Mansour Station', city: 'بغداد', type: 'government', crowd: 85, wait: '120 min', fresh: '1 min ago' },
  { id: 8, name: 'Basra Central', city: 'البصرة', type: 'private', crowd: 30, wait: '15 min', fresh: '10 min ago' },
];
