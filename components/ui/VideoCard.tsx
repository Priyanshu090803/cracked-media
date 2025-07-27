 
'use client'
import { useEffect, useState, useCallback } from "react"
import React from 'react'
import { getCldImageUrl, getCldVideoUrl } from "next-cloudinary"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { filesize } from "filesize"
import { Clock, Download, FileDown, FileUp, Play, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

dayjs.extend(relativeTime)

interface VideoCardProps {
    video: Video;
    onDownload: (url: string, title: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onDownload }) => {
    const [isHovered, setIsHovered] = useState(false)
    const [isError, setIsError] = useState(false)
    const [isImageLoaded, setIsImageLoaded] = useState(false)

    const getThumbnailUrl = useCallback((publicId: string) => {
        return getCldImageUrl({
            src: publicId,
            width: 480,
            height: 270,
            crop: "fill",
            gravity: "auto",
            format: "jpg",
            quality: "auto",
            assetType: "video"
        })
    }, [])

    const getFullVideoUrl = useCallback((publicId: string) => {
        return getCldVideoUrl({
            src: publicId,
            width: 1920,
            height: 1080
        })
    }, [])

    const getPreviewUrl = useCallback((publicId: string) => {
        return getCldVideoUrl({
            src: publicId,
            width: 1920,
            height: 1080,
            rawTransformations: ["e_preview:duration_15:max_seg_9:min_seg_dur_1"]
        })
    }, [])

    const formatSize = (size: number) => {
        return filesize(size)
    }

    const formatDuration = useCallback((second: number) => {
        const minute = Math.floor(second / 60);
        const remainingSeconds = Math.round(second % 60);
        return `${minute}:${remainingSeconds.toString().padStart(2, "0")}`
    }, [])

    const compressedSize = Math.round(
        (1 - Number(video.compressedSize) / Number(video.originalSize)) * 100
    )

    useEffect(() => {
        setIsError(false)
    }, [isHovered])

    const handlePreviewError = () => {
        setIsError(true)
    }

    return (
        <motion.div 
            className="group relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Video Preview Section */}
            <div className="relative aspect-video w-full overflow-hidden">
                <AnimatePresence mode="wait">
                    {isHovered ? (
                        isError ? (
                            <motion.div
                                key="error-state"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900"
                            >
                                <AlertCircle className="w-8 h-8 text-slate-400 mb-2" />
                                <p className="text-slate-300 text-sm font-medium">Preview not available</p>
                            </motion.div>
                        ) : (
                            <motion.video
                                key="video-preview"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                src={getPreviewUrl(video.publicId)}
                                className="object-cover w-full h-full"
                                autoPlay
                                muted
                                loop
                                onError={handlePreviewError}
                            />
                        )
                    ) : (
                        <>
                            <motion.img 
                                key="thumbnail"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: isImageLoaded ? 1 : 0 }}
                                src={getThumbnailUrl(video.publicId)} 
                                alt={video.title} 
                                className="object-cover w-full h-full" 
                                onLoad={() => setIsImageLoaded(true)}
                            />
                            {!isImageLoaded && (
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse"></div>
                            )}

                            {/* Play overlay */}
                            <motion.div 
                                className="absolute inset-0 bg-black/20 flex items-center justify-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: isImageLoaded ? 0 : 1 }}
                                whileHover={{ opacity: isImageLoaded ? 1 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                                    <Play className="w-6 h-6 text-slate-700 ml-1" />
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Duration badge */}
                <motion.div 
                    className={`absolute bottom-3 right-3 flex items-center bg-black/80 backdrop-blur-sm px-2 py-1 rounded-md transition-all duration-300 ${isHovered ? "opacity-0 translate-y-2" : "opacity-100"}`}
                    whileHover={{ scale: 1.05 }}
                >
                    <Clock className="w-3 h-3 text-white mr-1" />
                    <span className="text-xs text-white font-medium">{formatDuration(video.duration)}</span>
                </motion.div>

                {/* Gradient overlay */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
            </div>

            {/* Content Section (flex grow) */}
            <div className="flex flex-col justify-between flex-grow p-4 space-y-3">
                <div className="space-y-3">
                    <motion.h3 
                        className="font-medium text-gray-900 line-clamp-2 text-sm leading-snug group-hover:text-indigo-600 transition-colors duration-200"
                        whileHover={{ color: "#4f46e5" }}
                    >
                        {video.title}
                    </motion.h3>

                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {video.description}
                    </p>

                    <div className="flex items-center text-xs text-gray-400">
                        <span>Uploaded {dayjs(video.createdAt).fromNow()}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                        <motion.div 
                            className="flex flex-col bg-gray-50 rounded-lg p-2 border border-gray-100"
                            whileHover={{ y: -2 }}
                        >
                            <div className="flex items-center space-x-2">
                                <FileUp className="w-3 h-3 text-green-600" />
                                <span className="text-xs font-medium text-gray-700">Original</span>
                            </div>
                            <span className="text-xs font-semibold text-gray-800 mt-1">
                                {formatSize(Number(video.originalSize))}
                            </span>
                        </motion.div>

                        <motion.div 
                            className="flex flex-col bg-gray-50 rounded-lg p-2 border border-gray-100"
                            whileHover={{ y: -2 }}
                        >
                            <div className="flex items-center space-x-2">
                                <FileDown className="w-3 h-3 text-purple-600" />
                                <span className="text-xs font-medium text-gray-700">Compressed</span>
                            </div>
                            <div className="mt-1">
                                <span className="text-xs font-semibold text-gray-800">
                                    {formatSize(Number(video.compressedSize))}
                                </span>
                                <div className="text-xs text-purple-600 font-medium">
                                    {compressedSize}% saved
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Download Button */}
                <motion.div 
                    className="pt-4"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <button 
                        className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium py-2 px-4 rounded-lg shadow hover:shadow-md transition-all duration-300 flex items-center justify-center space-x-2 group/btn"
                        onClick={() => onDownload(getFullVideoUrl(video.publicId), video.title)}
                    >
                        <Download className="w-4 h-4 group-hover/btn:animate-bounce" />
                        <span className="text-sm">Download</span>
                    </button>
                </motion.div>
            </div>

            {/* Hover border effect */}
            <motion.div 
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <div className="absolute inset-0 border-2 border-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
        </motion.div>
    )
}

export default VideoCard
