
import React from "react";
import { FaSpotify } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="text-center mt-6 text-sm text-gray-400">
      <hr className="h-px bg-gray-800 my-4 border-0" />
      <p>See what I'm currently listening on Spotify</p>
      <div className="flex justify-center items-center gap-2 mt-1">
        <FaSpotify className="text-green-500" />
        <p>No listening to anything</p>
      </div>
    </footer>
  );
};

export default Footer;
