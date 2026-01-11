const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.cookies.token;

  // If token is valid, let user pass (authenticated)
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      return next(); //login user use unlimited access
    } catch (err) {
      console.warn('[limitAskAI] Invalid token:', err.message);
    }
  }

  // Unauthenticated: track attempts via cookie
  let attempts = parseInt(req.cookies.apiFENCjsascasnmvkdsvdkj || '0');

  if (attempts >= 3) {
    return res.status(429).json({
      message: 'Free usage limit reached. Please log in to continue.',
    });
  }

  attempts += 1;

  res.cookie('apiFENCjsascasnmvkdsvdkj', attempts, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });

  next();
};
