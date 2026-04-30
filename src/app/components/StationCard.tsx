import { Station } from '../lib/data';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../lib/utils';
import { Clock, RefreshCcw, ChevronRight } from 'lucide-react';
import { Link } from 'react-router';

interface StationCardProps {
  station: Station;
}

export function StationCard({ station }: StationCardProps) {
  const { t } = useLanguage();

  const getCrowdColor = (crowd: number | null) => {
    if (crowd === null) return 'bg-gray-400';
    if (crowd < 50) return 'bg-green-500';
    if (crowd < 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Link
      to={`/station/${station.id}`}
      className="group relative bg-white rounded-3xl p-5 mb-4 shadow-sm border border-gray-100 hover:shadow-md transition-all overflow-hidden block"
    >
      <div
        className={cn(
          "absolute inset-0 opacity-5 transition-opacity group-hover:opacity-10",
          getCrowdColor(station.crowd)
        )}
      />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">{station.name}</h3>
            <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold uppercase mt-1">
              {t(station.type)}
            </span>
          </div>
          <div className="text-right">
            <div className={cn(
              "text-3xl font-black italic",
              station.crowd === null ? "text-gray-400" : 
              station.crowd < 50 ? "text-green-600" : 
              station.crowd < 70 ? "text-yellow-600" : "text-red-600"
            )}>
              {station.crowd === null ? '--' : `${station.crowd}%`}
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-3">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock size={14} className="text-orange-500" />
            <span>{t('wait')}: {station.wait}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <RefreshCcw size={14} className="text-orange-500" />
            <span>{t('last')}: {station.fresh}</span>
          </div>
        </div>
      </div>
      
      <div className="absolute top-1/2 -translate-y-1/2 end-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight size={20} className="text-orange-500" />
      </div>
    </Link>
  );
}
