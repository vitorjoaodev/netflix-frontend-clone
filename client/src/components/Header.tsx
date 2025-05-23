import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { FaSearch, FaBell, FaCaretDown } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("home");
  const { currentUser, profiles, logout, setCurrentProfile } = useAuth();
  const [location, setLocation] = useLocation();

  // Parse the current location to determine active category
  useEffect(() => {
    if (location.includes("?category=")) {
      const category = location.split("?category=")[1];
      setActiveCategory(category);
    } else if (location === "/browse") {
      setActiveCategory("home");
    }
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (location === "/" || location === "/login" || location === "/profiles") {
    // Use transparent header for landing page, login, and profile selection
    return null;
  }

  const handleNavigation = (category: string) => {
    if (category === "home") {
      setLocation("/browse");
    } else {
      setLocation(`/browse?category=${category}`);
    }
    setActiveCategory(category);
  };

  const handleProfileSelect = (profileId: number) => {
    if (setCurrentProfile) {
      setCurrentProfile(profileId);
    }
  };

  return (
    <header
      className={`netflix-header fixed w-full z-50 px-4 py-4 flex items-center justify-between transition-all duration-300 ${
        isScrolled ? "bg-netflix-black" : ""
      }`}
    >
      <div className="flex items-center">
        {/* Netflix Logo */}
        <div className="mr-8">
          <Link href="/browse">
            <svg viewBox="0 0 111 30" className="h-6 sm:h-7 md:h-8 cursor-pointer" fill="#E50914">
              <path d="M105.06233,14.2806261 L110.999156,30 C109.249227,29.7497422 107.500234,29.4366857 105.718437,29.1554972 L102.374168,20.4686475 L98.9371075,28.4375293 C97.2499766,28.1563408 95.5928391,28.061674 93.9057081,27.8432843 L99.9372012,14.0931671 L94.4680851,-5.68434189e-14 L99.5313525,-5.68434189e-14 L102.593495,7.87421502 L105.874965,-5.68434189e-14 L110.999156,-5.68434189e-14 L105.06233,14.2806261 Z M90.4686475,-5.68434189e-14 L85.8749649,-5.68434189e-14 L85.8749649,27.2499766 C87.3746368,27.3437061 88.9371075,27.4055675 90.4686475,27.5930265 L90.4686475,-5.68434189e-14 Z M81.9055207,26.93692 C77.7186241,26.6557316 73.5307901,26.4064111 69.250164,26.3117443 L69.250164,-5.68434189e-14 L73.9366389,-5.68434189e-14 L73.9366389,21.8745899 C76.6248008,21.9373887 79.3120255,22.1557784 81.9055207,22.2804387 L81.9055207,26.93692 Z M64.2496954,10.6561065 L64.2496954,15.3435186 L57.8442216,15.3435186 L57.8442216,25.9996251 L53.2186709,25.9996251 L53.2186709,-5.68434189e-14 L66.3436123,-5.68434189e-14 L66.3436123,4.68741213 L57.8442216,4.68741213 L57.8442216,10.6561065 L64.2496954,10.6561065 Z M45.3435186,4.68741213 L45.3435186,26.2498828 C43.7810479,26.2498828 42.1876465,26.2498828 40.6561065,26.3117443 L40.6561065,4.68741213 L35.8121661,4.68741213 L35.8121661,-5.68434189e-14 L50.2183897,-5.68434189e-14 L50.2183897,4.68741213 L45.3435186,4.68741213 Z M30.749836,15.5928391 C28.687787,15.5928391 26.2498828,15.5928391 24.4999531,15.6875059 L24.4999531,22.6562939 C27.2499766,22.4678976 30,22.2495079 32.7809542,22.1557784 L32.7809542,26.6557316 L19.812541,27.6876933 L19.812541,-5.68434189e-14 L32.7809542,-5.68434189e-14 L32.7809542,4.68741213 L24.4999531,4.68741213 L24.4999531,10.9991564 C26.3126816,10.9991564 29.0936358,10.9054269 30.749836,10.9054269 L30.749836,15.5928391 Z M4.78114163,12.9684132 L4.78114163,29.3429562 C3.09401069,29.5313525 1.59340144,29.7497422 0,30 L0,-5.68434189e-14 L4.4690224,-5.68434189e-14 L10.562377,17.0315868 L10.562377,-5.68434189e-14 L15.2497891,-5.68434189e-14 L15.2497891,28.061674 C13.5935889,28.3437998 11.906458,28.4375293 10.1246602,28.6868498 L4.78114163,12.9684132 Z"></path>
            </svg>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex space-x-6">
          <button 
            onClick={() => handleNavigation("home")} 
            className={`netflix-nav-item ${activeCategory === "home" ? "active" : ""}`}
          >
            Home
          </button>
          <button 
            onClick={() => handleNavigation("tv")} 
            className={`netflix-nav-item ${activeCategory === "tv" ? "active" : ""}`}
          >
            TV Shows
          </button>
          <button 
            onClick={() => handleNavigation("movies")} 
            className={`netflix-nav-item ${activeCategory === "movies" ? "active" : ""}`}
          >
            Movies
          </button>
          <button 
            onClick={() => handleNavigation("new")} 
            className={`netflix-nav-item ${activeCategory === "new" ? "active" : ""}`}
          >
            New & Popular
          </button>
          <button 
            onClick={() => handleNavigation("mylist")} 
            className={`netflix-nav-item ${activeCategory === "mylist" ? "active" : ""}`}
          >
            My List
          </button>
          <button 
            onClick={() => handleNavigation("languages")} 
            className={`netflix-nav-item ${activeCategory === "languages" ? "active" : ""}`}
          >
            Browse by Languages
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white ml-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="font-medium text-sm">Browse</span>
          <FaCaretDown className="inline ml-1 text-xs" />
        </button>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 w-full bg-black bg-opacity-95 md:hidden z-50">
            <div className="flex flex-col py-4 px-4">
              <button 
                onClick={() => {handleNavigation("home"); setIsMenuOpen(false);}} 
                className={`py-2 text-left ${activeCategory === "home" ? "text-white font-bold" : "text-gray-300"}`}
              >
                Home
              </button>
              <button 
                onClick={() => {handleNavigation("tv"); setIsMenuOpen(false);}} 
                className={`py-2 text-left ${activeCategory === "tv" ? "text-white font-bold" : "text-gray-300"}`}
              >
                TV Shows
              </button>
              <button 
                onClick={() => {handleNavigation("movies"); setIsMenuOpen(false);}} 
                className={`py-2 text-left ${activeCategory === "movies" ? "text-white font-bold" : "text-gray-300"}`}
              >
                Movies
              </button>
              <button 
                onClick={() => {handleNavigation("new"); setIsMenuOpen(false);}} 
                className={`py-2 text-left ${activeCategory === "new" ? "text-white font-bold" : "text-gray-300"}`}
              >
                New & Popular
              </button>
              <button 
                onClick={() => {handleNavigation("mylist"); setIsMenuOpen(false);}} 
                className={`py-2 text-left ${activeCategory === "mylist" ? "text-white font-bold" : "text-gray-300"}`}
              >
                My List
              </button>
              <button 
                onClick={() => {handleNavigation("languages"); setIsMenuOpen(false);}} 
                className={`py-2 text-left ${activeCategory === "languages" ? "text-white font-bold" : "text-gray-300"}`}
              >
                Browse by Languages
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {/* Search bar */}
        <div className="relative">
          {isSearchOpen ? (
            <div className="flex items-center bg-black bg-opacity-70 border border-white rounded-sm">
              <FaSearch className="text-white ml-2" />
              <input 
                autoFocus
                type="text" 
                placeholder="Títulos, pessoas, gêneros" 
                className="bg-transparent border-none text-white text-sm px-2 py-1 w-40 focus:outline-none"
                onBlur={() => setIsSearchOpen(false)}
              />
            </div>
          ) : (
            <button className="text-white" onClick={() => setIsSearchOpen(true)}>
              <FaSearch className="text-lg" />
            </button>
          )}
        </div>
        
        <button 
          onClick={() => handleNavigation("kids")}
          className="hidden sm:block netflix-nav-item"
        >
          Kids
        </button>
        
        <button className="text-white">
          <FaBell className="text-lg" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative group">
          <button className="flex items-center">
            {/* Profile avatar image */}
            {currentUser && currentUser.avatar ? (
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-8 h-8 rounded"
              />
            ) : (
              <div className="w-8 h-8 rounded bg-gray-600"></div>
            )}
            <FaCaretDown className="ml-2 text-xs transition-transform group-hover:rotate-180" />
          </button>

          <div className="absolute right-0 mt-2 w-48 bg-black bg-opacity-95 border border-gray-700 rounded py-2 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
            {/* Other profiles */}
            {profiles && profiles.map((profile) => (
              profile.id !== currentUser?.id && (
                <button 
                  key={profile.id} 
                  className="px-4 py-2 flex items-center hover:underline cursor-pointer w-full text-left"
                  onClick={() => handleProfileSelect(profile.id)}
                >
                  <img 
                    src={profile.avatar} 
                    alt={profile.name} 
                    className="w-7 h-7 rounded mr-3" 
                  />
                  <span className="text-sm">{profile.name}</span>
                </button>
              )
            ))}

            <div className="border-t border-gray-700 my-1"></div>

            <Link href="/profiles?manage=true" className="block px-4 py-2 text-sm hover:underline text-white">
              Manage Profiles
            </Link>
            <button className="block px-4 py-2 text-sm hover:underline text-white text-left w-full">
              Account
            </button>
            <button className="block px-4 py-2 text-sm hover:underline text-white text-left w-full">
              Help Center
            </button>
            <button 
              onClick={logout}
              className="block px-4 py-2 text-sm hover:underline text-white text-left w-full"
            >
              Sign out of Netflix
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
