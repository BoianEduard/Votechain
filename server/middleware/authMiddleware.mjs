import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Access denied. No token provided."
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      publicKey: decoded.publicKey
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/'
      });
      return res.status(401).json({ message: 'Token has expired. Please login again.' });
    }

    if (error.name === 'JsonWebTokenError') {
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/'
      });
      return res.status(401).json({ message: 'Invalid token. Please login again.' });
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Internal server error during authentication' });
  }
};

export default auth;