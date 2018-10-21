module.exports = function(req, res, next) {
  // If is not admin, send resposne with status 403: FORBIDDEN
  if (!req.user.isAdmin) return res.status(403).send("Access denied.");

  next();
};
