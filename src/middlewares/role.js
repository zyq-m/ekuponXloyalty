const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.defineRole = (roles) => {
  return async (req, res, next) => {
    const roleId = req.user?.role;
    const roleName = await getRole(roleId);

    // If roles(arr) not include in userRole(req header)
    // it will throw error message
    if (!roles.includes(roleName.name)) {
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
  return await prisma.role.findUnique({
    where: {
      id: id,
    },
    select: {
      name: true,
    },
  });
}
