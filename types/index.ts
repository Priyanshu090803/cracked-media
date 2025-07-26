interface Video {
    id: string;   
    title: string;
    description: string | null;
    originalSize: number;
    compressedSize: number;
    publicId: string;
    duration: number;
    createdAt: Date;
    updatedAt: Date;
}