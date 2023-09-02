const { PrismaClient } = require("@prisma/client");
// const {} = require('../utils/') jwt

const prisma = new PrismaClient();

exports.admin = async (req, res, next) => {
  const id = "role"; // Get user id from jwt
  const role = await getRole(id);

  if (role != 3) {
    return res
      .status(405)
      .json({ error: "You are not allowed to access this" });
  }

  next();
};

exports.student = async (req, res, next) => {
  const id = "role"; // Get user id from jwt
  const role = await getRole(id);

  if (role != 1 || role != 2) {
    return res
      .status(405)
      .json({ error: "You are not allowed to access this" });
  }

  next();
};

exports.cafe = async (req, res, next) => {
  const id = "role"; // Get user id from jwt
  const role = await getRole(id);

  if (role != 4) {
    return res
      .status(405)
      .json({ error: "You are not allowed to access this" });
  }

  next();
};

// HELPER
// find role by user id
async function getRole(id) {
  return await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      roleId: true,
    },
  });
}
