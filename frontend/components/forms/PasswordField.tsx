import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordFieldProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
  error?: string;
  autoComplete?: string;
  minLength?: number;
  showToggle?: boolean;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  id,
  name,
  value,
  onChange,
  onFocus,
  onBlur,
  disabled = false,
  placeholder = "Enter your password",
  required = true,
  error,
  autoComplete = "current-password",
  minLength,
  showToggle = true
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const baseClasses = "mt-1 block h-9 sm:h-10 w-full rounded-md border border-input bg-card text-foreground py-2 px-3 text-sm placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200";
  const errorClasses = error ? "border-destructive focus:border-destructive focus:ring-destructive" : "";

  return (
    <div>
      <label htmlFor={id} className="block text-xs sm:text-sm font-medium text-muted-foreground transition-colors duration-200">
        Password
        {required && <span className="text-destructive ml-1" aria-hidden="true">*</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          autoComplete={autoComplete}
          required={required}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          minLength={minLength}
          className={`${baseClasses} ${errorClasses} pr-10`}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        {showToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-sm text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-200"
            aria-label={showPassword ? "Hide password" : "Show password"}
            disabled={disabled}
          >
            {showPassword ? (
              <EyeOff className="size-4" aria-hidden="true" />
            ) : (
              <Eye className="size-4" aria-hidden="true" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-destructive transition-colors duration-200">
          {error}
        </p>
      )}
    </div>
  );
};

export default PasswordField;