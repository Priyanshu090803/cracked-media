'use client'
import { useEffect, useState,useCallback } from "react"
import React  from 'react'
import { getCldImageUrl, getCldVideoUrl } from "next-cloudinary"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { filesize } from "filesize"
// import { Video } from "@/app/generated/prisma"
import { Clock, Download, FileDown, FileUp } from "lucide-react"

dayjs.extend(relativeTime)
interface VideoCardProps{
    video:Video;
    onDownload: (url:string,title:string)=>void;
}
const VideoCard:React.FC<VideoCardProps> = ({video,onDownload}) => {
    const [isHovered,setIsHovered] = useState(false)
    const [isError, setIsError]= useState(false)
    const getThumbnailUrl= useCallback((publicId:string)=>{
        return getCldImageUrl({
            src:publicId,
            width:400,
            height:225,
            crop:"fill",
            gravity:"auto",
            format:"jpg",
            quality:"auto",
            assetType:"video"
        })
    },[])
       const getFullVideoUrl = useCallback((publicId:string)=>{
       return getCldVideoUrl({
            src:publicId,
            width:1920,
            height:1080
        })
    },[])
     const getPreviewUrl = useCallback((publicId:string)=>{
        return getCldVideoUrl({
            src:publicId,
            width:1920,
            height:1080,
            rawTransformations:["e_preview:duration_15:max_seg_9:min_seg_dur_1"]
        })
    },[])
    const formatSize=(size:number)=>{
        return filesize(size)
    }
    const formatDuration= useCallback((second:number)=>{
        const minute= Math.floor(second/60);
        const remaningSeconds = Math.round(second%60);
        return `${minute}:${remaningSeconds.toString().padStart(2,"0")}`
    },[])
    const compressedSize= Math.round(
        (1-Number(video.compressedSize)/ Number(video.originalSize))*100
    )
    useEffect(()=>{
        setIsError(false)
    },[isHovered])
    const handlePreviewError=()=>{
        setIsError(true)
    }
  return (
    <div className=" card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300"
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    >
        <figure className=" aspect-video relative">
        {
            isHovered?(
                isError?(
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <p className="text-white">Preview not available</p>
                    </div>
                ):(
                    <video
                        src={getPreviewUrl(video.publicId)}
                        className="object-cover w-full h-full"
                        autoPlay
                        muted
                        onError={handlePreviewError}
                    />
                )
            ):(<img src={getThumbnailUrl(video.publicId)} alt={video.title} className="object-cover w-full h-full" />)
        }
        <div className=" absolute bottom-2 right-2 flex items-center bgbase-100 bg-opacity-80 px-2 py-1 rounded">
            <Clock/>
            <span>{formatDuration(video.duration)}</span>
        </div>
        </figure>
        <div>
            <h2>{video.title}</h2>
            <p className="text-sm text-gray-500">{video.description}</p>
            <p>Uploaded {dayjs(video.createdAt).fromNow()}</p>
            <div>
                <FileUp/>
            </div>
            <span>Original Size: {formatSize(Number(video.originalSize))}</span>
                   <div>
            <FileDown/>
        </div>
            <span>Compressed Size: {formatSize(Number(video.compressedSize))} ({compressedSize}%)</span>
       </div>
        <button onClick={() => onDownload(getFullVideoUrl(video.publicId), video.title)}>
            <Download/>
        </button>
    </div>  
  )
}

export default VideoCard

