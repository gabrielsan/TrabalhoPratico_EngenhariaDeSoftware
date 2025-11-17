const jwt = require("jsonwebtoken");

function verificarToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({
      message: global.ENVIRONMENT.ERROR_REASONS_TEXT.EMPTY_TOKEN,
      errCode: global.ENVIRONMENT.ERROR_REASONS_CODE.EMPTY_TOKEN,
    });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      if (err.name == "TokenExpiredError")
        return res.status(401).json({
          message: global.ENVIRONMENT.ERROR_REASONS_TEXT.EXPIRED_TOKEN,
          errCode: global.ENVIRONMENT.ERROR_REASONS_CODE.EXPIRED_TOKEN,
        });

      return res.status(401).json({
        message: global.ENVIRONMENT.ERROR_REASONS_TEXT.AUTHENTICATION_ERROR,
        errCode: global.ENVIRONMENT.ERROR_REASONS_CODE.AUTHENTICATION_ERROR,
      });
    }

    req.userId = decoded.id;
    next();
  });
}

module.exports = { verificarToken };
