import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  try {
    const authHead = req.headers.authorization;

    if (!authHeader || !authHead.startsWith("Beared")) {
        return res.status(401).json({
            message:"Acces denied."
        })
    }
    
    const token = authHead.split(" ")[1];
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      firstName:decoded.firstName,
      lastName:decoded.lastName,
      publicKey: decoded.publicKey
    };
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired. Please login again.' });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token. Please login again.' });
    }
    
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Internal server error during authentication' });
  }
};

export default auth;