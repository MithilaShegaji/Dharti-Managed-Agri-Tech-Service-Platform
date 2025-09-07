const express = require('express');
const multer = require('multer');
const path = require('path');
const Landowner = require('../models/Landowner');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Serve form
// router.get('/form', (req, res) => {
//   res.sendFile(path.join(__dirname, '../views/landownerForm.html'));
// });

// Submit form
router.post(
  '/',
  upload.fields([{ name: 'photo' }, { name: 'ownershipProof' }]),
  async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        phoneNumber,
        email,
        residentialAddress,
        aadharNumber,
        landAddress,
        landArea,
        landUnit,
        soilType,
        isPmKisanRegistered
      } = req.body;

      const landowner = new Landowner({
        firstName,
        lastName,
        phoneNumber,
        email,
        residentialAddress,
        aadharNumber,
        photo: req.files.photo?.[0]?.filename,
        landDetails: {
          landAddress,
          landArea,
          landUnit,
          ownershipProof: req.files.ownershipProof?.[0]?.filename
        },
        preferences: {
          soilType,
          isPmKisanRegistered: isPmKisanRegistered === 'on'
        }
      });

      await landowner.save();
      res.send('Landowner submitted successfully!');
    } catch (err) {
      console.error(err);
      res.status(500).send('Something went wrong.');
    }
  }
);

module.exports = router;
