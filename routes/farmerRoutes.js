const express = require('express');
const multer = require('multer');
const Farmer = require('../models/Farmer');
const router = express.Router();
const path = require('path'); 


// Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// router.get('/form', (req, res) => {
//   res.sendFile(path.join(__dirname, '../views/farmerForm.html'));
// });

router.post(
  '/',
  upload.fields([
    { name: 'aadharCard', maxCount: 1 },
    { name: 'kccCard', maxCount: 1 },
    { name: 'photo', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const {
        firstName, lastName, phoneNumber, 
        experienceInYears, skills,
        aadharNumber, kisanCreditCardNumber, isPmKisanRegistered
      } = req.body;

      const farmer = new Farmer({
        firstName,
        lastName,
        phoneNumber,
        location: {
            village: req.body.village,
            district: req.body.district,
            state: req.body.state
        },

        experienceInYears,
        skills: skills.split(','),
        verification: {
          aadharNumber,
          kisanCreditCardNumber,
          isPmKisanRegistered: isPmKisanRegistered === 'true'
        },
        documents: {
          aadharCardPath: req.files['aadharCard'][0].path,
          kisanCreditCardPath: req.files['kccCard']?.[0]?.path,
          photoPath: req.files['photo'][0].path
        }
      });

      await farmer.save();
      res.status(200).json({ message: 'Farmer registered', farmer });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Registration failed' });
    }
  }
);

module.exports = router;
