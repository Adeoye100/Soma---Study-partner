import React from 'react';

interface EmailFieldProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
  error?: string;
  autoComplete?: string;
}

const EmailField: React.FC<EmailFieldProps> = ({
  id,
  name,
  value,
  onChange,
  onBlur,
  disabled = false,
  placeholder = "Enter your email",
  required = true,
  error,
  autoComplete = "email"
}) => {
  const baseClasses = "mt-1 block h-9 sm:h-10 w-full rounded-md border border-input bg-card text-foreground py-2 px-3 text-sm placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200";
  const errorClasses = error ? "border-destructive focus:border-destructive focus:ring-destructive" : "";

  return (
    <div>
      <label htmlFor={id} className="block text-xs sm:text-sm font-medium text-muted-foreground transition-colors duration-200">
        Email address
        {required && <span className="text-destructive ml-1" aria-hidden="true">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type="email"
        autoComplete={autoComplete}
        required={required}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        placeholder={placeholder}
        className={`${baseClasses} ${errorClasses}`}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-destructive transition-colors duration-200">
          {error}
        </p>
      )}
    </div>
  );
};

export default EmailField;