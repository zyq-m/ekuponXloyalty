const { getUser, storeRefreshToken } = require("../models/useModel");
const { generateToken } = require("../services/jwt");
const { check } = require("../utils/bcrypt");

exports.login = async (req, res) => {
  const { id, password } = req.body;

  try {
    const user = await getUser(id);

    if (!user) {
      return res.status(404).message("Invalid credentials");
    }

    // Check password
    const isValid = check(password, user.password);

    if (!isValid) {
      return res.status(404).message("Invalid password");
    }

    // Generate token
    const { accessToken, refreshToken } = generateToken(user);
    await storeRefreshToken(refreshToken, user.id);

    return res.status(200).send({ accessToken, refreshToken });
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};
