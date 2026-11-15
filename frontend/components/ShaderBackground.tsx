import React from 'react';

interface ShaderBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

const ShaderBackground: React.FC<ShaderBackgroundProps> = ({ children, className = '' }) => {
  return (
    <div className={`border border-border bg-card rounded-none transition-colors duration-300 ${className}`}>
      <div className="rounded-none h-full w-full">
        {children}
      </div>
    </div>
  );
};

export default ShaderBackground;
