const userModel = require("../models/userModel");
const { check } = require("../utils/bcrypt");

exports.changePassword = async (req, res, next) => {
  const { id, oldPass, newPass, rePass } = req.body;
  const user = await userModel.getUser(id);

  if (!user) {
    return res.status(400).send("Invalid credentials");
  }

  // check if oldPassword correct
  const isCorrect = check(oldPass, user.password);

  if (!isCorrect) {
    return res.status(400).send({ message: "Invalid current password" });
  }

  if (newPass !== rePass) {
    return res.status(400).send({ message: "Re-type password not match" });
  }

  if (!validatePassword(newPass)) {
    return res.status(400).send({
      message:
        "Password is at least 8 characters long and contains at least one uppercase letter",
    });
  }

  next();
};

const validatePassword = (password) => {
  // This function checks if the password is at least 8 characters long and contains at least one uppercase letter.
  const regex = /^(?=.*[A-Z]).{8,}$/;
  return regex.test(password);
};
