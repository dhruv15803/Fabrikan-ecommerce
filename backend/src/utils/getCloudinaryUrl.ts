import {v2 as cloudinary} from 'cloudinary'

cloudinary.config({ 
    cloud_name:process.env.CLOUD_NAME, 
    api_key:process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View Credentials' below to copy your API secret
});

const getCloudinaryUrl = async (localPathFile:string) => {
    try {
        const cloudinaryResponse = await cloudinary.uploader.upload(localPathFile,{
            "resource_type":"auto"
        })
        const url = cloudinaryResponse.url;
        return url;
    } catch (error) {
        console.log('CLOUDINARY ERROR:- ',error)
    }
}

export {
    getCloudinaryUrl,
}