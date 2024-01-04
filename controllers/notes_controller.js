const User = require("../models/user");
const Note = require("../models/note");
module.exports.createnote = async function (req, res) {
  try {
    // console.log("error in notes_controller_createnote")
    const { nheading, ncontent } = req.body;
    if (!nheading || !ncontent) {
      return res
        .status(400)
        .json({ message: "Heading and content are required" });
    }

    const userId = req.user._id;

    const newNote = new Note({
      nheading,
      ncontent,
      nuser: userId,
    });

    // Save note and update user's notes array in a single operation
    const [savedNote, user] = await Promise.all([
      newNote.save(),
      User.findByIdAndUpdate(
        userId,
        { $push: { notes: newNote._id } },
        { new: true }
      ),
    ]);

    res.status(201).json({ note: savedNote, user: user.notes });
  } catch (err) {
    console.error("Error creating note:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports.notesload = async function (req, res) {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const userId = req.user.id;
    // console.log(userId)
    const noteIds = req.user.notes; // Assuming the array is named "notes"

    const notes = await Note.find({ _id: { $in: noteIds } })
      .sort({ createdAt: -1 })
      .populate("nuser")
      .lean();

    res.json(notes);
  } catch (error) {
    console.error("Error in notesload:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.onenoteload = async function (req, res) {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const noteId = req.params.id;
    const authenticatedUserId = req.user._id;

    const note = await Note.findById(noteId).populate("nuser").lean();

    console.log(authenticatedUserId.toString());
    if (
      !note ||
      (!note.shareduser
        .map((obj) => obj.toString())
        .includes(authenticatedUserId.toString()) &&
        note.nuser._id.toString() !== authenticatedUserId.toString())
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.json(note);
  } catch (error) {
    console.error("Error in onenoteload:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.updatenote = async function (req, res) {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const noteId = req.params.id;
    const authenticatedUserId = req.user._id;
    const note = await Note.findById(noteId);

    // Check if note exists
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    if (note.nuser._id.toString() !== authenticatedUserId.toString()) {
      return res.status(403).json({ error: "Forbidden" });
    }

    Object.assign(note, req.body);

    await note.save();

    res.json({ message: "Note updated successfully" });
  } catch (error) {
    console.error("Error in updatenote:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports.deletenode = async function (req, res) {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const noteId = req.params.id;
    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    const userId = req.user._id;
    await User.findByIdAndUpdate(userId, { $pull: { notes: noteId } });

    // Delete the note
    await note.deleteOne();

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error in deletenode:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.sharenote = async function (req, res) {
  try {
    const noteId = req.params.id;
    const recipientUserId = req.body.sharedUserId;

    const originalNote = await Note.findById(noteId);

    // Check if note exists
    if (!originalNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    await Note.findByIdAndUpdate(noteId, {
      $push: { shareduser: recipientUserId },
    });

    await User.findByIdAndUpdate(recipientUserId, { $push: { notes: noteId } });

    res.json({ message: "Note shared successfully" });
  } catch (error) {
    console.error("Error in sharenote:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
