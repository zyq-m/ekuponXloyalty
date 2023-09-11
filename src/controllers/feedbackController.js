// Require model
const feedbackModel = require("../models/feedbackModel");

exports.createFeedback = async (req, res) => {
  const { id, description } = req.body;

  try {
    const feedback = await feedbackModel.save(id, description);

    if (!feedback) {
      return res.status(404).send({ message: "Invalid" });
    }

    return res.status(201).send({ data: feedback });
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

exports.getFeedback = async (req, res) => {
  const feedback = await feedbackModel.getAll();

  if (!feedback) {
    return res.status(404).send({ message: "Feedback not found" });
  }

  return res.status(200).send({ data: feedback });
};
