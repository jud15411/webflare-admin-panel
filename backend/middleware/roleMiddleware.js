// Pass roles that are allowed to access the route, e.g., hasRole('ceo', 'cto')
export const hasRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403); // Forbidden
      throw new Error('You do not have permission to perform this action.');
    }
    next();
  };
};