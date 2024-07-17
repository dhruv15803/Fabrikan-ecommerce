import { getCloudinaryUrl } from "../utils/getCloudinaryUrl.js";
import fs from 'fs';
const getImageUrl = async (req, res) => {
    const localFilePath = req.file?.path;
    if (!localFilePath)
        return res.status(400).json({ "success": false, "message": "no file available" });
    try {
        const url = await getCloudinaryUrl(localFilePath);
        if (!url)
            return res.status(400).json({ "success": false, "message": "Image upload failed" });
        res.status(200).json({
            "success": true,
            url,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ "success": false, "message": "Something went wrong when uploading file" });
    }
    finally {
        fs.unlink(localFilePath, (error) => {
            if (error)
                throw error;
            console.log('file deleted');
        });
    }
};
export { getImageUrl, };
