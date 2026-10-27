import React from 'react';
import { User } from '@supabase/supabase-js';
import { BookOpen, LogOut } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './Avatar';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onOpenProfileSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onOpenProfileSettings }) => {
  const userName = user.user_metadata?.full_name || user.email || 'Learner';
  const customAvatarUrl = user.user_metadata?.avatar_url;
  const avatarUrl = customAvatarUrl || `https://api.dicebear.com/10.x/triangles/svg?seed=${encodeURIComponent(userName)}`;
  const fallbackName = (userName || 'A').slice(0, 2).toUpperCase();

  return (
    <header className="bg-background/80 backdrop-blur-md sticky top-0 z-10 border-b border-border shadow-xs transition-colors duration-200">
      <div className="container mx-auto px-3 sm:px-4 md:px-8 py-3 sm:py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-primary animated-book flex-shrink-0" />
          <h1 className="font-brand text-lg sm:text-xl md:text-2xl font-bold animated-gradient-text truncate">
            Somma
          </h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Avatar className="h-9 w-9 cursor-pointer" onClick={onOpenProfileSettings}>
            <AvatarImage src={avatarUrl} alt={userName} />
            <AvatarFallback>{fallbackName}</AvatarFallback>
          </Avatar>
          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
            aria-label="Log out"
            title="Log out"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
