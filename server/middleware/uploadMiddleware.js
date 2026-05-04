const multer = require('multer');
const path = require('path');
const fs = require('fs');

const createStorage = (folder) => {
  const uploadPath = path.join(__dirname, '..', 'uploads', folder);
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  return multer.diskStorage({
    destination(req, file, cb) {
      cb(null, uploadPath);
    },
    filename(req, file, cb) {
      cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
  });
};

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Images Only!'));
  }
}

const createUpload = (folder) => multer({
  storage: createStorage(folder),
  limits: { fileSize: 5000000 },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
});

const vehicleUpload = createUpload('vehicles');
const reviewUpload = createUpload('reviews');
const destinationUpload = createUpload('destinations');
const profileUpload = createUpload('profiles');

module.exports = vehicleUpload;
module.exports.reviewUpload = reviewUpload;
module.exports.destinationUpload = destinationUpload;
module.exports.profileUpload = profileUpload;
