const mongoose = require('mongoose');

const fitnessTrackingSchema = new mongoose.Schema({
  // Define the schema fields here
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  calories_eaten: {
    type: Number,
    required: true
  },
  daily_calories: {
    type: Number,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  bmi: {
    type: Number,
    required: true
  },

  height: { 
  type: String,
  required: true
  }

});

const FitnessTracking = mongoose.model('FitnessTracking', fitnessTrackingSchema);
module.exports = FitnessTracking;