const express = require('express');
const router = express.Router();
const FitnessTrack = require('../Models/FitnessTracking');
const mongoose = require('mongoose');
const { verifyAccessToken } = require('../Helpers/JwtHelper')
const User = require('../Models/User')
const Customer = require('../Models/Customer')
const jwt = require('jsonwebtoken');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../Helpers/JwtHelper')
//const config = require('dotenv').config().parsed;
const config = require('../config');


// POST the tracking
router.post('/fitnesstracking', verifyAccessToken, (req, res, next) => {

  const userId = req.payload.aud; // Extract the user ID from the access token
  
  const fitnessTrack = new FitnessTrack({
    userId: userId,
    date: req.body.date,
    calories_eaten: req.body.calories_eaten,
    daily_calories: req.body.daily_calories,
    weight: req.body.weight,
    bmi: req.body.bmi,
    height: req.body.height
  });

  fitnessTrack.save()
    .then(result => {
      console.log(result);
      res.status(200).json({
        fitness_track: result
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    })
});

router.get('/tracking', verifyAccessToken, async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization.split(' ')[1]; // Get the access token from the Authorization header
    const decodedToken = jwt.verify(accessToken, config.jwtSecret); // Decode the access token using your JWT secret
    const userId = decodedToken.aud; // Extract the user ID from the decoded token

    console.log('User ID:', userId);

    const trackings = await FitnessTrack.find({ userId: userId }).exec();

    res.status(200).json({ userId, fitness_track: trackings });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});


// GET a specific tracking
router.get('/:id', verifyAccessToken, (req, res, next) => {
  const userId = req.payload.aud; // Extract the user ID from the access token
  const trackingId = req.params.id;
  FitnessTrack.findOne({ _id: trackingId, userId: userId })
    .then(result => {
      if (result) {
        res.status(200).json({
          fitness_track_result: result
        });
      } else {
        res.status(404).json({
          message: 'Tracking not found for this user'
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    })
});

// UPDATE a tracking
router.put('/:id', verifyAccessToken, (req, res, next) => {
  const userId = req.payload.aud; // Extract the user ID from the access token
  const trackingId = req.params.id;
  const updateOps = {};
  for (const key of Object.keys(req.body)) {
    updateOps[key] = req.body[key];
  }
  FitnessTrack.updateOne({ _id: trackingId, userId: userId }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Tracking updated successfully'
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    })
});


module.exports = router;