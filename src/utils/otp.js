const speakeasy = require("speakeasy");
const bcrypt = require("../utils/bcrypt");

function generateSecret() {
  const { base32: secret } = speakeasy.generateSecret({ length: 20 });

  return secret;
}

function generateToken(secret) {
  return speakeasy.totp({
    secret: secret,
    encoding: "base32",
    step: 30,
  });
}

function verify(token, secret) {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: "base32",
    token: token,
    window: 1,
  });
}

module.exports = {
  generateSecret,
  generateToken,
  verify,
};
