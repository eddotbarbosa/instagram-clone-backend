const sharp = require('sharp');
const fs = require('fs');

//config options
exports.resize = async function (req, res, next) {
  try {
    await sharp(req.file.path)
      .resize(1080, 1080)
      .toFile(process.cwd() + '/src/tmp/uploads/images/rs-' + req.file.filename);

    fs.unlinkSync(req.file.path);

    next();
  } catch (err) {
    res.json({error: err});
  }
};
