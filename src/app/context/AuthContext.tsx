import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User, onAuthStateChanged, signInAnonymously,
  signInWithPhoneNumber, RecaptchaVerifier, ConfirmationResult, signOut,
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginAnonymously: () => Promise<void>;
  sendOTP: (phone: string) => Promise<ConfirmationResult>;
  confirmOTP: (result: ConfirmationResult, otp: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

let recaptchaVerifier: RecaptchaVerifier | null = null;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const loginAnonymously = async () => {
    await signInAnonymously(auth);
  };

  const sendOTP = async (phone: string): Promise<ConfirmationResult> => {
    if (!recaptchaVerifier) {
      recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
    }
    try {
      return await signInWithPhoneNumber(auth, phone, recaptchaVerifier);
    } catch (err) {
      recaptchaVerifier = null;
      throw err;
    }
  };

  const confirmOTP = async (result: ConfirmationResult, otp: string) => {
    await result.confirm(otp);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginAnonymously, sendOTP, confirmOTP, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
