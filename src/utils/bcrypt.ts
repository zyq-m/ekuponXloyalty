import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

// Hash password
export const hash = function (password: string) {
  return bcrypt.hashSync(password, salt);
};

// Check password
export const check = function (password: string, hashed: string) {
  // compare plain password with hashed
  return bcrypt.compareSync(password, hashed); // true
};
