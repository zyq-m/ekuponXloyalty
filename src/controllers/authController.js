const { PrismaClient } = require("@prisma/client");
const { findId } = require("../utils/findUserId");
const { generateToken } = require("../services/jwt");
const { check } = require("../utils/bcrypt");

const prisma = new PrismaClient();

exports.login = async (req, res) => {
  const { id, password } = req.body;

  try {
    const userId = await findId(id);
    // Find user id
    if (!userId) {
      return res.status(404).message("Invalid credentials");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    // Check password
    const isValid = check(password, user.password);

    if (!isValid) {
      return res.status(404).message("Invalid password");
    }

    // Generate token
    const { accessToken, refreshToken } = generateToken(user);

    // Store refresh token
    await prisma.userToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
      },
    });

    return res.status(200).send({ accessToken, refreshToken });
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};
