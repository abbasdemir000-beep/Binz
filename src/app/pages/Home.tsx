import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { StationCard } from '../components/StationCard';
import { cities, mockStations } from '../lib/data';
import { motion } from 'motion/react';
import { MapPin, Search } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Home() {
  const { t } = useLanguage();
  const [selectedCity, setSelectedCity] = useState(cities[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStations = mockStations.filter(
    (s) => s.city === selectedCity && 
    (s.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="pb-24">
      <header className="bg-gradient-to-br from-orange-500 to-orange-400 p-6 rounded-b-[40px] shadow-lg sticky top-0 z-20">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-black text-white italic">Binz</h1>
          <div className="bg-white/20 px-3 py-1 rounded-full text-white text-xs font-bold border border-white/30 backdrop-blur-sm">
            LIVE
          </div>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <div className="absolute inset-y-0 start-4 flex items-center pointer-events-none">
              <MapPin size={16} className="text-orange-200" />
            </div>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-white/10 text-white border border-white/20 rounded-2xl py-3 ps-10 pe-4 focus:ring-2 focus:ring-white/30 outline-none appearance-none cursor-pointer font-bold"
            >
              {cities.map((city) => (
                <option key={city} value={city} className="text-gray-900">
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 start-4 flex items-center pointer-events-none">
              <Search size={16} className="text-orange-200" />
            </div>
            <input
              type="text"
              placeholder={t('near')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-gray-800 border-none rounded-2xl py-3 ps-10 pe-4 focus:ring-2 focus:ring-white/30 outline-none shadow-inner font-medium placeholder:text-gray-400"
            />
          </div>
        </div>
      </header>

      <main className="px-5 py-6">
        {/* Simple Map Visualization */}
        <div className="mb-8 overflow-hidden rounded-[32px] h-48 bg-slate-100 border border-gray-200 relative shadow-inner">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#e5e7eb_2px,transparent_2px)] [background-size:16px_16px]" />
          
          {/* Mock Road */}
          <div className="absolute top-[40%] left-[-20%] w-[140%] h-8 bg-gray-300 -rotate-12 shadow-sm" />
          <div className="absolute top-[-20%] left-[60%] w-8 h-[140%] bg-gray-300 rotate-12 shadow-sm" />

          {/* Station Pins */}
          {filteredStations.map((s, idx) => (
            <motion.div
              key={s.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="absolute cursor-pointer group"
              style={{
                top: `${20 + (idx * 25) % 60}%`,
                left: `${15 + (idx * 35) % 70}%`
              }}
            >
              <div className={cn(
                "w-8 h-8 rounded-full rounded-be-none flex items-center justify-center -rotate-45 shadow-lg border-2 border-white transition-transform group-hover:scale-110",
                s.crowd === null ? "bg-gray-500" : s.crowd < 50 ? "bg-green-500" : s.crowd < 70 ? "bg-yellow-500" : "bg-red-500"
              )}>
                <div className="rotate-45 text-white text-[10px] font-bold">⛽</div>
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white px-2 py-0.5 rounded-full text-[8px] font-bold shadow-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {s.name}
              </div>
            </motion.div>
          ))}
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-4 px-1">{t('near')}</h2>
        
        <div className="space-y-1">
          {filteredStations.length > 0 ? (
            filteredStations.map((s) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <StationCard station={s} />
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-2">⛽</div>
              <p className="text-gray-400 font-medium">{t('empty')}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
