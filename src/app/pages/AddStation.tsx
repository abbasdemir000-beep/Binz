import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { cities } from '../lib/data';
import { motion } from 'motion/react';
import { Plus, Info, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

export default function AddStation() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: cities[0],
    type: 'government',
    note: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Please enter station name');
      return;
    }
    toast.success(t('pending'), {
      description: 'Your submission will be reviewed by our team.',
      icon: <CheckCircle2 className="text-green-500" />,
    });
    // In a real app, send to backend
    setTimeout(() => navigate('/home'), 2000);
  };

  return (
    <div className="pb-24">
      <header className="bg-gradient-to-br from-orange-500 to-orange-400 p-8 rounded-b-[40px] shadow-lg">
        <h1 className="text-3xl font-black text-white italic">{t('add')}</h1>
        <p className="text-orange-50 font-medium mt-1">Help us expand our map</p>
      </header>

      <main className="px-6 py-8">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-[32px] p-6 shadow-xl shadow-gray-200/50 border border-orange-100 border-dashed"
        >
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                {t('sName')}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Al-Mansour Station"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-4 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                {t('sAddress')}
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Street or area name"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-4 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                  {t('sCity')}
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-4 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all appearance-none cursor-pointer"
                >
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                  {t('sType')}
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-4 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="government">{t('government')}</option>
                  <option value="private">{t('private')}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                {t('sNote')}
              </label>
              <textarea
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                rows={3}
                placeholder="Working hours, petrol types, etc."
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-4 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all resize-none"
              />
            </div>

            <div className="bg-orange-50 rounded-2xl p-4 flex items-start gap-3 border border-orange-100">
              <Info size={18} className="text-orange-500 shrink-0 mt-0.5" />
              <p className="text-xs text-orange-800 leading-relaxed font-medium">
                New stations must be verified by our team before appearing on the public map.
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-5 rounded-3xl shadow-xl shadow-orange-200 flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-lg uppercase tracking-tight"
            >
              <Plus size={24} strokeWidth={3} />
              {t('send')}
            </button>
          </div>
        </motion.form>
      </main>
    </div>
  );
}
