const { getRole } = require("../utils/role");

exports.defineRole = (roles) => {
  return async (req, res, next) => {
    const roleId = req.user?.roleId;

    if (!roleId) {
      return res.status(405).send({ message: "Who are you?" });
    }

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
