import { useParams, useNavigate } from 'react-router';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { type Station } from '../lib/data';
import {
  subscribeToStation, reportCrowd,
  subscribeToFavorites, toggleFavorite,
} from '../lib/firestore';
import { motion } from 'motion/react';
import {
  ArrowLeft, Heart, Share2, MapPin, Clock,
  RefreshCcw, ShieldCheck, AlertCircle, Loader2,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

export default function StationDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [station, setStation] = useState<Station | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const unsub = subscribeToStation(id, (s) => {
      setStation(s);
      setLoading(false);
    });
    return unsub;
  }, [id]);

  useEffect(() => {
    if (!user) return;
    return subscribeToFavorites(user.uid, setFavorites);
  }, [user]);

  const isFav = id ? favorites.includes(id) : false;

  const handleReport = async (crowd: number) => {
    if (!id) return;
    try {
      await reportCrowd(id, crowd);
      toast.success(t('reported'), { description: `Reported ${crowd}% crowd level.` });
    } catch {
      toast.error('Failed to report. Try again.');
    }
  };

  const handleToggleFav = async () => {
    if (!user || !id) { toast.error('Login required'); return; }
    try {
      await toggleFavorite(user.uid, id, favorites);
      toast.success(isFav ? 'Removed from favorites' : t('saved'));
    } catch {
      toast.error('Failed to update favorites');
    }
  };

  const getCrowdGradient = (crowd: number | null) => {
    if (crowd === null) return 'from-gray-500 to-gray-600';
    if (crowd < 50) return 'from-green-500 to-green-600';
    if (crowd < 70) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 size={40} className="text-orange-500 animate-spin" />
      </div>
    );
  }

  if (!station) {
    return <div className="p-10 text-center text-gray-400 font-medium">{t('empty')}</div>;
  }

  return (
    <div className="pb-24">
      <div className={cn(
        "bg-gradient-to-br p-6 pt-10 rounded-b-[48px] shadow-xl text-white relative",
        getCrowdGradient(station.crowd)
      )}>
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md hover:bg-white/30 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleToggleFav}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all",
                isFav ? "bg-white text-orange-500" : "bg-white/20 hover:bg-white/30"
              )}
            >
              <Heart size={20} fill={isFav ? 'currentColor' : 'none'} />
            </button>
            <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md hover:bg-white/30 transition-all">
              <Share2 size={20} />
            </button>
          </div>
        </div>

        <div className="text-center pb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-7xl font-black italic mb-2 tracking-tighter"
          >
            {station.crowd === null ? '--' : `${station.crowd}%`}
          </motion.div>
          <h1 className="text-3xl font-bold mb-1">{station.name}</h1>
          <p className="opacity-90 font-medium flex items-center justify-center gap-1">
            <MapPin size={16} /> {station.city} • {t(station.type)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-white/10 rounded-3xl p-4 backdrop-blur-md border border-white/10">
            <div className="flex items-center gap-2 mb-1 opacity-80">
              <Clock size={14} />
              <span className="text-xs font-bold uppercase">{t('wait')}</span>
            </div>
            <div className="text-xl font-bold">{station.wait}</div>
          </div>
          <div className="bg-white/10 rounded-3xl p-4 backdrop-blur-md border border-white/10">
            <div className="flex items-center gap-2 mb-1 opacity-80">
              <RefreshCcw size={14} />
              <span className="text-xs font-bold uppercase">{t('last')}</span>
            </div>
            <div className="text-xl font-bold">{station.fresh}</div>
          </div>
        </div>
      </div>

      <main className="px-6 py-10">
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-6">
            <AlertCircle size={20} className="text-orange-500" />
            <h2 className="text-xl font-bold text-gray-900">{t('report')}</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={() => handleReport(25)}
              className="bg-green-50 hover:bg-green-100 border-2 border-green-200 rounded-3xl p-5 text-start transition-all"
            >
              <div className="text-green-700 font-bold text-lg">0% – 49%</div>
              <p className="text-green-600/70 text-sm">{t('check')} • Low queue</p>
            </button>
            <button
              onClick={() => handleReport(55)}
              className="bg-yellow-50 hover:bg-yellow-100 border-2 border-yellow-200 rounded-3xl p-5 text-start transition-all"
            >
              <div className="text-yellow-700 font-bold text-lg">50% – 69%</div>
              <p className="text-yellow-600/70 text-sm">{t('check')} • Medium queue</p>
            </button>
            <button
              onClick={() => handleReport(85)}
              className="bg-red-50 hover:bg-red-100 border-2 border-red-200 rounded-3xl p-5 text-start transition-all"
            >
              <div className="text-red-700 font-bold text-lg">70% – 100%</div>
              <p className="text-red-600/70 text-sm">{t('check')} • Heavy queue</p>
            </button>
          </div>
        </section>

        <section>
          <div className="bg-blue-50 rounded-[32px] p-6 border border-blue-100 flex items-start gap-4">
            <div className="bg-blue-500 text-white p-2 rounded-2xl">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="font-bold text-blue-900 mb-1">Crowdsourced Data</h3>
              <p className="text-sm text-blue-700/80 leading-relaxed">
                This info is updated by users like you who are at the station. Help others by reporting!
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
