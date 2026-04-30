import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'ar' | 'ku' | 'en';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

export const translations: Translations = {
  ar: {
    dir: 'rtl',
    appName: 'Binz',
    subtitle: 'تطبيق زحام محطات البنزين',
    login: 'تسجيل الدخول',
    phone: 'رقم الهاتف',
    enter: 'دخول',
    guest: 'دخول كضيف',
    city: 'اختر المدينة',
    near: 'المحطات القريبة',
    wait: 'وقت الانتظار',
    last: 'آخر تحديث',
    report: 'تبليغ عن الزحام',
    check: 'أنا بالمحطة',
    fav: 'المفضلة',
    admin: 'الأدمن',
    add: 'إضافة محطة جديدة',
    send: 'إرسال للمراجعة',
    pending: 'بانتظار الموافقة',
    approve: 'موافقة',
    reject: 'رفض',
    home: 'الرئيسية',
    sName: 'اسم المحطة',
    sAddress: 'العنوان',
    sCity: 'المدينة',
    sType: 'نوع المحطة',
    sNote: 'ملاحظة اختيارية',
    government: 'حكومية',
    private: 'أهلية',
    empty: 'لا توجد محطات',
    noFavs: 'لا توجد محطات مفضلة',
    saved: 'تم الحفظ',
    reported: 'شكراً لتبليغك!',
    loading: 'جاري التحميل...',
  },
  ku: {
    dir: 'rtl',
    appName: 'Binz',
    subtitle: 'قەرەباڵغی وێستگەی بەنزین',
    login: 'چوونەژوورەوە',
    phone: 'ژمارەی مۆبایل',
    enter: 'چوونەژوورەوە',
    guest: 'وەک میوان',
    city: 'شار هەڵبژێرە',
    near: 'وێستگە نزیکەکان',
    wait: 'کاتی چاوەڕوانی',
    last: 'دوایین نوێکردنەوە',
    report: 'ڕاپۆرتی قەرەباڵغی',
    check: 'لە وێستگەکەم',
    fav: 'دڵخوازەکان',
    admin: 'ئەدمین',
    add: 'زیادکردنی وێستگە',
    send: 'ناردن بۆ پێداچوونەوە',
    pending: 'چاوەڕوانی پەسەندکردن',
    approve: 'پەسەند',
    reject: 'ڕەتکردنەوە',
    home: 'سەرەکی',
    sName: 'ناوی وێستگە',
    sAddress: 'ناونیشان',
    sCity: 'شار',
    sType: 'جۆری وێستگە',
    sNote: 'تێبینی ئارەزوومەندانە',
    government: 'حکومی',
    private: 'ئەهلی',
    empty: 'هیچ وێستگەیەک نییە',
    noFavs: 'هیچ وێستگەیەکی دڵخواز نییە',
    saved: 'پاشەکەوت کرا',
    reported: 'سوپاس بۆ ڕاپۆرتەکەت!',
    loading: 'کاردەکات...',
  },
  en: {
    dir: 'ltr',
    appName: 'Binz',
    subtitle: 'Live fuel station queue app',
    login: 'Login',
    phone: 'Phone number',
    enter: 'Enter',
    guest: 'Continue as guest',
    city: 'Choose city',
    near: 'Nearby stations',
    wait: 'Wait time',
    last: 'Last update',
    report: 'Report crowd',
    check: 'I am at station',
    fav: 'Favorites',
    admin: 'Admin',
    add: 'Add new station',
    send: 'Send for review',
    pending: 'Pending review',
    approve: 'Approve',
    reject: 'Reject',
    home: 'Home',
    sName: 'Station Name',
    sAddress: 'Address',
    sCity: 'City',
    sType: 'Station Type',
    sNote: 'Optional note',
    government: 'Government',
    private: 'Private',
    empty: 'No stations found',
    noFavs: 'No favorite stations',
    saved: 'Saved successfully',
    reported: 'Thanks for reporting!',
    loading: 'Loading...',
  },
};

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('ar');

  useEffect(() => {
    document.documentElement.dir = translations[lang].dir;
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key: string) => translations[lang][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
