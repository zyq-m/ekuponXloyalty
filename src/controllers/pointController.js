const pointModel = require("../models/pointModel");

exports.getPoint = async (req, res) => {
  try {
    const point = await pointModel.getPoint();
    res.status(200).send(point);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.createPoint = async (req, res) => {
  const { name, value } = req.body;
  try {
    const point = await pointModel.createPoint(name, value);
    res.status(201).send(point);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.editPoint = async (req, res) => {
  const { id, name, value } = req.body;
  try {
    const point = await pointModel.editPoint(id, name, value);
    res.status(201).send(point);
  } catch (error) {
    res.status(400).send(error);
  }
};
