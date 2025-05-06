import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const avatars = [
  '/avatars/avatar1.png',
  '/avatars/avatar2.png',
  '/avatars/avatar3.png',
  '/avatars/avatar4.png',
  '/avatars/avatar5.png',
  '/avatars/avatar6.png',
  '/avatars/avatar7.png',
  '/avatars/avatar8.png',
  // Default Netflix avatars with fallbacks
  'https://occ-0-1339-1340.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABXvWywfWS7XtQC8VHdOJLQYw5DYDZt3T6NvxBK2YZ-gpE_6yIH7VP2-NeBPEM2n7Ddct8EYQat0bm-Kn3v9qyPLY1XSL.png?r=110',
  'https://occ-0-1339-1340.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABSHZrjJ2hGrDiHLhh7hjHDFQWZIKCPJrM-Wwh2FC9kbLATHoEXUTyzO9iq-Dsj-5UQDDQezOkqFU2wm-PXB-fGo4f1_k.png?r=fcd',
  'https://occ-0-1339-1340.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABcFszWr4vPYAP2CPx4qzs0D2TDTlayCTtXOCp9T5hbQML6xEf8oybWuQoJOFZhBz0WEBM51Z3rCQSOUht9F9Jxl7k6cR.png?r=a13',
  'https://occ-0-1339-1340.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABUCq3mMjbcd69jdwHnTaCw1LyFWMJcfM1I7CE9KGDG-0mT6tBsB9p6a3lRQJCXvFfl5OIJGwxU-RAKzYQls1QMzwhDw8.png?r=2db',
  'https://occ-0-1339-1340.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABeaAJH1XGKMQMxBYQqUd5pYNBZMQQgP1_rHPGkFm1NDFJoxwrjKjF4VmuGTDHLNIzFUCajRpOFLSUtOdYR1F1n0oY8b_.png?r=fde',
  'https://occ-0-1339-1340.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABRpt9KQNLfFI9CFzAM7Ut4gZsLRFeZQsKkKPuUQP2GR_Asrwl0LNnJ0xYhUZmpkeH9-87jWUUj5vOx0yURQydqHZUH27.png?r=b97',
  'https://occ-0-1339-1340.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABVaLjWhdJxfNtzoZ0KPZmgO5scy94ml53Oyb3mvWxmDkQbj8QkAYIgFRty4DW2WzQRgP_YqYyX0x-3tCCdSAKfQT72GB.png?r=59d',
];

interface AvatarSelectorProps {
  currentAvatar: string;
  onAvatarChange: (newAvatar: string) => void;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({ currentAvatar, onAvatarChange }) => {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);
  
  const handleSelectAvatar = (avatar: string) => {
    setSelectedAvatar(avatar);
  };
  
  const handleApply = () => {
    onAvatarChange(selectedAvatar);
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="text-white bg-transparent border-white hover:bg-white/10 transition mt-2"
        >
          Change avatar
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-netflix-black text-white border-netflix-dark-gray max-w-3xl">
        <DialogTitle className="text-2xl mb-4">Choose an avatar</DialogTitle>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 overflow-y-auto max-h-[60vh]">
          {avatars.map((avatar, index) => (
            <div 
              key={index} 
              onClick={() => handleSelectAvatar(avatar)}
              className={`
                cursor-pointer rounded overflow-hidden 
                ${selectedAvatar === avatar ? 'ring-4 ring-netflix-red' : 'hover:ring-2 hover:ring-white'}
                transition-all
              `}
            >
              <img 
                src={avatar} 
                alt={`Avatar ${index + 1}`} 
                className="h-24 w-24 object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://occ-0-1339-1340.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABcFszWr4vPYAP2CPx4qzs0D2TDTlayCTtXOCp9T5hbQML6xEf8oybWuQoJOFZhBz0WEBM51Z3rCQSOUht9F9Jxl7k6cR.png?r=a13';
                }}
              />
            </div>
          ))}
        </div>
        
        <div className="flex justify-end space-x-2 mt-4">
          <DialogClose asChild>
            <Button variant="ghost" className="text-white">Cancel</Button>
          </DialogClose>
          
          <DialogClose asChild>
            <Button 
              variant="default" 
              className="bg-netflix-red hover:bg-netflix-red/80"
              onClick={handleApply}
            >
              Apply
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AvatarSelector;