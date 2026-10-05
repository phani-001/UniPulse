const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  getMyProfile, updateMyProfile, getStudentProfile,
  discoverStudents, getSuggestedStudents, uploadPhoto
} = require('../controllers/profile.controller');
const auth = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Only images allowed'));
    cb(null, true);
  }
});

router.use(auth);

router.get('/discover', discoverStudents);
router.get('/suggested', getSuggestedStudents);
router.get('/me', getMyProfile);
router.put('/me', updateMyProfile);
router.post('/me/photo', upload.single('photo'), uploadPhoto);
router.get('/:id', getStudentProfile);

module.exports = router;
