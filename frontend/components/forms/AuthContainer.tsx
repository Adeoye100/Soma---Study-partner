import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SignIn, SignUp } from '@clerk/react';
import ShaderBackground from '../ShaderBackground';
import InspirationCard from '../InspirationCard';
import InfoModal from '../InfoModal';
import AppIcon from '../AppIcon';

const AuthContainer: React.FC = () => {
  const location = useLocation();
  const [showTerms, setShowTerms] = useState(false);
  const isSignup = Boolean(location.state?.showSignup || location.pathname.includes('/signup'));

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-3 sm:px-4 md:px-6 relative">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
        {/* Left side - Branding and Info */}
        <div className="hidden md:flex flex-col p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <AppIcon className="h-9 sm:h-11 w-9 sm:w-11 rounded-full shrink-0" />
            <h1
              className="font-['Preospe'] text-3xl sm:text-4xl font-bold uppercase tracking-wider text-foreground"
              style={{ fontFamily: "'Preospe', sans-serif" }}
            >
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

        {/* Right side - Clerk Auth Alone */}
        <div className="w-full">
          <ShaderBackground className="p-4 sm:p-6 md:p-8">
            {showTerms && <InfoModal onClose={() => setShowTerms(false)} />}
            <div className="flex flex-col items-center w-full">
              {isSignup ? (
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
            </div>
          </ShaderBackground>
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;
