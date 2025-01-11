import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
  try {
    // Check for token in cookies or Authorization header
    const token = req.cookies.access_token || 
      req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
