const superAdminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'SUPERADMIN') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Superadmin only.' });
  }
};

module.exports = superAdminMiddleware;
