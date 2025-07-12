const express = require('express');
const router = express.Router();
const { upload } = require('../utils/cloudinary');
const File = require('../models/File');

router.post('/single', upload.single('file'), async (req, res) => {
  try {
    const file = await File.create({
      filename: req.file.originalname,
      url: req.file.path,
      public_id: req.file.filename,
      format: req.file.format,
      resource_type: req.file.resource_type,
      size: req.file.size
    });

    res.status(201).json({
      success: true,
      data: file
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.post('/multiple', upload.array('files'), async (req, res) => {
  try {
    const files = await File.insertMany(
      req.files.map(file => ({
        filename: file.originalname,
        url: file.path,
        public_id: file.filename,
        format: file.format,
        resource_type: file.resource_type,
        size: file.size
      }))
    );

    res.status(201).json({
      success: true,
      count: files.length,
      data: files
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;