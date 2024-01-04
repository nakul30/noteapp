const Note = require('../models/note')
module.exports.searchquery = async function (req, res) {
    try {
      // 1. Extract query and user
      const query = req.query.q;
      const user = req.user;
  
      // 2. Validate input
      if (!query) {
        return res.status(400).json({ error: 'Missing query' });
      }
  
      // 3. Perform search based on your data model and logic
      // Replace with your actual search implementation
      const notes = await Note.find({
        $or: [
          { nheading: { $regex: query, $options: 'i' } }, // Case-insensitive search in heading
          { ncontent: { $regex: query, $options: 'i' } }, // Case-insensitive search in content
        ],
        nuser: user._id, // Restrict search to authenticated user's notes
      });
  
      // 4. Format response
      res.json({ notes });
    } catch (error) {
      console.error('Error in searchquery:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  