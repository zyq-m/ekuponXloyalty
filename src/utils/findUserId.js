const { PrismaClient } = require("@prisma/client");
const studentModel = require("./studentModel");
const cafeModel = require("./cafeModel");
const adminModel = require("./adminModel");

const prisma = new PrismaClient();

// HELPER
exports.findId = async id => {
  const student = studentModel.getUserId(id);
  const cafe = cafeModel.getUserId(id);
  const admin = adminModel.getUserId(id);

  const userId = await Promise.allSettled([student, cafe, admin]);

  if (userId[0]) {
    return userId[0];
  }

  if (userId[1]) {
    return userId[1];
  }

  if (userId[2]) {
    return userId[2];
  }

  // Not found
  return false;
};
