import { useLanguage } from '../context/LanguageContext';
import { cn } from '../lib/utils';

export function LanguageSelector() {
  const { lang, setLang } = useLanguage();

  const langs = [
    { code: 'ar', label: 'عربي' },
    { code: 'ku', label: 'کوردی' },
    { code: 'en', label: 'English' },
  ];

  return (
    <div className="flex gap-2 mt-4">
      {langs.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code as any)}
          className={cn(
            "flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all border",
            lang === l.code
              ? "bg-white text-orange-600 border-white shadow-sm"
              : "bg-white/20 text-white border-white/30 hover:bg-white/30"
          )}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
