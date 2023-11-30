const userModel = require("../models/userModel");
const userTokenModel = require("../models/userTokenModel");
const jwt = require("../services/jwt");
const { check } = require("../utils/bcrypt");

exports.login = async (req, res) => {
  const { id, password } = req.body;

  try {
    const user = await userModel.getUser(id);

    if (!user) {
      return res.status(400).send("Invalid credentials");
    }

    // Check password
    const isValid = check(password, user.password);

    if (!isValid) {
      return res.status(400).send("Invalid password");
    }

    // Generate token
    const accessToken = jwt.generateAccessToken(user);
    const refreshToken = jwt.generateRefreshToken(user);
    // Store refresh token in db
    await userTokenModel.storeRefreshToken(refreshToken, user.id);

    return res
      .status(200)
      .send({ accessToken, refreshToken, role: user.role.name });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error });
  }
};

exports.logout = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    // remove refresh token
    const isRemove = await userTokenModel.removeRefreshToken(refreshToken);

    if (!isRemove) {
      return res.status(404).send({ message: "Token not found" });
    }

    return res.sendStatus(204);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error });
  }
};

exports.updateAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.sendStatus(403);
  }

  // Verify refresh token
  try {
    // decode contain information like payload, in token
    const user = jwt.verifyRefreshToken(refreshToken);
    const newAccessToken = jwt.generateAccessToken(user);

    return res.status(201).send({ accessToken: newAccessToken });
  } catch (error) {
    return res.sendStatus(403);
  }
};

exports.changePassword = async (req, res) => {
  const { id, oldPass, newPass, rePass } = req.body;

  try {
    const user = await userModel.getUser(id);

    // Update password
    await userModel.updatePassword(user.id, newPass);

    res.status(200).send({ message: "Password successfully changed" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server error" });
  }
};
