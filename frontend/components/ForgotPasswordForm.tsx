import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { authService } from '../services/authService';

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBackToLogin }) => {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Please enter a valid email address.');
      setIsError(true);
      return;
    }

    setLoading(true);
    setMessage('');
    setIsError(false);

    try {
      const { success, message, error } = await authService.forgotPassword(
        email,
        `${window.location.origin}/reset-password`
      );
      
      if (!success) {
        throw new Error(error?.message || 'Failed to send reset email');
      }
      
      setMessage(message || 'Password reset email sent! Please check your inbox.');
      setEmail('');
    } catch (error: any) {
      setIsError(true);
      setMessage(error.message || 'An unknown error occurred during password reset.');
      console.error('Password reset error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-center text-foreground mb-2 transition-colors duration-200">
        Forgot Password?
      </h2>
      <p className="text-center text-muted-foreground mb-6 transition-colors duration-200 text-sm">
        Enter your email to receive a reset link.
      </p>

      {message && (
        <div
          className={`px-4 py-2 rounded-lg text-sm text-center mb-4 transition-colors duration-200 ${
            isError
              ? 'bg-destructive/15 text-destructive border border-destructive/20'
              : 'bg-success/15 text-success border border-success/20'
          }`}
          role="alert"
        >
          {message}
        </div>
      )}

      <form onSubmit={handlePasswordReset} className="space-y-6">
        <div>
          <label htmlFor="reset-email" className="block text-sm font-medium text-muted-foreground transition-colors duration-200">
            Email address
          </label>
          <input
            id="reset-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="mt-1 block h-10 w-full rounded-md border border-input bg-card text-foreground py-2 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 transition-colors duration-200"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <Button
            type="submit"
            disabled={loading}
            loading={loading}
            className="w-full"
          >
            Send reset link
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <Button
          variant="link"
          onClick={onBackToLogin}
          className="font-semibold text-sm"
          type="button"
        >
          &larr; Back to login
        </Button>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
