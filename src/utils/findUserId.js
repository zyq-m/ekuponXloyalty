const studentModel = require("../models/studentModel");
const cafeModel = require("../models/cafeModel");
const adminModel = require("../models/adminModel");

// HELPER
exports.findId = async id => {
  const student = studentModel.getUserId(id);
  const cafe = cafeModel.getUserId(id);
  const admin = adminModel.getUserId(id);

  const userId = await Promise.allSettled([student, cafe, admin]);

  if (userId[0].value?.userId) {
    return userId[0];
  }

  if (userId[1].value?.userId) {
    return userId[1];
  }

  if (userId[2].value?.userId) {
    return userId[2];
  }

  // Not found
  return false;
};
