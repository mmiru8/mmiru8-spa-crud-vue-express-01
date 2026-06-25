function checkAuth(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "Utilizator neautentificat"
    });
  }

  next();
}

module.exports = {
  checkAuth
};