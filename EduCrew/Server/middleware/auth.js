import jwt from 'jsonwebtoken';
import { createError } from '../utils/error.js';

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(createError(401, 'You are not authenticated'));
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return next(createError(401, 'You are not authenticated'));
    }
    
    // Verify the token and set the user object
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Log the decoded token for debugging
    console.log('Decoded token:', decoded);
    
    // Set the user object on the request
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return next(createError(403, 'Token is not valid'));
  }
};

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, (err) => {
    if (err) return next(err);
    
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, 'You are not authorized'));
    }
  });
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, (err) => {
    if (err) return next(err);
    
    if (req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, 'You are not authorized'));
    }
  });
};