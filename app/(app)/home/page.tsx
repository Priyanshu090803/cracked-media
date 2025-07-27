 

'use client'
import VideoCard from '@/components/ui/VideoCard';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { Play, Video, Sparkles, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [videos, setVideos] = useState<Video[]>([])

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true)
      const response = await axios.get("/api/videos")
      if (Array.isArray(response.data)) {
        setVideos(response.data)
      }
      else {
        throw new Error("Unexpected response format!")
      }
    } catch (error) {
      console.log(error)
      setIsError("Failed to fetch videos!")
    }
    finally {
      setLoading(false)
    }

  }, [])

  const handleDownload = useCallback((url: string, title: string) => {
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `${title}.mp4`)
    link.setAttribute("target", "_blank")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  // Loading Animation Component
  const LoadingSpinner = () => (
    <div className="h-screen flex items-center justify-center">
      <motion.div
        className="flex flex-col items-center space-y-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* YouTube-inspired loading animation */}
        <div className="relative">
          <motion.div
            className="w-16 h-16 border-4 border-red-200 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-red-500 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Play className="w-6 h-6 text-red-500" />
          </div>
        </div>
        
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-semibold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
            Loading your videos
          </h3>
          <p className="text-slate-500 mt-2">Please wait while we fetch your content...</p>
        </motion.div>
      </motion.div>
    </div>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen">
      {/* YouTube-inspired Header */}
      <motion.div
        className="relative mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Title Section */}
            <div className="space-y-2">
              <motion.h1
                className="text-3xl lg:text-4xl font-bold text-slate-800"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Your Videos
              </motion.h1>
              <motion.p
                className="text-slate-600 text-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {videos.length > 0 
                  ? `${videos.length} video${videos.length > 1 ? 's' : ''} • Compressed and optimized`
                  : 'No videos uploaded yet'
                }
              </motion.p>
            </div>

            {/* Stats Section */}
            {videos.length > 0 && (
              <motion.div
                className="flex items-center gap-6 bg-white/60 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/30"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
                  <span className="text-slate-600 font-medium">
                    {videos.length} Available
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Play className="w-4 h-4 text-red-500" />
                  <span className="text-slate-600 font-medium">Hover to Preview</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Error State */}
      <AnimatePresence>
        {isError && (
          <motion.div
            className="max-w-md mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <p className="text-red-600 text-center font-medium">{isError}</p>
          </motion.div>
        )}
      </AnimatePresence>
        
      {/* Content Section */}
      <div className="max-w-7xl h-full mx-auto px-4">
        {videos.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8">
              <motion.div
                className="relative inline-block"
                whileHover={{ scale: 1.05 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full blur-lg opacity-50"></div>
                <div className="relative bg-white/80 backdrop-blur-sm p-12 rounded-full border border-white/20 shadow-lg">
                  <Video className="w-20 h-20 text-slate-400" />
                </div>
              </motion.div>
            </div>
            
            <h3 className="text-3xl font-semibold text-slate-700 mb-4">No Videos Yet</h3>
            <p className="text-slate-500 text-lg leading-relaxed max-w-md mx-auto mb-8">
              Start building your video library! Upload your first video to see it here with beautiful previews and compression details.
            </p>
            
            <motion.button
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/video-upload'}
            >
              Upload Your First Video
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3   gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <AnimatePresence>
              {videos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                  whileHover={{ y: -8 }}
                  className="h-full"
                >
                  <VideoCard
                    video={video}
                    onDownload={handleDownload}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Home