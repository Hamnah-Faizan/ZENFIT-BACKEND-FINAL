const express = require('express');
const router = express.Router();
const Trainer = require("../Models/Trainer");
const mongoose = require('mongoose');

// Add the trainer
router.post("/", (req, res, next) => {

  const trainer = new Trainer({
    _id: new mongoose.Types.ObjectId,
    trainer_id: req.body.trainer_id,
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    dateofbirth: req.body.dateofbirth,
    gender: req.body.gender,
    status:"ACTIVE",
    password: hash,
    email: req.body.email,
    trainer_description: req.body.trainer_description,
    trainer_image: req.body.trainer_image,
    trainer_specialization: req.body.trainer_specialization
  })
  trainer.save()
    .then(result => {
      console.log(result);
      res.status(200).json({
        newTrainer: result
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err

      })
    })
})

// Get all the trainers
router.get('/', verifyAccessToken, (req, res, next) => {

  Trainer.find()
    .exec()
    .then(result => {
      res.status(200).json({
        exercises: result
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// Get trainer by ID
router.get('/:id', verifyAccessToken, (req, res, next) => {

  const trainerId = req.params.id;

  Exercise.findById(trainerId)
    .exec()
    .then(result => {
      if (result) {
        res.status(200).json({
          exercise: result
        });
      } else {
        res.status(404).json({
          message: 'Trainer not found'
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});


//DELETE REQUEST

router.delete('/:id', verifyAccessToken, async (req, res, next) => {

  User.findOneAndUpdate({ trainer_id: req.params.id }, {
      $set: {
          status: "INACTIVE"
      }
  })
  .then(result => {
      res.status(200).json({
          updated_user: result,
          message: "Trainer has been removed"
      })
  })
  .catch(err => {
      console.log(err);
      res.status(500).json({
          error: err
      })
  })
})


router.post('/refresh-token', async (req, res, next) => {
  try {
      const { refreshToken } = req.body
      if (!refreshToken) throw createError.BadRequest()
      const userId = await verifyRefreshToken(refreshToken)

      const accessToken = await signAccessToken(userId)
      const refToken = await signRefreshToken(userId)
      res.send({ accessToken: accessToken, refreshToken: refToken })

  } catch (error) {
      next(error)

  }
})


module.exports = router;