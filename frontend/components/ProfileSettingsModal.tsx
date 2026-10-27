import React, { useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { XCircle } from 'lucide-react';
import AvatarUpload from './AvatarUpload';

interface ProfileSettingsModalProps {
  user: User;
  onClose: () => void;
  onAvatarUpdate: (newAvatarUrl: string) => void;
}

const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({ user, onClose, onAvatarUpdate }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

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
          <h2 id="profile-settings-title" className="text-xl font-bold text-foreground transition-colors duration-200">Profile Settings</h2>
          <button onClick={onClose} aria-label="Close dialog" className="p-2 rounded-full text-muted-foreground hover:bg-muted transition-colors duration-200">
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 md:p-8 text-foreground text-base leading-relaxed transition-colors duration-200">
          <AvatarUpload user={user} onAvatarUpdate={onAvatarUpdate} onClose={onClose} />
          {/* Add other profile settings here later if needed */}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsModal;

