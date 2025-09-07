const mongoose = require('mongoose');
const { Schema } = mongoose;

const projectSchema = new Schema({
  landownerId: {
    type: Schema.Types.ObjectId,
    ref: 'Landowner',
    required: true
  },
  farmerIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true
  }],
  status: {
    type: String,
    enum: ['Pending Confirmation', 'Active', 'On Hold', 'Completed', 'Cancelled'],
    default: 'Pending Confirmation'
  },
  projectDetails: {
    crop: { type: String, required: true },
    projectedStartDate: { type: Date }
  },
  // assignedBy: { type: Schema.Types.ObjectId, ref: 'Admin' }, // Optional
  matchDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
