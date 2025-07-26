import { PrismaClient } from '@/app/generated/prisma';
import { auth } from '@clerk/nextjs/server';
import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';
 
const prisma = new PrismaClient()
    
       // Configuration
    cloudinary.config({ 
        cloud_name:process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ,
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });

    interface CloudinaryUploadResult{  // what it give to us
        public_id:string,
        bytes:number,
        duration?:number,
        [key:string]:any
    }

// (async function() { 
//     // Upload an image
//      const uploadResult = await cloudinary.uploader
//        .upload(
//            'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//                public_id: 'shoes',
//            }
//        )
//        .catch((error) => {
//            console.log(error);
//        });
    
//     console.log(uploadResult);
    
//     // Optimize delivery by resizing and applying auto-format and auto-quality
//     const optimizeUrl = cloudinary.url('shoes', {
//         fetch_format: 'auto',
//         quality: 'auto'
//     });
    
//     console.log(optimizeUrl);
    
//     // Transform the image: auto-crop to square aspect_ratio
//     const autoCropUrl = cloudinary.url('shoes', {
//         crop: 'auto',
//         gravity: 'auto',
//         width: 500,
//         height: 500,
//     });
    
//     console.log(autoCropUrl);    
// })();

export async function POST(request:NextRequest){
   const session = await auth();
   const { userId } = session;
   
    try {
       if(!userId){
        return NextResponse.json({error:"Unauthorized"},{status:401})
    }

       if(!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME||
       !process.env.CLOUDINARY_API_KEY|| 
       !process.env.CLOUDINARY_API_SECRET
      ){
        return NextResponse.json({error:"Cloudinary credentials not found!"},{status:500})
    }
    
        const formData = await request.formData()
        const file = formData.get('file') as File | null;
        const title = formData.get('title') as string;
        const description = formData.get('description') as string
        const orignialSize = formData.get("originalSize") as string
        if(!file){
            return NextResponse.json({error:"File not found!"},{status:400})
        }
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        
        const result = await new Promise<CloudinaryUploadResult>(
            (resolve,reject)=>{
                const upStream = cloudinary.uploader.upload_stream(
                    {resource_type:"video",
                    folder:"video-uploads",
                    transformation:[
                        {quality:"auto",fetch_format:"mp4"}
                    ]
                    },
                    (error,result)=>{
                        if(error) reject(error)
                        else resolve(result as CloudinaryUploadResult)
                    }
                )
                upStream.end(buffer)
            }
        )
        const video = await prisma.video.create({
            data:{
                title,
                description,
                publicId:result.public_id,
                originalSize:orignialSize,
                compressedSize:String(result.bytes),
                duration:result.duration || 0
            } 
        })
        return NextResponse.json(video)
    } catch (error) {
        console.log("Upload image failed!",error)
        return NextResponse.json({error:"Upload image failed!"},{status:500})
    }
    finally{
        await prisma.$disconnect()
    }
}