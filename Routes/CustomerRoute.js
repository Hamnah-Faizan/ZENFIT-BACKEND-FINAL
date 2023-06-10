const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {verifyAccessToken } = require('../Helpers/JwtHelper');
const PersonalLibrary = require('../Models/PersonalLibrary');
const User = require('../Models/User');
const Customer = require('../Models/Customer');

const { authorizationSchema, paymentSchema } = require('../Helpers/ValidationSchema')
//const WorkoutLibrary = require('../Models/Workouts');
//const WorkoutTracking = require('../Models/WorkoutTracking');
const { signAccessToken, signRefreshToken, verifyRefreshTokens } = require('../Helpers/JwtHelper')


router.post('/payment', verifyAccessToken, async (req, res, next) => {
    const { cardType, cardNumber, expiryDate, cvv } = req.body;
  
    const isValid = cardNumber && cardNumber.length > 0;
  
    const isPaymentSuccessful = isValid;
  
    if (isPaymentSuccessful) {
      const  workoutId  = req.body.workout;
      const userId = req.payload.aud;
      console.log(workoutId)
      console.log(userId)
      const customer = await Customer.findOne({ user: userId });
      console.log(customer.personal_library._id)
      try {
        const customer = await Customer.findOne({ user: userId });
        const personalLibrary = await PersonalLibrary.findOne({_id: customer.personal_library});
        console.log(personalLibrary.workouts_purchased)
        personalLibrary.workouts_purchased.push(workoutId);
        await personalLibrary.save();
  
        res.status(200).json({
          success: true,
          message: 'Payment successful',
          personalLibrary,
        });
      } catch (error) {
        console.error('Error adding workout to personal library:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to add workout to personal library',
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid card information',
      });
    }
  });


  module.exports = router;