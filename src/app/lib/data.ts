export type StationType = 'government' | 'private';

export interface Station {
  id: string;
  name: string;
  city: string;
  type: StationType;
  crowd: number | null;
  wait: string;
  fresh: string;
  address?: string;
  note?: string;
}

export const cities = [
  'كركوك', 'أربيل', 'السليمانية', 'بغداد', 'الموصل', 'البصرة', 'النجف', 'كربلاء'
];

export const mockStations: Station[] = [
  // كركوك
  { id: '1',  name: 'محطة الشرقية',         city: 'كركوك',       type: 'government', crowd: 42, wait: '20 min',  fresh: '2 min ago' },
  { id: '2',  name: 'محطة عقبة بن نافع',    city: 'كركوك',       type: 'government', crowd: 72, wait: '90 min',  fresh: '5 min ago' },
  // أربيل
  { id: '3',  name: 'KurdNeft KN01',         city: 'أربيل',       type: 'government', crowd: 55, wait: '45 min',  fresh: '3 min ago' },
  { id: '4',  name: 'KurdNeft KN09',         city: 'أربيل',       type: 'government', crowd: 25, wait: '10 min',  fresh: '8 min ago' },
  // السليمانية
  { id: '5',  name: 'Darwaza Oil',           city: 'السليمانية',  type: 'government', crowd: 63, wait: '70 min',  fresh: '4 min ago' },
  { id: '6',  name: 'Qaiwan 1 Gas Station', city: 'السليمانية',  type: 'government', crowd: null, wait: 'Unknown', fresh: 'Old' },
  // بغداد
  { id: '7',  name: 'Mansour Station',       city: 'بغداد',       type: 'government', crowd: 85, wait: '120 min', fresh: '1 min ago' },
  { id: '8',  name: 'محطة الكرخ',           city: 'بغداد',       type: 'private',    crowd: 40, wait: '20 min',  fresh: '6 min ago' },
  // الموصل
  { id: '9',  name: 'محطة الموصل المركزية', city: 'الموصل',      type: 'government', crowd: 60, wait: '60 min',  fresh: '3 min ago' },
  { id: '10', name: 'محطة الموصل الغربية',  city: 'الموصل',      type: 'private',    crowd: 30, wait: '10 min',  fresh: '7 min ago' },
  // البصرة
  { id: '11', name: 'Basra Central',         city: 'البصرة',      type: 'private',    crowd: 30, wait: '15 min',  fresh: '10 min ago' },
  { id: '12', name: 'محطة الفاو',           city: 'البصرة',      type: 'government', crowd: 50, wait: '40 min',  fresh: '5 min ago' },
  // النجف
  { id: '13', name: 'محطة الإمام علي',      city: 'النجف',       type: 'government', crowd: 45, wait: '25 min',  fresh: '4 min ago' },
  { id: '14', name: 'النجف للبنزين',        city: 'النجف',       type: 'private',    crowd: 80, wait: '110 min', fresh: '2 min ago' },
  // كربلاء
  { id: '15', name: 'محطة كربلاء المقدسة', city: 'كربلاء',      type: 'government', crowd: 55, wait: '45 min',  fresh: '5 min ago' },
  { id: '16', name: 'محطة الحسين',          city: 'كربلاء',      type: 'private',    crowd: 20, wait: '5 min',   fresh: '1 min ago' },
];
