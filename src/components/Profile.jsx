
import React from "react";
import { FaInstagram, FaSpotify, FaGithub } from "react-icons/fa";
import { RiVerifiedBadgeFill } from "react-icons/ri";

const Profile = () => {
  return (
    <div className="bg-white/10 dark:bg-white/5 backdrop-blur-lg p-6 rounded-lg border border-gray-200/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300 shadow-lg">
      <div className="text-center">
        <div className="inline-block relative">
          <img
            src="/logo.jpg"
            alt="Profile"
            className="w-20 h-20 rounded-full border-2 border-white/20 bg-gray-600 transition-transform hover:scale-105"
            onError={(e) => {
              e.target.innerText = 'NA';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full animate-pulse"></div>
        </div>
        <h1 className="text-lg font-bold mt-2">XUU <RiVerifiedBadgeFill className="inline text-blue-500" /></h1>
        
          
        <p className="text-gray-400 text-xs">Dreamer, Thinker, Doer.</p>
        <div className="flex justify-center gap-2 mt-3">
          <span className="bg-white/5 px-3 py-1 rounded-full text-xs hover:bg-white/10 transition-all hover:scale-105 ring-1 ring-yellow-500">💻 Ngoding</span>
          <span className="bg-white/5 px-3 py-1 rounded-full text-xs hover:bg-white/10 transition-all hover:scale-105 ring-1 ring-yellow-500">Turu</span>
          <span className="bg-white/5 px-3 py-1 rounded-full text-xs hover:bg-white/10 transition-all hover:scale-105 ring-1 ring-yellow-500">Netflix</span>
          <span className="bg-white/5 px-3 py-1 rounded-full text-xs hover:bg-white/10 transition-all hover:scale-105 ring-1 ring-yellow-500">Music</span>
        </div>
        <div className="flex justify-center gap-4 mt-4 text-xl text-gray-400">
          <a href="https://www.instagram.com/zyrexndra" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-100 transition-colors">
            <FaInstagram className="h-5 w-5 text-pink-600" />
          </a>
          <a href="https://github.com/zyrexndra/Primexuu" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-100 transition-colors">
            <FaGithub className="h-5 w-5 text-gray-600" />
          </a>
          <a href="https://open.spotify.com/playlist/7CYp3ACMaochziBfs2jCHw?si=z7UL38GlT6Gea03V6aeszQ" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-100 transition-colors">
            <FaSpotify className="h-5 w-5 text-green-600" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Profile;
