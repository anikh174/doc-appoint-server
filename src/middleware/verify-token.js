const { createRemoteJWKSet, jwtVerify } = require("jose-cjs");
const { env } = require("../config/env");

const JWKS = createRemoteJWKSet(new URL(`${env.CLIENT_URL}/api/auth/jwks`));

function unauthorized(res) {
  return res.status(401).json({
    success: false,
    error: { message: "Unauthorized, please login first" },
  });
}

async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return unauthorized(res);
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return unauthorized(res);
  }

  try {
    const { payload } = await jwtVerify(token, JWKS);
    req.auth = payload;
    return next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: { message: "Forbidden" },
    });
  }
}

module.exports = { verifyToken };
