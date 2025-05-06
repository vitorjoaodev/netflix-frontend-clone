import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import ProfileSelector from "@/components/ProfileSelector";

const ProfileSelect = () => {
  const { isAuthenticated } = useAuth();
  const [location, navigate] = useLocation();
  
  const isManageMode = location.includes("manage=true");
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  
  if (!isAuthenticated) {
    return null;
  }
  
  const handleProfileSelect = () => {
    navigate("/browse");
  };
  
  return (
    <ProfileSelector 
      onProfileSelect={handleProfileSelect}
      isManageMode={isManageMode}
    />
  );
};

export default ProfileSelect;
