import { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { router } from './routes';
import { AuthProvider } from './context/AuthContext';
import { auth } from './lib/firebase';
import { seedInitialData } from './lib/firestore';
import '../styles/fonts.css';
import '../styles/theme.css';

function AppBootstrap() {
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        await signInAnonymously(auth);
        return;
      }
      try { await seedInitialData(); } catch (e) { console.error('Seed failed:', e); }
      unsub();
    });
    return unsub;
  }, []);
  return null;
}

function App() {
  return (
    <AuthProvider>
      <AppBootstrap />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
