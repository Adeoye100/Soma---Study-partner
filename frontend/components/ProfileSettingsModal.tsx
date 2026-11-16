import React, { useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { XCircle, CheckCircle2 } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './Avatar';
import { getUserAvatarUrl } from '../utils/avatar';

interface ProfileSettingsModalProps {
  user: User;
  onClose: () => void;
  onAvatarUpdate?: (newAvatarUrl: string) => void;
}

const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({ user, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const userName = user.user_metadata?.full_name || user.email || 'Learner';
  const avatarUrl = getUserAvatarUrl(userName);
  const fallbackName = (userName || 'A').slice(0, 2).toUpperCase();

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-settings-title"
    >
      <div
        className="bg-card text-card-foreground border border-border rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col transition-colors duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-border sticky top-0 bg-card/90 backdrop-blur-sm transition-colors duration-200">
          <h2 id="profile-settings-title" className="text-xl font-bold text-foreground transition-colors duration-200">User Profile</h2>
          <button onClick={onClose} aria-label="Close dialog" className="p-2 rounded-full text-muted-foreground hover:bg-muted transition-colors duration-200">
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 md:p-8 text-foreground text-base leading-relaxed transition-colors duration-200 flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 mb-4 ring-2 ring-border shadow-md">
            <AvatarImage src={avatarUrl} alt={userName} />
            <AvatarFallback className="text-lg">{fallbackName}</AvatarFallback>
          </Avatar>
          <h3 className="text-lg font-bold text-foreground">{userName}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">{user.email || 'Active Member'}</p>

          <div className="mt-6 w-full p-4 rounded-xl border border-border bg-muted/40 text-left flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground block mb-0.5">Deterministic Avatar</span>
              Your avatar is generated uniquely from your account identifier using DiceBear triangles. Custom avatar uploads are disabled.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsModal;

