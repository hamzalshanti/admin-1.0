const multer = require('multer');
const fs = require('fs');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
    cb(null, true);
  else cb(null, false);
};

upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = upload;
