const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const compressImages = async (req, res, next) => {
  try {
    const filesToProcess = [];

    // Check single file upload (req.file)
    if (req.file) {
      filesToProcess.push(req.file);
    }

    // Check multiple files upload (req.files is an object of arrays, or an array)
    if (req.files) {
      if (Array.isArray(req.files)) {
        filesToProcess.push(...req.files);
      } else {
        // It's an object (like from upload.fields)
        Object.values(req.files).forEach(fileArray => {
          if (Array.isArray(fileArray)) {
            filesToProcess.push(...fileArray);
          }
        });
      }
    }

    // Process all files in parallel
    await Promise.all(filesToProcess.map(async (file) => {
      // Check if it's an image
      if (!file.mimetype.startsWith('image/')) return;

      const filePath = file.path;
      // We will create a temp path in the same directory
      const ext = path.extname(filePath);
      const dir = path.dirname(filePath);
      const base = path.basename(filePath, ext);
      const tempPath = path.join(dir, `${base}_compressed${ext}`);

      try {
        const image = sharp(filePath);
        const metadata = await image.metadata();

        // Limit to max 1200px width (maintaining aspect ratio)
        let pipeline = image.resize({ width: 1200, withoutEnlargement: true });

        // Compress based on format
        if (metadata.format === 'jpeg' || metadata.format === 'jpg') {
          pipeline = pipeline.jpeg({ quality: 80, progressive: true });
        } else if (metadata.format === 'png') {
          pipeline = pipeline.png({ quality: 80, compressionLevel: 8 });
        } else if (metadata.format === 'webp') {
          pipeline = pipeline.webp({ quality: 80 });
        } else {
          // Fallback compression
          pipeline = pipeline.jpeg({ quality: 80, progressive: true });
        }

        await pipeline.toFile(tempPath);

        // Update file size in req.file/req.files object so that controller knows the actual compressed size
        const compressedStats = await fs.stat(tempPath);
        file.size = compressedStats.size;

        // Replace original file with compressed one
        await fs.unlink(filePath);
        await fs.rename(tempPath, filePath);
      } catch (err) {
        console.error(`Error compressing file ${file.filename}:`, err);
        // Clean up temp file if it exists
        try {
          await fs.unlink(tempPath);
        } catch (_) {}
      }
    }));

    next();
  } catch (error) {
    console.error('Error in compression middleware:', error);
    next(); // don't block the request if compression fails, just proceed with original files
  }
};

module.exports = compressImages;
