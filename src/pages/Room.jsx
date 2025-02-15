import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

import { FaSpotify, FaSearch } from 'react-icons/fa';
import { ChatBubbleIcon, PersonIcon, PaperPlaneIcon, Cross2Icon } from '@radix-ui/react-icons';
const Room = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [name, setName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [spotifyEmbed, setSpotifyEmbed] = useState(null);
  const [isEmbedLoading, setIsEmbedLoading] = useState(false);

  useEffect(() => {
    const getSpotifyToken = async () => {
      const clientId = "95610055362643b38c330075da33af69";
      const clientSecret = "c0eeaaf13cb448b49a3c14d232845352";

      try {
        const response = await axios.post('https://accounts.spotify.com/api/token', 
          'grant_type=client_credentials',
          {
            headers: {
              'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        );
        setAccessToken(response.data.access_token);
      } catch (error) {
        console.error('Error getting Spotify token:', error);
      }
    };

    getSpotifyToken();
    loadComments();
  }, []);

  const loadComments = async () => {
    try {
      const response = await axios.get('https://ruloaooa-hooh.hf.space/api/comments', { withCredentials: true });
      setComments(response.data);
    } catch (error) {
      console.error('Error loading comments:', error);
      setComments([]);
    }
  };

  const searchSpotify = async (query) => {
    if (!accessToken || !query) return;

    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/search?q=${query}&type=track&limit=5`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      setSearchResults(response.data.tracks.items);
    } catch (error) {
      console.error('Error searching Spotify:', error);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  
  const handleComment = async () => {
    if (!newComment.trim() || !name.trim()) return;
    
    // Anti-spam: Check if less than 30 seconds have passed since last submission
    const now = Date.now();
    if (now - lastSubmitTime < 120000) {
      setShowToast(true);
      setToastMessage("Please wait 2 minutes before sending another message");
      setToastType("error");
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    setIsSubmitting(true);
    const comment = {
      id: Date.now().toString(),
      name: name,
      text: newComment,
      song: selectedSong,
      timestamp: new Date().toISOString()
    };

    try {
      const response = await axios.post('https://ruloaooa-hooh.hf.space/api/comments', comment, { 
        withCredentials: true 
      });
      setComments(prev => [response.data, ...prev]);
      setNewComment('');
      setName('');
      setSelectedSong(null);
      setSearchQuery('');
      setLastSubmitTime(now);
      setIsSubmitting(false);
      alert('Message sent successfully!');
      const dialog = document.querySelector('[role="dialog"]')?.parentElement;
      if (dialog) {
        dialog.remove();
      }
      //document.querySelector('.backdrop-blur-sm')?.remove();
    } catch (error) {
      console.error('Error saving comment:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const openSpotifyEmbed = (trackId) => {
    setIsEmbedLoading(true);
    setSpotifyEmbed(trackId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black text-white pb-10">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-20 px-4 max-w-6xl mx-auto"
      >
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-4"
          >
            <ChatBubbleIcon className="w-12 h-12 text-purple-400" />
          </motion.div>
          <motion.h1 
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4"
          >
            Share your favorite songs!
          </motion.h1>
          <p className="text-gray-400">Leave your mark on this website by commenting or simply sharing your favorite songs.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Form Section */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-white/5 backdrop-blur-lg rounded-xl p-2 shadow-xl border border-white/10"
          >
            <Dialog.Root>
              <Dialog.Trigger className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg group">
                <PaperPlaneIcon className="w-5 h-5 transition-transform group-hover:-translate-y-1" />
                Share a Song
              </Dialog.Trigger>

              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 p-6 rounded-xl w-[90vw] max-w-xl border border-white/10 z-40">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 bg-gray-800 p-3 rounded-lg border border-white/10">
                      <PersonIcon className="w-5 h-5 text-purple-400" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full bg-transparent focus:outline-none text-white"
                      />
                    </div>

                    <div className="relative">
                      <div className="flex items-center bg-gray-800 rounded-lg border border-white/10">
                        <FaSearch className="ml-3 text-gray-400" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            searchSpotify(e.target.value);
                          }}
                          placeholder="Search for a song..."
                          className="w-full bg-transparent p-3 focus:outline-none text-white"
                        />
                      </div>

                      <AnimatePresence>
                        {searchResults.length > 0 && searchQuery && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-50 w-full mt-1 bg-gray-800/95 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 shadow-xl"
                          >
                            {searchResults.map((track) => (
                              <motion.div
                                key={track.id}
                                whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                                onClick={() => {
                                  setSelectedSong(track);
                                  setSearchQuery('');
                                  setSearchResults([]);
                                }}
                                className="p-3 cursor-pointer flex items-center gap-3"
                              >
                                <img src={track.album.images[2]?.url} className="w-10 h-10 rounded" alt={track.name} />
                                <div>
                                  <p className="font-medium text-white">{track.name}</p>
                                  <p className="text-sm text-gray-400">Artist: {track.artists[0].name}</p>
                                </div>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {selectedSong && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gray-800 p-3 rounded-lg flex items-center gap-3 border border-white/10"
                      >
                        <img src={selectedSong.album.images[2]?.url} className="w-10 h-10 rounded" alt={selectedSong.name} />
                        <div>
                          <p className="font-medium text-white">{selectedSong.name}</p>
                          <p className="text-sm text-gray-400">{selectedSong.artists[0].name}</p>
                        </div>
                      </motion.div>
                    )}

                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write your message..."
                      className="w-full bg-gray-800 p-3 rounded-lg resize-none h-32 focus:outline-none focus:ring-2 ring-purple-500 border border-white/10 text-white"
                    />


                    <button
                      onClick={handleComment}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 p-3 rounded-lg transition-all font-medium text-white flex items-center justify-center gap-2">
                      <PaperPlaneIcon className="w-5 h-5" />
                      Send Message
                    </button>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
            {showToast && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`fixed top-4 left-1/2 -translate-x-1/2 ${toastType === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white px-6 py-3 rounded-lg shadow-lg z-[100]`}
              >
                {toastMessage}
              </motion.div>
            )}
          </motion.div>

          {/* Comments Section */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-white/5 backdrop-blur-lg rounded-xl shadow-xl border border-white/10"
          >
            <ScrollArea.Root className="h-[400px]">
              <ScrollArea.Viewport className="h-full p-4">
                <div className="space-y-6 mb-4">
                  {comments.map((comment) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/5 p-4 rounded-lg border border-white/10 hover:bg-white/10 transition-all"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <PersonIcon className="w-5 h-5 text-purple-400" />
                        <p className="font-medium">To: {comment.name}</p>
                      </div>
                      <p className="text-gray-300 mb-3">{comment.text}</p>
                      {comment.song && (
                        <div 
                          onClick={() => openSpotifyEmbed(comment.song.id)}
                          className="flex items-center gap-3 bg-black/30 p-2 rounded-lg relative cursor-pointer hover:bg-black/50"
                        >
                          <img src={comment.song.album.images[2]?.url} className="w-10 h-10 rounded" alt={comment.song.name} />
                          <div className="flex-1">
                            <p className="font-medium">{comment.song.name}</p>
                            <p className="text-sm text-gray-400">{comment.song.artists[0].name}</p>
                          </div>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(comment.timestamp).toLocaleString()}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea.Viewport>
              <ScrollArea.Scrollbar
                className="w-2 bg-white/5 rounded-full"
                orientation="vertical"
              >
                <ScrollArea.Thumb className="bg-purple-500/50 rounded-full" />
              </ScrollArea.Scrollbar>
            </ScrollArea.Root>
            
          </motion.div>
        </div>
      </motion.div>

      {/* Spotify Embed Dialog */}
      <Dialog.Root open={!!spotifyEmbed} onOpenChange={() => setSpotifyEmbed(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 p-6 rounded-xl w-[90vw] max-w-xl border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Preview Songs</h3>
              <button onClick={() => setSpotifyEmbed(null)} className="text-gray-400 hover:text-white">
                <Cross2Icon />
              </button>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <AnimatePresence>
                {isEmbedLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm z-10"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <iframe
                src={`https://open.spotify.com/embed/track/${spotifyEmbed}`}
                width="100%"
                height="352"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                onLoad={() => setIsEmbedLoading(false)}
                className="bg-black/20"
              />
            </motion.div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent backdrop-blur-sm"
      >
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.p 
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              className="text-sm text-gray-400"
            >
              Total comments: {comments.length > 0 ? comments.length : 0}
            </motion.p>
            <motion.div 
              initial={{ x: 20 }}
              animate={{ x: 0 }}
              className="flex items-center gap-2"
            >
              <FaSpotify className="text-green-500 w-4 h-4" />
              <span className="text-sm text-gray-400">Share your favorite songs</span>
            </motion.div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Room;
