const multer = require('multer');

// config options
exports.picture = {
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, process.cwd() + '/src/tmp/uploads/images');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, ''));
    }
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('invalid file type!'));
    }
  },
  limits: {
    fileSize: 2 * 1024 * 1024
  }
};
