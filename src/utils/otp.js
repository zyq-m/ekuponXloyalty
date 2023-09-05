const speakeasy = require("speakeasy");

const { base32: secret } = speakeasy.generateSecret({ length: 20 });

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
  secret,
  generateToken,
  verify,
};
