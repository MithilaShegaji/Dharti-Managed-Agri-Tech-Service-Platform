const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: false, trim: true },
    phoneNumber: { type: String, required: true, unique: true, trim: true },
    location: {
        village: { type: String, required: true },
        district: { type: String, required: true },
        state: { type: String, required: true },
    },
    experienceInYears: { type: Number, required: true, min: 0 },
    skills: { type: [String], required: true },
    verification: {
        aadharNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            validate: {
                validator: v => /^\d{12}$/.test(v),
                message: props => `${props.value} is not a valid 12-digit Aadhaar number`
            }
        },
        kisanCreditCardNumber: {
            type: String,
            trim: true,
            validate: {
                validator: v => !v || /^\d{8,16}$/.test(v), // optional field, 8–16 digit number
                message: props => `${props.value} is not a valid KCC number`
            }
        },
        isPmKisanRegistered: { type: Boolean, default: false }
    },
    documents: {
        aadharCardPath: { type: String, required: true },
        kisanCreditCardPath: { type: String },
        photoPath: { type: String, required: true }
    },
    status: {
        type: String,
        enum: ['Pending', 'Verified', 'Rejected'],
        default: 'Pending'
    },
    registrationDate: { type: Date, default: Date.now }
});

const Farmer = mongoose.model('Farmer', farmerSchema);
module.exports = Farmer;
