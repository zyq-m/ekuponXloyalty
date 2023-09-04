const speakeasy = require("speakeasy");

// Generate a secret key.
exports.secret = speakeasy.generateSecret({ length: 20 });

// Returns token for the secret at the current time
// Compare this to user input
exports.token = speakeasy.totp({
  secret: this.secret.base32,
  encoding: "base32",
  time: 60,
});

exports.verify = function (token) {
  return speakeasy.totp.verify({
    secret: this.secret.base32,
    encoding: "base32",
    token: token,
    window: 6,
  });
};
