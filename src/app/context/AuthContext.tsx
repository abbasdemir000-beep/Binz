import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/firebase';

interface AppUser {
  uid: string;
  id: string;
  phoneNumber?: string | null;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  loginAnonymously: () => Promise<void>;
  sendOTP: (phone: string) => Promise<any>;
  confirmOTP: (result: any, otp: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapUser(user: any): AppUser | null {
  if (!user) return null;
  return {
    uid: user.id,
    id: user.id,
    phoneNumber: user.phone ?? null,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(mapUser(data.user));
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(mapUser(session?.user ?? null));
      setLoading(false);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  const loginAnonymously = async () => {
    const { error } = await supabase.auth.signInAnonymously();
    if (error) throw error;
  };

  const sendOTP = async (phone: string): Promise<any> => {
    const { error } = await supabase.auth.signInWithOtp({ phone });
    if (error) throw error;
    return { phone };
  };

  const confirmOTP = async (result: any, otp: string) => {
    const { error } = await supabase.auth.verifyOtp({ phone: result.phone, token: otp, type: 'sms' });
    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
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
