import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { resetPassword } from '../services/supabase';
import PasswordStrengthIndicator, { PasswordValidationState } from './PasswordStrengthIndicator';

const ResetPasswordForm: React.FC = () => {
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const passwordValidation = useMemo((): PasswordValidationState => {
    return {
      length: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      lowercase: /[a-z]/.test(newPassword),
      number: /[0-9]/.test(newPassword),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    };
  }, [newPassword]);

  const validatePassword = (password: string): { isValid: boolean; error?: string } => {
    if (password.length < 8) {
      return { isValid: false, error: 'Password must be at least 8 characters long' };
    }
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, error: 'Password must contain at least one uppercase letter' };
    }
    if (!/[a-z]/.test(password)) {
      return { isValid: false, error: 'Password must contain at least one lowercase letter' };
    }
    if (!/[0-9]/.test(password)) {
      return { isValid: false, error: 'Password must contain at least one number' };
    }
    return { isValid: true };
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      setMessage(validation.error || 'Invalid password');
      setIsError(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      setIsError(true);
      return;
    }

    setLoading(true);

    try {
      const result = await resetPassword(newPassword);

      if (result.success) {
        setMessage('Password reset successfully! Redirecting to app...');
        setIsError(false);
        setNewPassword('');
        setConfirmPassword('');

        setTimeout(() => {
          navigate('/app');
        }, 2000);
      } else {
        setMessage(result.error || 'Failed to reset password');
        setIsError(true);
      }
    } catch (error: any) {
      setIsError(true);
      setMessage(error.message || 'An unexpected error occurred');
      console.error('Password reset error:', error);
    } finally {
      setLoading(false);
    }
  };

  const inputBaseClasses = "block w-full h-11 rounded-lg border border-input bg-card text-foreground px-4 py-2 placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 transition-colors duration-200">
      <div className="max-w-md w-full bg-card border border-border rounded-2xl shadow-xl p-8 animate-fade-in transition-colors duration-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2 transition-colors duration-200">
            Reset Your Password
          </h2>
          <p className="text-muted-foreground transition-colors duration-200 text-sm">
            Enter your new password below
          </p>
        </div>

        {message && (
          <div
            className={`px-4 py-3 rounded-lg text-sm text-center mb-6 transition-colors duration-200 ${
              isError
                ? 'bg-destructive/15 text-destructive border border-destructive/20'
                : 'bg-success/15 text-success border border-success/20'
            }`}
            role="alert"
          >
            {message}
          </div>
        )}

        <form onSubmit={handleResetPassword} className="space-y-6">
          <div>
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-muted-foreground mb-2 transition-colors duration-200"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
                className={`${inputBaseClasses} pr-10`}
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary rounded-sm transition-colors duration-200"
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="size-5" aria-hidden="true" />
                ) : (
                  <Eye className="size-5" aria-hidden="true" />
                )}
              </button>
            </div>
            {newPassword && <PasswordStrengthIndicator validation={passwordValidation} />}
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-muted-foreground mb-2 transition-colors duration-200"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                className={`${inputBaseClasses} pr-10`}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary rounded-sm transition-colors duration-200"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                disabled={loading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-5" aria-hidden="true" />
                ) : (
                  <Eye className="size-5" aria-hidden="true" />
                )}
              </button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="mt-2 text-sm text-destructive transition-colors duration-200">
                Passwords do not match
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
            loading={loading}
            className="w-full h-11 text-base font-semibold"
          >
            Reset password
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Button
            variant="link"
            onClick={() => navigate('/login')}
            className="text-sm font-medium"
            type="button"
          >
            &larr; Back to login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
