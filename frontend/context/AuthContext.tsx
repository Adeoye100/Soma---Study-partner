import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useAuth as useClerkAuth, useUser as useClerkUser } from '@clerk/react';
import { supabase } from '@/services/supabase';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  loading: true,
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { isLoaded: clerkLoaded, isSignedIn: clerkSignedIn } = useClerkAuth();
  const { user: clerkUser } = useClerkUser();

  const [supabaseSession, setSupabaseSession] = useState<Session | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [supabaseLoading, setSupabaseLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const hydrateSession = async (): Promise<void> => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        if (error) {
          console.error('[AuthContext] Session hydration error:', error);
          setSupabaseSession(null);
          setSupabaseUser(null);
        } else {
          setSupabaseSession(session);
          setSupabaseUser(session?.user ?? null);
        }
      } catch (err) {
        console.error('[AuthContext] Unexpected error during hydration:', err);
        if (isMounted) {
          setSupabaseSession(null);
          setSupabaseUser(null);
        }
      } finally {
        if (isMounted) {
          setSupabaseLoading(false);
        }
      }
    };

    hydrateSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, nextSession) => {
        console.log('[AuthContext] auth event:', event, 'session:', !!nextSession);
        
        if (isMounted) {
          setSupabaseSession(nextSession);
          setSupabaseUser(nextSession?.user ?? null);
          setSupabaseLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const mappedClerkUser: User | null = (clerkSignedIn && clerkUser)
    ? ({
        id: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress || clerkUser.username || 'user@somma.app',
        user_metadata: {
          full_name: clerkUser.fullName || clerkUser.firstName || 'Learner',
          avatar_url: clerkUser.imageUrl || '',
        },
        app_metadata: { provider: 'clerk' },
        aud: 'authenticated',
        created_at: clerkUser.createdAt ? new Date(clerkUser.createdAt).toISOString() : new Date().toISOString(),
      } as unknown as User)
    : null;

  const mappedClerkSession: Session | null = (clerkSignedIn && mappedClerkUser)
    ? ({
        access_token: 'clerk_active_session',
        refresh_token: '',
        expires_in: 3600,
        token_type: 'bearer',
        user: mappedClerkUser,
      } as unknown as Session)
    : null;

  const effectiveUser = mappedClerkUser || supabaseUser;
  const effectiveSession = mappedClerkSession || supabaseSession;
  const effectiveLoading = !clerkLoaded || (supabaseLoading && !clerkSignedIn);

  return (
    <AuthContext.Provider value={{ session: effectiveSession, user: effectiveUser, loading: effectiveLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => useContext(AuthContext);

export default AuthProvider;
