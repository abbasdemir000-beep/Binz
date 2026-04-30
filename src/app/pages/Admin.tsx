import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';
import { ShieldCheck, Check, X, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface PendingStation {
  id: number;
  name: string;
  city: string;
  type: string;
  address: string;
}

export default function Admin() {
  const { t } = useLanguage();
  const [pending, setPending] = useState<PendingStation[]>([
    { id: 101, name: 'Karbala Main Station', city: 'كربلاء', type: 'government', address: 'Near Holy Shrine' },
    { id: 102, name: 'Najaf Gate Petrol', city: 'النجف', type: 'private', address: 'Old City Road' },
  ]);

  const handleApprove = (id: number) => {
    setPending(pending.filter(p => p.id !== id));
    toast.success('Station Approved!');
  };

  const handleReject = (id: number) => {
    setPending(pending.filter(p => p.id !== id));
    toast.error('Station Rejected');
  };

  return (
    <div className="pb-24">
      <header className="bg-slate-900 p-8 rounded-b-[40px] shadow-lg">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-orange-500" size={32} />
          <h1 className="text-3xl font-black text-white italic">{t('admin')}</h1>
        </div>
        <p className="text-slate-400 font-medium mt-1">Moderation Dashboard</p>
      </header>

      <main className="px-6 py-8">
        <div className="space-y-4">
          {pending.length > 0 ? (
            pending.map((p, idx) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-[32px] p-6 shadow-md border-s-8 border-orange-500"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{p.name}</h3>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full uppercase">
                      {p.city}
                    </span>
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full uppercase">
                      {t(p.type)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-2 italic">{p.address}</p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(p.id)}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-all"
                  >
                    <Check size={18} /> {t('approve')}
                  </button>
                  <button
                    onClick={() => handleReject(p.id)}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-500 font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-all border border-red-100"
                  >
                    <X size={18} /> {t('reject')}
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-20 flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <AlertCircle size={32} className="text-gray-300" />
              </div>
              <p className="text-gray-400 font-bold">No pending reviews</p>
              <p className="text-gray-400 text-sm mt-1">Everything is up to date!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
