import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/services/supabase';

const AuthCallback = (): JSX.Element => {
  const navigate = useNavigate();
  const hasExchanged = useRef<boolean>(false);

  useEffect(() => {
    console.log('[AuthCallback] Mount fired. href:', window.location.href);
    console.log('[AuthCallback] hasExchanged:', hasExchanged.current);

    if (hasExchanged.current) {
      console.log('[AuthCallback] Already exchanged, skipping');
      return;
    }
    hasExchanged.current = true;

    const processCallback = async (): Promise<void> => {
      try {
        const url = new URL(window.location.href);
        const params = url.searchParams;
        const hash = new URLSearchParams(url.hash.replace('#', ''));

        console.log('[AuthCallback] URL on arrival:', window.location.href);
        console.log('[AuthCallback] params:', Object.fromEntries(params.entries()));
        console.log('[AuthCallback] hash:', Object.fromEntries(hash.entries()));

        const errorParam = params.get('error');
        if (errorParam) {
          console.error('[AuthCallback] Upstream error from URL:', errorParam);
          navigate(`/login?error=oauth_failed&reason=${errorParam}`, { replace: true });
          return;
        }

        const code = params.get('code');
        if (!code || code.trim() === '') {
          console.error('[AuthCallback] No code in URL');
          navigate('/login?error=oauth_failed&reason=no_code_in_url', { replace: true });
          return;
        }

        console.log('[AuthCallback] Exchanging code for session...');
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          console.error('[AuthCallback] Exchange error:', error.message);
          navigate('/login?error=oauth_failed&reason=exchange_failed', { replace: true });
          return;
        }

        if (!data.session) {
          console.error('[AuthCallback] No session returned');
          navigate('/login?error=oauth_failed&reason=exchange_failed', { replace: true });
          return;
        }

        const { data: sessionCheck } = await supabase.auth.getSession();
        console.log('[AuthCallback] Session available:', !!sessionCheck.session);
        
        if (!sessionCheck.session) {
          console.error('[AuthCallback] Session not available after exchange');
          navigate('/login?error=oauth_failed&reason=exchange_failed', { replace: true });
          return;
        }

        console.log('[AuthCallback] Success, redirecting to dashboard');
        navigate('/dashboard', { replace: true });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown OAuth error';
        console.error('[AuthCallback] Session exchange failed:', message);
        navigate(`/login?error=oauth_failed&reason=exchange_failed`, { replace: true });
      }
    };

    void processCallback();
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen bg-background text-foreground">
      <div role="status" aria-live="polite" className="text-center">
        <div className="w-10 h-10 border-[3px] border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground text-sm">Authenticating, please wait...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
