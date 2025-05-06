// AvatarSelector.tsx
import { useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { avatars } from "@/lib/data"; // array de imagens disponíveis

interface AvatarSelectorProps {
  currentAvatar: string;
  onAvatarChange: (avatarUrl: string) => void;
}

const AvatarSelector = ({ currentAvatar, onAvatarChange }: AvatarSelectorProps) => {
  const [selected, setSelected] = useState(currentAvatar);

  const handleSelect = (avatar: string) => {
    setSelected(avatar);
    onAvatarChange(avatar); // dispara a mudança no pai
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="relative group">
          <img
            src={selected}
            alt="Avatar"
            className="w-10 h-10 rounded-full border border-white"
          />
          <FaPencilAlt className="absolute bottom-0 right-0 bg-black text-white p-1 rounded-full w-5 h-5 opacity-80 group-hover:opacity-100" />
        </button>
      </DialogTrigger>

      <DialogContent className="bg-black text-white border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Choose an Avatar</h2>
        <div className="grid grid-cols-4 gap-4">
          {avatars.map((avatar, index) => (
            <img
              key={index}
              src={avatar}
              alt={`Avatar ${index}`}
              className={`w-16 h-16 rounded-full cursor-pointer border-2 ${
                selected === avatar ? "border-white" : "border-transparent"
              } hover:border-white transition`}
              onClick={() => handleSelect(avatar)}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AvatarSelector;
