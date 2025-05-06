import React from 'react';
import { Link } from 'wouter';

const Footer = () => {
  return (
    <footer className="bg-netflix-black text-[#737373] py-8 px-4 md:px-16 mt-10">
      <div className="max-w-6xl mx-auto">
        <p className="mb-6 text-base">Questions? Contact us</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
          <ul className="space-y-3 text-sm">
            <li><Link href="#" className="hover:underline">FAQ</Link></li>
            <li><Link href="#" className="hover:underline">Help Center</Link></li>
            <li><Link href="#" className="hover:underline">Account</Link></li>
            <li><Link href="#" className="hover:underline">Media Center</Link></li>
          </ul>
          
          <ul className="space-y-3 text-sm">
            <li><Link href="#" className="hover:underline">Investor Relations</Link></li>
            <li><Link href="#" className="hover:underline">Jobs</Link></li>
            <li><Link href="#" className="hover:underline">Redeem Gift Cards</Link></li>
            <li><Link href="#" className="hover:underline">Buy Gift Cards</Link></li>
          </ul>
          
          <ul className="space-y-3 text-sm">
            <li><Link href="#" className="hover:underline">Ways to Watch</Link></li>
            <li><Link href="#" className="hover:underline">Terms of Use</Link></li>
            <li><Link href="#" className="hover:underline">Privacy</Link></li>
            <li><Link href="#" className="hover:underline">Cookie Preferences</Link></li>
          </ul>
          
          <ul className="space-y-3 text-sm">
            <li><Link href="#" className="hover:underline">Corporate Information</Link></li>
            <li><Link href="#" className="hover:underline">Contact Us</Link></li>
            <li><Link href="#" className="hover:underline">Speed Test</Link></li>
            <li><Link href="#" className="hover:underline">Legal Notices</Link></li>
            <li><Link href="#" className="hover:underline">Only on Netflix</Link></li>
          </ul>
        </div>
        
        <div className="mb-6">
          <div className="relative inline-block border border-[#737373] rounded">
            <select className="bg-transparent text-[#737373] py-1 pl-8 pr-6 appearance-none cursor-pointer">
              <option value="en">English</option>
              <option value="pt">Portuguese</option>
            </select>
            <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16">
                <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm5.2 4.3l-1.4-1.4L7 7.6 2.2 2.9.8 4.3 7 10.4l6.2-6.1z"/>
              </svg>
            </div>
          </div>
        </div>
        
        <p className="text-sm">Developed by João Vitor Belasque &copy; 2025</p>
      </div>
    </footer>
  );
};

export default Footer;