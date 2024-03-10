const limitModel = require("../models/limitSpendModel");

exports.getLimitSpend = async (req, res) => {
  try {
    const limit = await limitModel.getAllLimit();

    res.status(200).send(limit);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateLimitSpend = async (req, res) => {
  const { limit, roleId } = req.body;

  try {
    const updateLimit = await limitModel.updateLimit(limit, roleId);

    res.status(201).send(updateLimit);
  } catch (error) {
    res.status(500).send(error);
  }
};
