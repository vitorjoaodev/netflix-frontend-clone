import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LuPencil } from 'react-icons/lu';

// Avatares solicitados pelo usuário
const avatarOptions = [
  'https://external-preview.redd.it/yble0xDFerMYRYRz9uUgrVhnBrzVULNvCX38QH1za_U.jpg?auto=webp&s=1fc278147524128e733102857f9834a857047ab3', // John
  'https://wallpapers.com/images/hd/netflix-profile-pictures-1000-x-1000-88wkdmjrorckekha.jpg', // Sarah
  'https://i.pinimg.com/474x/d8/70/20/d87020c70b0bf5eec4918874fa7d0f9f.jpg', // Michael
  'https://images.squarespace-cdn.com/content/v1/60999fca51ffc84d9d5d7acc/1d47c1c5-3a60-4847-8047-387501b3cee1/Screenshot+2024-09-25+at+1.42.30%E2%80%AFPM.png' // Kids
];

interface AvatarSelectorProps {
  currentAvatar: string;
  onAvatarChange: (newAvatar: string) => void;
}

const AvatarSelector = ({ currentAvatar, onAvatarChange }: AvatarSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Adicione este console.log para debug
  console.log('AvatarSelector carregado com as seguintes opções:', avatarOptions);
  console.log('Avatar atual:', currentAvatar);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="default" 
          size="sm" 
          className="flex items-center bg-netflix-red hover:bg-[#f40612] text-white"
        >
          <LuPencil className="mr-1" /> Mudar Avatar
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-netflix-black border border-gray-800 text-white p-6 max-w-4xl">
        <h2 className="text-2xl font-bold mb-6">Selecione um Avatar</h2>

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
                console.log('Avatar selecionado:', avatar);
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