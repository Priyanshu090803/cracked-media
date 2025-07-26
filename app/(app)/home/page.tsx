'use client'
import VideoCard from '@/components/ui/VideoCard';
import axios from 'axios';
import React, {   useCallback, useEffect, useState } from 'react'

const Home = () => {
  const [loading,setLoading] = useState(false);
  const [isError,setIsError] = useState<string|null>(null);
  const [videos,setVideos]= useState<Video[]>([])

    const fetchVideos = useCallback(async () => {
      try {
      setLoading(true)
      const response= await axios.get("/api/videos")
      if(Array.isArray(response.data)){
        setVideos(response.data)
      }  
      else{
        throw new Error("Unexpected response fomrat!")
      }
    } catch (error) {
        console.log(error)
        setIsError("Failed to fetch videos!")
      }
      finally{
        setLoading(false)
      }
   
    }, [])
   const handleDownload = useCallback((url: string, title: string) => {

                const link = document.createElement("a")
                link.href = url
                link.setAttribute("download", `${title}.mp4`) //attributeName: The name of the attribute (e.g., "href", "class", "id")  value: The value to set for the attribute

    
                link.setAttribute("target", "_blank")       //we can use this to open in new tab
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
   }, []);

      useEffect(() => {
        fetchVideos();
      }, [fetchVideos]);
  if(loading){
    return <div className="flex items-center justify-center h-screen">Loading...</div>  
  }
   return (
    <div>
      <div>
        <h1>Videos</h1>
        {
          videos.length === 0 ? ( 
          <div>
            <p>No videos available!</p>
          </div>
           ):(
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {
                videos.map((video) => (
                  <VideoCard
                  key={video.id}
                  video={video}
                  onDownload={handleDownload} 
                  />
                )
              )
            }
            </div>
          )
        }
      </div>
    </div>
  )
}

export default Home