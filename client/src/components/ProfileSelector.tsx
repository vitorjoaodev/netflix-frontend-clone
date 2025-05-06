import { useState } from "react";
import { FaPlus, FaPencilAlt } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import AvatarSelector from "@/components/AvatarSelector";

interface ProfileSelectorProps {
  onProfileSelect?: (profileId: number) => void;
  isManageMode?: boolean;
}

const ProfileSelector = ({ 
  onProfileSelect,
  isManageMode = false 
}: ProfileSelectorProps) => {
  const { profiles, addProfile, deleteProfile, setCurrentProfile, updateProfileAvatar } = useAuth();
  const [isAddProfileOpen, setIsAddProfileOpen] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const { toast } = useToast();
  
  const handleProfileSelect = (profileId: number) => {
    if (isManageMode) return;
    
    setCurrentProfile(profileId);
    
    if (onProfileSelect) {
      onProfileSelect(profileId);
    }
  };
  
  const handleAddProfile = () => {
    if (!newProfileName.trim()) {
      toast({
        title: "Error",
        description: "Profile name cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    addProfile(newProfileName);
    setNewProfileName("");
    setIsAddProfileOpen(false);
    
    toast({
      title: "Profile added",
      description: `Profile '${newProfileName}' has been created successfully`,
    });
  };
  
  const handleDeleteProfile = (profileId: number, profileName: string) => {
    if (window.confirm(`Are you sure you want to delete the profile '${profileName}'?`)) {
      deleteProfile(profileId);
      
      toast({
        title: "Profile deleted",
        description: `Profile '${profileName}' has been deleted`,
      });
    }
  };
  
  const handleAvatarChange = (profileId: number, avatarUrl: string) => {
    updateProfileAvatar(profileId, avatarUrl);
    
    toast({
      title: "Avatar updated",
      description: "Your profile avatar has been updated successfully",
    });
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <h1 className="text-3xl sm:text-5xl font-medium text-white mb-8">
          {isManageMode ? "Manage Profiles" : "Who's watching?"}
        </h1>
        
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {profiles.map((profile) => (
            <div 
              key={profile.id} 
              className="profile-item cursor-pointer w-[100px] sm:w-[120px] md:w-[140px]"
              onClick={() => handleProfileSelect(profile.id)}
            >
              <div className="relative aspect-square rounded overflow-hidden border-2 border-transparent hover:border-white transition-all duration-200">
                <img 
                  src={profile.avatar} 
                  alt={profile.name} 
                  className="w-full h-full object-cover" 
                />
                
                {isManageMode && (
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black bg-opacity-70 opacity-0 hover:opacity-100 transition-opacity">
                    <button 
                      className="bg-transparent text-white p-2 rounded-full hover:bg-white/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProfile(profile.id, profile.name);
                      }}
                    >
                      <span className="text-white font-bold">Delete</span>
                    </button>
                  </div>
                )}
              </div>
              <p className="mt-2 text-gray-400 text-lg hover:text-white">{profile.name}</p>
              
              {isManageMode && (
                <div className="flex justify-center mt-2">
                  <AvatarSelector 
                    currentAvatar={profile.avatar}
                    onAvatarChange={(newAvatar) => handleAvatarChange(profile.id, newAvatar)}
                  />
                </div>
              )}
            </div>
          ))}
          
          <Dialog open={isAddProfileOpen} onOpenChange={setIsAddProfileOpen}>
            <DialogTrigger asChild>
              <div className="profile-item cursor-pointer w-[100px] sm:w-[120px] md:w-[140px]">
                <div className="aspect-square rounded bg-netflix-dark-gray flex items-center justify-center overflow-hidden border-2 border-transparent hover:border-white transition-all duration-200">
                  <FaPlus className="text-gray-400 text-5xl" />
                </div>
                <p className="mt-2 text-gray-400 text-lg hover:text-white">Add Profile</p>
              </div>
            </DialogTrigger>
            
            <DialogContent className="bg-black border border-gray-700 text-white">
              <h2 className="text-2xl font-bold mb-4">Add Profile</h2>
              <p className="text-gray-400 mb-6">Create a profile for another person watching Netflix.</p>
              
              <div className="border-t border-b border-gray-700 py-6">
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-gray-600 rounded"></div>
                  <Input
                    placeholder="Name"
                    className="bg-gray-700 border-gray-600 text-white"
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-4 mt-6">
                <Button 
                  variant="outline"
                  className="border-gray-500 text-gray-300 hover:text-white hover:bg-transparent"
                  onClick={() => setIsAddProfileOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-netflix-red hover:bg-[#f40612] text-white"
                  onClick={handleAddProfile}
                >
                  Save
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <Button 
          className={`mt-12 px-6 py-3 text-lg font-medium ${
            isManageMode 
              ? "border border-gray-400 text-gray-400 hover:text-white hover:border-white bg-transparent" 
              : "bg-netflix-red hover:bg-[#f40612] text-white"
          }`}
          onClick={() => window.location.href = isManageMode ? "/profiles" : "/profiles?manage=true"}
        >
          {isManageMode ? "Done" : "Gerenciar Perfis"}
        </Button>
      </div>
    </div>
  );
};

export default ProfileSelector;
