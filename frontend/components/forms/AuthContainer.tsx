import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SignIn, SignUp } from '@clerk/react';
import ShaderBackground from '../ShaderBackground';
import InspirationCard from '../InspirationCard';
import { BookOpen } from 'lucide-react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ForgotPasswordForm from '../ForgotPasswordForm';
import InfoModal from '../InfoModal';

type AuthMode = 'login' | 'signup' | 'forgot-password';
type AuthProviderTab = 'clerk' | 'email';

const AuthContainer: React.FC = () => {
  const location = useLocation();
  const [mode, setMode] = useState<AuthMode>('login');
  const [providerTab, setProviderTab] = useState<AuthProviderTab>('clerk');
  const [showTerms, setShowTerms] = useState(false);

  // Handle initial route state
  useEffect(() => {
    if (location.state?.showSignup || location.pathname.includes('/signup')) {
      setMode('signup');
    } else {
      setMode('login');
    }
  }, [location.state, location.pathname]);

  const handleToggleForm = () => {
    setMode(prev => prev === 'login' ? 'signup' : 'login');
  };

  const handleForgotPassword = () => {
    setProviderTab('email');
    setMode('forgot-password');
  };

  const handleBackToLogin = () => {
    setMode('login');
  };

  const renderAuthContent = () => {
    if (providerTab === 'clerk') {
      return (
        <div className="flex flex-col items-center w-full">
          {mode === 'signup' ? (
            <SignUp
              routing="hash"
              signInUrl="/login"
              fallbackRedirectUrl="/dashboard"
            />
          ) : (
            <SignIn
              routing="hash"
              signUpUrl="/signup"
              fallbackRedirectUrl="/dashboard"
            />
          )}
          <button
            type="button"
            onClick={() => setProviderTab('email')}
            className="mt-4 text-xs text-muted-foreground hover:text-foreground underline transition-colors"
          >
            Or continue with email &amp; password form
          </button>
        </div>
      );
    }

    return (
      <div className="flex flex-col w-full">
        <button
          type="button"
          onClick={() => setProviderTab('clerk')}
          className="mb-4 text-xs text-primary hover:underline text-left transition-colors font-medium flex items-center gap-1"
        >
          &larr; Back to Clerk sign-in
        </button>
        {(() => {
          switch (mode) {
            case 'forgot-password':
              return <ForgotPasswordForm onBackToLogin={handleBackToLogin} />;
            case 'signup':
              return <SignupForm onToggleForm={handleToggleForm} />;
            case 'login':
            default:
              return (
                <LoginForm 
                  onToggleForm={handleToggleForm}
                  onForgotPassword={handleForgotPassword}
                />
              );
          }
        })()}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-3 sm:px-4 md:px-6 relative">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
        {/* Left side - Branding and Info */}
        <div className="hidden md:flex flex-col p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-8 sm:h-10 w-8 sm:w-10 text-foreground flex-shrink-0" />
            <h1 className="font-display font-['Preospe'] text-3xl sm:text-4xl font-bold uppercase tracking-wider text-foreground">
              Somma
            </h1>
          </div>
          <p className="text-muted-foreground text-base sm:text-lg mb-6">
            Your personalized AI study partner. Generate exams from your course materials and master any subject.
          </p>
          <div className="hidden lg:block">
            <InspirationCard />
          </div>
        </div>

        {/* Right side - Auth Forms */}
        <div className="w-full">
          <ShaderBackground className="p-4 sm:p-6 md:p-8">
            {showTerms && <InfoModal onClose={() => setShowTerms(false)} />}
            {renderAuthContent()}
          </ShaderBackground>
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;
