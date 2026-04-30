import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';
import { motion } from 'motion/react';
import { Phone, LogIn, UserCircle } from 'lucide-react';

export default function Login() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');

  const handleLogin = () => {
    // In a real app, we'd validate and authenticate
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <div className="w-full max-w-[430px] flex flex-col min-h-screen">
        <header className="bg-gradient-to-br from-orange-500 to-orange-400 p-8 rounded-b-[40px] shadow-lg">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl font-black text-white tracking-tight">Binz</h1>
            <p className="text-orange-50 font-medium mt-2">{t('subtitle')}</p>
            <LanguageSelector />
          </motion.div>
        </header>

        <main className="flex-1 px-6 py-10 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-[32px] p-8 shadow-xl shadow-gray-200/50 border border-gray-100"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('login')}</h2>
            
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 start-4 flex items-center pointer-events-none">
                  <Phone size={18} className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  placeholder={t('phone')}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 ps-12 pe-4 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                />
              </div>

              <button
                onClick={handleLogin}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-200 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <LogIn size={20} />
                {t('enter')}
              </button>

              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">OR</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              <button
                onClick={() => navigate('/home')}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <UserCircle size={20} />
                {t('guest')}
              </button>
            </div>
          </motion.div>
        </main>

        <footer className="p-8 text-center">
          <p className="text-xs text-gray-400 font-medium">© 2026 Binz App. Made with ❤️</p>
        </footer>
      </div>
    </div>
  );
}
