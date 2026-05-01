import { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { signInAnonymously } from 'firebase/auth';
import { router } from './routes';
import { AuthProvider } from './context/AuthContext';
import { auth } from './lib/firebase';
import { seedInitialData } from './lib/firestore';
import '../styles/fonts.css';
import '../styles/theme.css';

function AppBootstrap() {
  useEffect(() => {
    (async () => {
      if (!auth.currentUser) await signInAnonymously(auth);
      await seedInitialData();
    })();
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
