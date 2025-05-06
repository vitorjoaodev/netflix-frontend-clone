import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LuPencil } from 'react-icons/lu';

// Official Netflix avatar images
const avatarOptions = [
  'https://occ-0-1339-1340.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABXvWywfWS7XtQC8VHdOJLQYw5DYDZt3T6NvxBK2YZ-gpE_6yIH7VP2-NeBPEM2n7Ddct8EYQat0bm-Kn3v9qyPLY1XSL.png?r=110',
  'https://occ-0-1339-1340.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABSHZrjJ2hGrDiHLhh7hjHDFQWZIKCPJrM-Wwh2FC9kbLATHoEXUTyzO9iq-Dsj-5UQDDQezOkqFU2wm-PXB-fGo4f1_k.png?r=fcd',
  'https://occ-0-1339-1340.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABcFszWr4vPYAP2CPx4qzs0D2TDTlayCTtXOCp9T5hbQML6xEf8oybWuQoJOFZhBz0WEBM51Z3rCQSOUht9F9Jxl7k6cR.png?r=a13',
  'https://occ-0-1339-1340.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABUCq3mMjbcd69jdwHnTaCw1LyFWMJcfM1I7CE9KGDG-0mT6tBsB9p6a3lRQJCXvFfl5OIJGwxU-RAKzYQls1QMzwhDw8.png?r=2db',
  'https://occ-0-1339-1340.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABaDC8m1uDvV29cCRXsYxV0d9qB0xRI8CvWZ6XxZH_y2Uc8Gw2LMgQCB1vlB2XHJIuXwZKJZGcO2pk3aZD614jQ6d_SqN.png?r=b97',
  'https://occ-0-1339-1340.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABbixeApBW3-OkGt9_u9iGt9q1vS-HjA-HJ3w5ZHwfKu0k26qr7iqNP1eo0gDs-8iJpgPEDPnI_YkZDV8vSevHFoZHHtL.png?r=9fe',
  'https://occ-0-1339-1340.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABTqCB0oPNfO4PppORRfO29mNgmhUtP24SZgKjjV-Jj2L1h9IZoUFQFZ1uUjcvfuaAfnPEz1ASMvK_NR_cQCBbH0.png?r=b39',
  'https://occ-0-1339-1340.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABTLt9AqDQYQ9N8lfQlW_OBL3XubAM4YeaoCIzUvlZPnKfAYxljAxXjHQhEwXu7A0i9BQwdZgWdxCxA9-S8khTrS9JJA5.png?r=8fb',
  'https://occ-0-1339-1340.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABdJRmPNM-TVxFZ7N_7QTCtZLVumYgQ2hIwDkMFADwZBUHkGcTmEEExjgaOC6U5gB8Yk4NxVKQrNOCUGHp9V5nA9ZPnzq.png?r=8d6',
  'https://occ-0-1339-1340.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABQ648LP3yNQgaJY0BLv5ay5TAuK39QwFSFxzKlgDIhQffRYU4N_iYGbvO66uiB--ifsL4nJ1BLNRv7qGn4P2yAyIb1I6.png?r=cad',
  'https://occ-0-1339-1340.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABe4VfPMrxilO1iy27MnfzdQd-utfvnF1VsZ9eVSRIwyHrI8B0E6_Lr89HwZrC5Z3WT9IrZoQkFFk8umbf8EQ8HBR_41p.png?r=ce8',
  'https://occ-0-1339-1340.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABaSJvUjxOeR7Nm56k-CaAbGytATbiQ9sVOCT_oX6cFI61tSGdfU7vXFMNlBl_lHm09SZ3sG2XD5gNBi1OQQJm5A4u8L0.png?r=9fe'
];

interface AvatarSelectorProps {
  currentAvatar: string;
  onAvatarChange: (newAvatar: string) => void;
}

const AvatarSelector = ({ currentAvatar, onAvatarChange }: AvatarSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center text-gray-400 hover:text-white bg-transparent"
        >
          <LuPencil className="mr-1" /> Edit
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-netflix-black border border-gray-800 text-white p-6 max-w-4xl">
        <h2 className="text-2xl font-bold mb-6">Select an Avatar</h2>
        
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {avatarOptions.map((avatar, index) => (
            <div 
              key={index}
              className={`
                cursor-pointer aspect-square rounded overflow-hidden
                transition-all duration-200
                ${currentAvatar === avatar ? 'border-4 border-white' : 'border-2 border-transparent hover:border-white'}
              `}
              onClick={() => {
                onAvatarChange(avatar);
                setIsOpen(false);
              }}
            >
              <img 
                src={avatar} 
                alt={`Avatar ${index + 1}`}
                className="w-full h-full object-cover" 
              />
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AvatarSelector;