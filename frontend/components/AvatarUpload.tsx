import React, { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
import { Upload } from 'lucide-react';
import Spinner from './Spinner';

interface AvatarUploadProps {
  user: User;
  onAvatarUpdate: (newAvatarUrl: string) => void;
  onClose: () => void;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ user, onAvatarUpdate, onClose }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setError(null);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      setUploading(true);
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`; // Unique filename
      const filePath = `${user.id}/${fileName}`; // Store in user-specific folder

      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600', // Cache for 1 hour
          upsert: true, // Overwrite if file with same name exists (though filename is unique here)
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL of the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(`${user.id}/${fileName}`);

      const newAvatarUrl = publicUrlData.publicUrl;

      // Update user metadata with the new avatar URL
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: newAvatarUrl },
      });

      if (updateError) {
        throw updateError;
      }

      onAvatarUpdate(newAvatarUrl); // Update parent component's user state
      onClose(); // Close the modal after successful upload
    } catch (err: any) {
      console.error('Error uploading avatar:', err.message);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-foreground mb-4 transition-colors duration-200">Upload Custom Avatar</h3>
      <div className="flex flex-col items-center justify-center">
        {error && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-2 rounded-lg text-sm mb-4 w-full transition-colors duration-200" role="alert">
            {error}
          </div>
        )}
        <label
          htmlFor="avatar-upload-input"
          className="cursor-pointer flex flex-col items-center justify-center w-48 h-48 border-2 border-dashed border-border rounded-full text-muted-foreground hover:border-primary hover:text-primary transition-colors duration-200"
        >
          {uploading ? (
            <Spinner size="lg" />
          ) : (
            <>
              <Upload className="h-12 w-12" />
              <span className="mt-2 text-sm text-center transition-colors duration-200">Click to upload</span>
              <span className="text-xs text-center transition-colors duration-200">(Max 5MB, JPG/PNG)</span>
            </>
          )}
          <input
            id="avatar-upload-input"
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
            disabled={uploading}
            className="sr-only"
          />
        </label>
      </div>
    </div>
  );
};

export default AvatarUpload;
