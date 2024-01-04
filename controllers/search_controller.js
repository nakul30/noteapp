const Note = require("../models/note");
module.exports.searchquery = async function (req, res) {
  try {
    const query = req.query.q;
    const user = req.user;

    if (!query) {
      return res.status(400).json({ error: "Missing query" });
    }
    const notes = await Note.find({
      $or: [
        { nheading: { $regex: query, $options: "i" } },
        { ncontent: { $regex: query, $options: "i" } },
      ],
      nuser: user._id,
    });

    res.json({ notes });
  } catch (error) {
    console.error("Error in searchquery:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
