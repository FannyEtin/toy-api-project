const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.header("x-api-key");
  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ error: "Invalid token" });
  }
};

module.exports = auth;