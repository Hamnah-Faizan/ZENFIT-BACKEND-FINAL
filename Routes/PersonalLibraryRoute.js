const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {verifyAccessToken } = require('../Helpers/JwtHelper');
const PersonalLibrary = require('../Models/PersonalLibrary');
const Customer = require('../Models/Customer');
const Workout = require('../Models/Workouts');
const User = require('../Models/User');
const { signAccessToken, signRefreshToken, verifyRefreshTokens } = require('../Helpers/JwtHelper')


// Get all the personal libraries
router.get('/', verifyAccessToken, (req, res, next) => {
    PersonalLibrary.find()
        .exec()
        .then(result => {
            res.status(200).json({
                personal_libraries: result
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
});

router.get('/myworkouts', verifyAccessToken, async (req, res, next) => {
  try {
    const customerId = req.payload.aud;
    console.log('Customer ID:', customerId);

    const customer = await Customer.findOne({ user: customerId }).populate('personal_library');
    console.log('Customer:', customer);

    if (!customer) {
      console.log('Personal library not found');
      return res.status(404).send('Personal library not found');
    }

    const personalLibrary = customer.personal_library;
    console.log('Personal library:', personalLibrary);

    const purchasedWorkouts = personalLibrary.workouts_purchased;
    console.log('Purchased workouts:', purchasedWorkouts);

    if (purchasedWorkouts.length === 0) {
      console.log('No workouts purchased');
      return res.status(200).json({
        message: 'No workouts purchased'
      });
    }

    const workouts = await Workout.find({ _id: { $in: purchasedWorkouts } })
      .select('workout_name difficulty_level workout_description goal calories_burned duration workout_thumbnail');
    console.log('Retrieved workouts:', workouts);

    res.status(200).json({
      purchased_workouts: workouts
    });
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});


// get the personal library by its id
router.get('/mylibrary', verifyAccessToken, async (req, res, next) => {
  try {
    const customerId = req.payload.aud;
    console.log('Customer ID:', customerId);

    const customer = await Customer.findOne({ user: customerId }).populate({
      path: 'personal_library',
      select: 'username workouts_purchased'
    })
    console.log('Customer:', customer);

    if (!customer) {
      console.log('Personal library not found');
      return res.status(404).send('Personal library not found');
    }

    const personalLibrary = customer.personal_library;
    console.log('Personal library:', personalLibrary);

    res.status(200).json({
      personal_library: personalLibrary
    });
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});


//GET PURCHASED WORKOUTS
router.get('/mytracking', verifyAccessToken, async (req, res, next) => {
  try {
    const userId = req.payload.aud; // Extract the user ID from the access token

    const customer = await Customer.findOne({ user: userId }).populate('fitness_tracking');

    if (!customer) {
      console.log('Customer not found');
      return res.status(404).send('Customer not found');
    }

    const fitnessTrackings = await FitnessTrack.find({ _id: { $in: customer.fitness_tracking } });

    res.status(200).json({
      fitness_tracking: fitnessTrackings
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message
    });
  }
});




//update the personal library
router.put('/update/:id', verifyAccessToken, (req, res, next) => {
    console.log(req.body)
    PersonalLibrary.findById(req.params.id)
        .then(library => {
            if (!library) 
                return res.status(404).send('Personal library not found')
            if (library.username !== req.user.username) {
              return res.status(403).send('Forbidden');
            }
            PersonalLibrary.updateOne({ _id: req.params.id }, 
                {
                $set: {
                    personal_library_id: req.body.personal_library_id,
                    username: req.body.username,
                    workouts_purchased: req.body.workouts_purchased,
                    goals: req.body.goals,
                    progress: req.body.progress,
                    notifications: req.body.notifications
                }
            })
                .then(result => {
                    res.status(200).json({
                        updatedLibrary: result
                    })
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    })
                })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
})


// delete a personal library
router.delete('/:id', verifyAccessToken, (req, res, next) => {
    PersonalLibrary.findOneAndRemove({ personal_library_id: req.params.id, userId: req.user._id })
      .then(result => {
        if (!result) {
          return res.status(404).json({
            message: 'Personal library not found'
          });
        }
        res.status(200).json({
          message: 'Personal library deleted successfully',
          data: result
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });
  
  
module.exports = router;
