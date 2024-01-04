const User = require('../models/user');
const Note = require ('../models/note')
module.exports.createnote = async function (req, res) {
    try {
      // Extract note data and validate
      // console.log("error in notes_controller_createnote")
      const { nheading, ncontent } = req.body;
      if (!nheading || !ncontent) {
        return res.status(400).json({ message: 'Heading and content are required' });
      }
  
      // Retrieve authenticated user ID
      const userId = req.user._id;
  
      // Create new note
      const newNote = new Note({
        nheading,
        ncontent,
        nuser: userId,
      });
  
      // Save note and update user's notes array in a single operation
      const [savedNote, user] = await Promise.all([
        newNote.save(),
        User.findByIdAndUpdate(userId, { $push: { notes: newNote._id } }, { new: true }),
      ]);
  
      res.status(201).json({ note: savedNote, user: user.notes });
    } catch (err) {
      console.error('Error creating note:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  module.exports.notesload = async function (req, res) {
    try {
      // Authentication check
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
  
      // Retrieve authenticated user's ID and note IDs array
      const userId = req.user.id;
      // console.log(userId) 
      const noteIds = req.user.notes; // Assuming the array is named "notes"
  
      // Load notes using $in operator for multiple ID matching
      const notes = await Note.find({ _id: { $in: noteIds } })
        .sort({ createdAt: -1 }) // Sort by creation date (newest first)
        .populate('nuser') // Populate user information for each note
        .lean(); // Optimize performance for large datasets
  
      res.json(notes);
    } catch (error) {
      console.error('Error in notesload:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
 
  // module.exports.onenoteload = async function (req, res) {
  //   try {
  //     // Authentication check
  //     if (!req.isAuthenticated()) {
  //       return res.status(401).json({ error: 'Unauthorized' }); 
  //     }
  
  //     // Extract note ID and authenticated user ID
  //     const noteId = req.params.id;
  //     const authenticatedUserId = req.user._id; // Assuming user ID is in req.user
  
  //     // Retrieve the note
  //     const note = await Note.findById(noteId)
  //       .populate('nuser') // Populate user information
  //       .lean(); // Optimize performance
  
  //     // Check if note exists and belongs to the authenticated user
  //     if (!note || note.nuser._id.toString() !== authenticatedUserId.toString()) {
  //       return res.status(403).json({ error: 'Forbidden' }); // 403 for unauthorized access
  //     }
  
  //     res.json(note);
  //   } catch (error) {
  //     console.error('Error in onenoteload:', error);
  //     res.status(500).json({ error: 'Internal server error' });
  //   }
  // };
  module.exports.onenoteload = async function (req, res) {
    try {
      // Authentication check
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
  
      // Extract note ID and authenticated user ID
      const noteId = req.params.id;
      const authenticatedUserId = req.user._id; // Assuming user ID is in req.user
  
      // Retrieve the note
      const note = await Note.findById(noteId)
        .populate('nuser') // Populate user information
        .lean(); // Optimize performance
  
      // Check if note exists and is either owned or shared with the authenticated user
      if (!note ||
        !note.shareduser.includes(authenticatedUserId) && note.nuser._id.toString() !== authenticatedUserId.toString()) {
        return res.status(403).json({ error: 'Forbidden' });
      }
  
      res.json(note);
    } catch (error) {
      console.error('Error in onenoteload:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  
  module.exports.updatenote = async function (req, res) {
    try {
      // Authentication check
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
  
      // Extract note ID from request parameters
      const noteId = req.params.id;
      const authenticatedUserId = req.user._id;
      // Retrieve the note to update
      const note = await Note.findById(noteId);
  
      // Check if note exists
      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }
      if (note.nuser._id.toString() !== authenticatedUserId.toString()) {
        return res.status(403).json({ error: 'Forbidden' }); // 403 for unauthorized access
      }
  
      // Authorize access to update the note (optional)
      // Replace with your authorization logic
      // const isAuthorized = await authorizeNoteUpdate(req.user, note);
      // if (!isAuthorized) {
      //   return res.status(403).json({ error: 'Forbidden' });
      // }
  
      // Apply updates from request body
      Object.assign(note, req.body);
  
      // Save the updated note
      await note.save();
  
      res.json({ message: 'Note updated successfully' });
    } catch (error) {
      console.error('Error in updatenote:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  module.exports.deletenode = async function (req, res) {
    try {
      // Authentication check
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
  
      // Extract note ID from request parameters
      const noteId = req.params.id;
  
      // Retrieve the note to delete
      const note = await Note.findById(noteId);
  
      // Check if note exists
      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }
  
      // Remove note ID from user's notes array
      const userId = req.user._id; // Assuming user ID is in req.user
      await User.findByIdAndUpdate(userId, { $pull: { notes: noteId } });
  
      // Delete the note
      await note.deleteOne();
  
      res.json({ message: 'Note deleted successfully' });
    } catch (error) {
      console.error('Error in deletenode:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  module.exports.sharenote = async function (req, res) {
    try {
      // Extract note ID and recipient user ID from request parameters
      const noteId = req.params.id;
      const recipientUserId = req.body.sharedUserId; // Assuming recipient user ID is in request body
  
      // Retrieve the original note
      const originalNote = await Note.findById(noteId);
  
      // Check if note exists
      if (!originalNote) {
        return res.status(404).json({ error: 'Note not found' });
      }
  
      // Add the recipient user's ID to the shareduser array
      await Note.findByIdAndUpdate(noteId, { $push: { shareduser: recipientUserId } });
  
      // Optionally, add the note ID to the recipient user's notes array (if still needed)
      await User.findByIdAndUpdate(recipientUserId, { $push: { notes: noteId } });
  
      res.json({ message: 'Note shared successfully' });
    } catch (error) {
      console.error('Error in sharenote:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  