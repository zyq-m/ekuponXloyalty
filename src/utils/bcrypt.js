const bcrypt = require("bcryptjs");

const salt = bcrypt.genSaltSync(10);

// Hash password
exports.hash = function (password) {
  return bcrypt.hashSync(password, salt);
};

// Check password
exports.check = function (password, hashed) {
  // compare plain password with hashed
  return bcrypt.compareSync(password, hashed); // true
};
