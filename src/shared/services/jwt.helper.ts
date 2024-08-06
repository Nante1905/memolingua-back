import jwt = require("jsonwebtoken");

export const verifyToken = async (token: string, key: string) => {
  if (!token) return {};
  return new Promise((resolve, reject) =>
    jwt.verify(token, key, (err, decoded) =>
      err ? reject(err) : resolve(decoded)
    )
  );
};
