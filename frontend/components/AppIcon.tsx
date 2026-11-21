import React from 'react';

export interface AppIconProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  alt?: string;
}

/**
 * AppIcon component that displays Somma logo with rounded circular corners.
 * Uses Somma-logo-white.jpeg in light mode and Somma-logo.jpeg in dark mode.
 */
export const AppIcon: React.FC<AppIconProps> = ({
  className = 'size-8',
  alt = 'Somma Logo',
  ...rest
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full overflow-hidden border border-border/40 ${className}`}
      {...rest}
    >
      {/* Light mode logo */}
      <img
        src="/Somma-logo-white.jpeg"
        alt={alt}
        className="w-full h-full object-cover rounded-full dark:hidden"
      />
      {/* Dark mode logo */}
      <img
        src="/Somma-logo.jpeg"
        alt={alt}
        className="w-full h-full object-cover rounded-full hidden dark:block"
      />
    </div>
  );
};

export default AppIcon;
