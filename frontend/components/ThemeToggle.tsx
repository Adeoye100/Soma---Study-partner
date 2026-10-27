import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme, type ThemeMode } from '@/context/ThemeContext';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className }) => {
  const { mode, resolved, setMode } = useTheme();

  const cycleTheme = () => {
    if (mode === 'dark') {
      setMode('light');
    } else if (mode === 'light') {
      setMode('system');
    } else {
      setMode('dark');
    }
  };

  const getNextModeName = () => {
    if (mode === 'dark') return 'light';
    if (mode === 'light') return 'system';
    return 'dark';
  };

  const renderIcon = () => {
    if (mode === 'system') {
      return <Monitor className="size-4 sm:size-5" aria-hidden="true" />;
    }
    if (resolved === 'dark') {
      return <Moon className="size-4 sm:size-5" aria-hidden="true" />;
    }
    return <Sun className="size-4 sm:size-5" aria-hidden="true" />;
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      className={className}
      aria-label={`Theme mode: ${mode}. Switch to ${getNextModeName()} mode.`}
      title={`Theme mode: ${mode} (switch to ${getNextModeName()})`}
    >
      {renderIcon()}
      <span className="sr-only">Switch theme</span>
    </Button>
  );
};

export default ThemeToggle;
