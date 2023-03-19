
const express = require('express');
const router = express.Router();
const Workout = require('../Models/WorkoutLibrary');
const WorkoutTrack = require('../Models/WorkoutLibrary');
const mongoose = require('mongoose');
const User = require('../Models/User')

//add new workout in the workout library
router.post('/workout',(req, res, next) => {

    const user = User.findById(req.user.user_id);
    if (user.role !== 'Trainer') {
      return res.status(403).json({
        message: 'Only trainers can add the workout'
      });
    }

    const workout = new Workout({
        _id: new mongoose.Types.ObjectId,
        workout_id: req.body.workout_id,
        workout_name: req.body.workout_name,
        workout_description: req.body.workout_description,
        workout_image: req.body.workout_image,
        workout_time: req.body.workout_time,
        workout_price: req.body.workout_price,
        difficulty_level: req.body.difficulty_level,
        excercise_sets: req.body.excercise_sets,
        goal: req.body.goal,
        calories_burned_estimate: req.calories_burned_estimate,
        payment: req.body.payment
    })
    workout.save() 
        .then(result => {
            console.log(result);
            res.status(200).json({
                newWorkout: result
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err

            })
        })
})


// post the tracking
router.post('/WorkoutTracking',(req, res, next) => {
  const workoutTrack = new WorkoutTrack({
      _id: new mongoose.Types.ObjectId,
      workout_id: req.body.workout_id,
      percentage: req.body.percentage,
      goals_completed: req.body.goals_completed,
      calories_burned: req.calories_burned,
      notes: req.body.notes
  })
  workoutTrack.save() 
      .then(result => {
          console.log(result);
          res.status(200).json({
              newWorkoutTrack: result
          })
      })
      .catch(err => {
          console.log(err);
          res.status(500).json({
              error: err

          })
      })
})

// Get the workout Tracking
router.get('/WorkoutTracking', (req, res, next) => {
  WorkoutTrack.find()
      .exec()
      .then(result => {
          res.status(200).json({
              workoutTrack: result
          })
      })
      .catch(err => {
          console.log(err);
          res.status(500).json({
              error: err
          })
      })
});


// Get all the workout
router.get('/', (req, res, next) => {
    Workout.find()
        .exec()
        .then(result => {
            res.status(200).json({
                workout: result
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
});

//get the workout by its id 
router.get('/:id', (req, res, next) => {
    console.log(req.params.id);
    Workout.findById(req.params.id)
        .then(result => {
            res.status(200).json({
                workout: result
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
})

//delete the workout
router.delete('/:id', (req, res, next) => {

    const user = User.findById(req.user.user_id);
    if (user.role !== 'Trainer') {
      return res.status(403).json({
        message: 'Only trainers can delete the workout'
      });
    }
    
    Workout.remove({ _id: req.params.id })
        .then(result => {
            res.status(200).json({
                message: 'Workout has been deleted',
                result: result
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

//update the workout
router.put('/:id', (req, res, next) => {

    const user = User.findById(req.user.user_id);
    if (user.role !== 'Trainer') {
      return res.status(403).json({
        message: 'Only trainers can update the workout'
      });
    }

    Workout.findOneAndUpdate({ _id: req.params.id }, {
        $set: {
            _id: new mongoose.Types.ObjectId,
            workout_id: req.body.workout_id,
            workout_name: req.body.workout_name,
            workout_description: req.body.workout_description,
            workout_image: req.body.workout_image,
            workout_time: req.body.workout_time,
            difficulty_level: req.body.difficulty_level,
            excercise_sets: req.body.excercise_sets,
            goal: req.body.goal,
            calories_burned: req.body.calories_burned,
            payment: req.body.payment
        }
    })
        .then(result => {
            res.status(200).json({
                updated_workout: result
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })

        })
})

module.exports = router;