import jwt from 'jsonwebtoken';
export const authenticateUser = async (req, res, next) => {
    if (!req.cookies?.accessToken)
        return res.json({ "success": false, "message": "No auth token cookie" });
    const decodedToken = jwt.verify(req.cookies.accessToken, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    req.userId = userId;
    next();
};
