import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {
  // Create token with userId in the payload
  const token = jwt.sign(
    { id: userId.toString() }, // Ensure userId is a string
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
  
  // Set the token as a cookie
  res.cookie('jwt', token, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production'
  });
  
  console.log('Generated token for user ID:', userId.toString());
  
  return token;
};