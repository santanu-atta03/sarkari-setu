/**
 * Upload Routes — Admin Only
 *
 *  POST /api/upload/image — for featured image uploads
 */

const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const { protect } = require('../middleware/auth');

router.post('/image', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded.' });
  }

  return res.json({
    success: true,
    message: 'Image uploaded successfully.',
    data: {
      url: req.file.path,
      id:  req.file.filename,
    },
  });
});

module.exports = router;
