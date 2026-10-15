import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { authService } from '../../services/authService';
import EmailField from './EmailField';
import PasswordField from './PasswordField';
import { Avatar, AvatarImage, AvatarFallback } from '../Avatar';
import PasswordStrengthIndicator, { PasswordValidationState } from '../PasswordStrengthIndicator';
import { validateEmail, validatePassword, validateUsername, validateGender, calculatePasswordStrength, formatAuthError, validateRedirect } from '../../utils/authValidation';
import { SparklesIcon } from '../icons';

interface SignupFormProps {
  onToggleForm: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onToggleForm }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: 'male' as 'male' | 'female' | 'other'
  });
  const [errors, setErrors] = useState<{ 
    username?: string; 
    email?: string; 
    password?: string; 
    confirmPassword?: string; 
    gender?: string; 
    general?: string 
  }>({});
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const passwordValidation = useMemo<PasswordValidationState>(() => {
    return calculatePasswordStrength(formData.password);
  }, [formData.password]);

  const isPasswordValid = useMemo(() => {
    return Object.values(passwordValidation).every(Boolean);
  }, [passwordValidation]);

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleInputBlur = (field: string) => () => {
    let error = '';
    
    if (field === 'username') {
      const validation = validateUsername(formData.username);
      error = validation.isValid ? '' : validation.error!;
    } else if (field === 'email') {
      const validation = validateEmail(formData.email);
      error = validation.isValid ? '' : validation.error!;
    } else if (field === 'password') {
      const validation = validatePassword(formData.password, true);
      error = validation.isValid ? '' : validation.error!;
    } else if (field === 'confirmPassword') {
      if (!formData.confirmPassword) {
        error = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        error = 'Passwords do not match';
      }
    } else if (field === 'gender') {
      const validation = validateGender(formData.gender);
      error = validation.isValid ? '' : validation.error!;
    }
    
    setErrors(prev => ({ ...prev, [field]: error || undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    
    const usernameValidation = validateUsername(formData.username);
    if (!usernameValidation.isValid) {
      newErrors.username = usernameValidation.error;
    }
    
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error;
    }
    
    const passwordValidation = validatePassword(formData.password, true);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.error;
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    const genderValidation = validateGender(formData.gender);
    if (!genderValidation.isValid) {
      newErrors.gender = genderValidation.error;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormFilled = formData.username.trim() !== '' && 
    formData.email.trim() !== '' && 
    formData.password !== '' && 
    formData.confirmPassword !== '' &&
    formData.password === formData.confirmPassword &&
    isPasswordValid;
  const isButtonActive = isFormFilled && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const result = await authService.signup({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        username: formData.username.trim().toLowerCase().replace(/\s+/g, '_'),
        fullName: formData.username.trim(),
        gender: formData.gender
      });

      if (!result.success) {
        throw result.error;
      }

      if (result.data?.user && !result.data.session) {
        // Email confirmation required
        setSignupSuccess(true);
      } else if (result.data?.session) {
        // Auto-login after signup
        const redirectTo = searchParams.get('redirect');
        const safeRedirect = validateRedirect(redirectTo, '/app');
        navigate(safeRedirect);
      }
    } catch (err: any) {
      setErrors({ general: formatAuthError(err) });
    } finally {
      setLoading(false);
    }
  };

  const avatarUrl = `https://api.dicebear.com/8.x/${formData.gender === 'other' ? 'micah' : (formData.gender === 'male' ? 'pixel-art' : 'avataaars')}/svg?seed=${formData.username || 'default'}`;

  const inputBaseClasses = "mt-1 block h-9 sm:h-10 w-full rounded-md border border-input bg-card text-foreground py-2 px-3 text-sm placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200";

  if (signupSuccess) {
    return (
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2 transition-colors duration-200">
          Check your inbox!
        </h2>
        <p className="text-muted-foreground transition-colors duration-200 text-sm">
          We've sent a confirmation link to <strong className="text-foreground">{formData.email}</strong>. Please click the link to complete your registration.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2 transition-colors duration-200">
          Create Your Account
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground transition-colors duration-200">
          Sign up to get started.
        </p>
      </div>

      <div className="flex justify-center mb-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={avatarUrl} alt="Avatar Preview" />
          <AvatarFallback>{formData.username.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>

      {errors.general && (
        <div
          className="bg-destructive/15 text-destructive border border-destructive/20 px-4 py-2 rounded-lg text-sm text-center mb-4 transition-colors duration-200"
          role="alert"
        >
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div>
          <label htmlFor="username" className="block text-xs sm:text-sm font-medium text-muted-foreground transition-colors duration-200">
            Username <span className="text-destructive">*</span>
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            value={formData.username}
            onChange={handleInputChange('username')}
            onBlur={handleInputBlur('username')}
            disabled={loading}
            className={`${inputBaseClasses} ${
              errors.username ? 'border-destructive focus:border-destructive focus:ring-destructive' : ''
            }`}
            placeholder="Enter your username"
          />
          {errors.username && (
            <p className="mt-1 text-xs text-destructive transition-colors duration-200">
              {errors.username}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="gender" className="block text-xs sm:text-sm font-medium text-muted-foreground transition-colors duration-200">
            Gender <span className="text-destructive">*</span>
          </label>
          <select
            id="gender"
            name="gender"
            required
            value={formData.gender}
            onChange={handleInputChange('gender')}
            onBlur={handleInputBlur('gender')}
            disabled={loading}
            className={`${inputBaseClasses} ${
              errors.gender ? 'border-destructive focus:border-destructive focus:ring-destructive' : ''
            }`}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && (
            <p className="mt-1 text-xs text-destructive transition-colors duration-200">
              {errors.gender}
            </p>
          )}
        </div>

        <EmailField
          id="signup-email"
          name="email"
          value={formData.email}
          onChange={handleInputChange('email')}
          onBlur={handleInputBlur('email')}
          disabled={loading}
          error={errors.email}
          autoComplete="email"
        />

        <PasswordField
          id="signup-password"
          name="password"
          value={formData.password}
          onChange={handleInputChange('password')}
          onFocus={() => {}}
          onBlur={handleInputBlur('password')}
          disabled={loading}
          error={errors.password}
          autoComplete="new-password"
          minLength={8}
        />

        {formData.password && (
          <PasswordStrengthIndicator validation={passwordValidation} />
        )}

        <div>
          <label htmlFor="confirm-password" className="block text-xs sm:text-sm font-medium text-muted-foreground transition-colors duration-200">
            Confirm Password <span className="text-destructive">*</span>
          </label>
          <input
            id="confirm-password"
            name="confirm-password"
            type="password"
            autoComplete="new-password"
            required
            value={formData.confirmPassword}
            onChange={handleInputChange('confirmPassword')}
            onBlur={handleInputBlur('confirmPassword')}
            disabled={loading}
            className={`${inputBaseClasses} ${
              errors.confirmPassword ? 'border-destructive focus:border-destructive focus:ring-destructive' : ''
            }`}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-destructive transition-colors duration-200">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={!isButtonActive}
          loading={loading}
          className="w-full h-10 font-semibold"
        >
          <SparklesIcon className="size-4" aria-hidden="true" />
          <span>Sign up</span>
        </Button>
      </form>

      <p className="mt-6 text-center text-xs sm:text-sm text-muted-foreground transition-colors duration-200">
        Already have an account?{' '}
        <button 
          type="button"
          onClick={onToggleForm}
          className="font-semibold text-primary hover:text-primary/90 disabled:opacity-50 transition-colors duration-200"
          disabled={loading}
        >
          Log in
        </button>
      </p>

      <div className="mt-4 text-center text-xs text-muted-foreground transition-colors duration-200">
        By signing up, you agree to our{' '}
        <button type="button" className="font-semibold text-primary hover:text-primary/90 transition-colors duration-200">
          Terms & Support
        </button>
      </div>
    </div>
  );
};

export default SignupForm;
