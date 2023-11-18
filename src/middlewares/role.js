const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.defineRole = (roles) => {
  return async (req, res, next) => {
    const userRole = req.user.role;
    const isExist = await getRole(userRole);

    // If roles(arr) not include in userRole(req header)
    // it will throw error message
    if (!roles.includes(userRole) || !isExist) {
      return res
        .status(405)
        .send({ message: "You are not allowed to access this" });
    }

    next();
  };
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
