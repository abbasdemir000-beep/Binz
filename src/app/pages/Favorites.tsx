import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { StationCard } from '../components/StationCard';
import { type Station } from '../lib/data';
import { subscribeToFavorites, getFavoriteStations } from '../lib/firestore';
import { motion } from 'motion/react';
import { Heart, Loader2 } from 'lucide-react';

export default function Favorites() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }

    const unsub = subscribeToFavorites(user.uid, async (ids) => {
      const favStations = await getFavoriteStations(ids);
      setStations(favStations);
      setLoading(false);
    });
    return unsub;
  }, [user]);

  return (
    <div className="pb-24">
      <header className="bg-gradient-to-br from-orange-500 to-orange-400 p-8 rounded-b-[40px] shadow-lg">
        <h1 className="text-3xl font-black text-white italic">{t('fav')}</h1>
        <p className="text-orange-50 font-medium mt-1">Your most visited stations</p>
      </header>

      <main className="px-6 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="text-orange-500 animate-spin" />
          </div>
        ) : stations.length > 0 ? (
          <div className="space-y-4">
            {stations.map((s, idx) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <StationCard station={s} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Heart size={32} className="text-gray-300" />
            </div>
            <p className="text-gray-400 font-bold">{t('noFavs')}</p>
            <p className="text-gray-400 text-sm mt-1">Tap the ♥ on a station to save it here</p>
          </div>
        )}
      </main>
    </div>
  );
}
