import { getCloudinaryUrl } from "../utils/getCloudinaryUrl.js";
const getImageUrl = async (req, res) => {
    try {
        if (!req.file)
            return res.status(400).json({ "success": false, "message": "File not available" });
        const localFilePath = req.file.path;
        const url = await getCloudinaryUrl(localFilePath);
        if (!url)
            return res.status(400).json({ "success": false, "message": "Image upload failed" });
        res.status(500).json({
            "success": true,
            url,
        });
    }
    catch (error) {
        console.log(error);
    }
};
export { getImageUrl, };
