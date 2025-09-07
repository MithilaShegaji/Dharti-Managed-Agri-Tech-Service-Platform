const mongoose = require('mongoose');

const LandownerSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  phoneNumber: String,
  email: String,
  residentialAddress: String,
  aadharNumber: String,
  photo: String, // file path

  landDetails: {
    landAddress: String,
    landArea: Number,
    landUnit: String,
    ownershipProof: String, // file path
    location: {
      lat: Number,
      lng: Number
    }
  },

  preferences: {
    soilType: String,
    isPmKisanRegistered: Boolean
  },

  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Landowner', LandownerSchema);
