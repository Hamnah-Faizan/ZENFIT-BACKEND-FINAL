const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const Customer = require('../Models/Customer');
const Trainer = require('../Models/Trainer');
const PersonalLibrary = require('../Models/PersonalLibrary');
const createError = require('http-errors')
const mongoose = require('mongoose');
const { authorizationSchema } = require('../Helpers/ValidationSchema')
const bcrypt = require('bcrypt');
const { signAccessToken, signRefreshToken, verifyRefreshToken, verifyAccessToken } = require('../Helpers/JwtHelper')

//GET REQUEST

router.get('/',(req,res,next) => {
    User.find()
    .then(result => {
        res.status(200).json({
            data:result
        });        
    })
    .catch(err => {
        res.status(500).json({
            error:err
            })
        });
})

//PUT REQUEST 

router.put('/:id', verifyAccessToken, async (req, res, next) => {
    const result = await authorizationSchema.validateAsync(req.body);
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      } else {
        let updatedUser;
        if (result.role === 'Customer') {
          updatedUser = await Customer.findOneAndUpdate(
            { _id: req.params.id },
            {
              $set: {
                dateofbirth : result.dateofbirth,
                height: result.height,
                weight: result.weight,
              },
            },
            { new: true }
          );
        } else if (result.role === 'Trainer') {
          updatedUser = await Trainer.findOneAndUpdate(
            { _id: req.params.id },
            {
              $set: {
                trainer_description: result.trainer_description,
                trainer_picture: result.trainer_picture,
                trainer_specialization: result.trainer_specialization,
              },
            },
            { new: true }
          );
        } else {
          updatedUser = await User.findOneAndUpdate(
            { _id: req.params.id },
            {
              $set: {
                username: result.username,
                firstname: result.firstname,
                lastname: result.lastname,
                dateofbirth: result.dateofbirth,
                gender: result.gender,
                height: result.height,
                weight: result.weight,
                role: result.role,
                status: 'ACTIVE',
                password: hash,
                email: result.email,
              },
            },
            { new: true }
          );
        }
  
        res.status(200).json({
          updated_User: updatedUser,
        });
      }
    });
  });
  

//DELETE REQUEST

router.delete('/:id', verifyAccessToken, async (req, res, next) => {

    User.findOneAndUpdate({ _id: req.params.id }, {
        $set: {
            status: "INACTIVE"
        }
    })
    .then(result => {
        res.status(200).json({
            updated_user: result,
            message: "User has been removed"
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
})

// POST REQUEST SIGNUP
router.post('/signup', async (req, res, next) => {
  try {
    const result = await authorizationSchema.validateAsync(req.body);
    const doesExist = await User.findOne({ email: result.email });
    if (doesExist) throw createError.Conflict(`${result.email} has already been registered`);


    console.log('Creating user...');
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      username: result.username,
      firstname: result.firstname,
      lastname: result.lastname,
      gender: result.gender,
      role: result.role,
      status: "ACTIVE",
      password: result.password,
      email: result.email
    });

    const savedUser = await user.save();
    console.log('User created:', savedUser);

    if (result.role === 'Customer') {
      console.log('Creating customer...');
      const customer = new Customer({
        user: savedUser._id,
        weight: result.weight,
        height: result.height,
        dateofbirth: result.dateofbirth
      });

      const savedCustomer = await customer.save();
      console.log('Customer created:', savedCustomer);

      console.log('Creating personal library...');
      const personal_library = new PersonalLibrary({
        _id: new mongoose.Types.ObjectId(),
        personal_library_id: savedCustomer._id, // Use the customer's ID as the personal_library_id
        username: savedUser.username,
        workouts_purchased: []
      });

      const savedLibrary = await personal_library.save();
      console.log('Personal library created:', savedLibrary);

      savedCustomer.personal_library = savedLibrary._id;
      await savedCustomer.save();
      console.log('Customer updated with personal library:', savedCustomer);
    } else if (result.role === 'Trainer') {
      console.log('Creating trainer...');
      const trainer = new Trainer({
        user: savedUser._id,
        trainer_description: result.trainer_description,
        trainer_picture: result.trainer_picture,
        trainer_specialization: result.trainer_specialization
      });

      await trainer.save();
      console.log('Trainer created:', trainer);
    }

    const accessToken = await signAccessToken(savedUser.id);
    const refreshToken = await signRefreshToken(savedUser.id);
    res.send({ accessToken, refreshToken });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
});




  

//POST REQUEST LOGIN

router.post('/login', async (req, res, next) => {
    try {
        const result = await authorizationSchema.validateAsync(req.body)
        const user = await User.findOne({ email:result.email })

        if (!user) throw createError.NotFound('User is not registered')
        if (user.status == "InActive") throw createError.NotFound('User has been deleted')
        
        const isMatch = await user.isValidPassword(result.password)
        if (!isMatch) throw createError.Unauthorized('Username/password not valid')

        const accessToken = await signAccessToken(user.id)
        const refreshToken = await signRefreshToken(user.id)
        res.send({ accessToken, refreshToken })

    } catch (error) {
        if (error.isJoi === true)
            return next(createError.BadRequest("Invalid Username/Password"))
        next(error)
    }
})


router.get('/', verifyAccessToken, async (req, res, next) => {
    //req.payload.aud gives us the id of the logged in user 
    User.findById(req.payload.aud)
        .then(result => {
            //Getting all the users
            User.find({ user_id: result.user_id })
                .exec()
                .then(result => {
                    res.status(200).json({
                        Users: result
                    })
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    })
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
        //res.send({ accessToken: accessToken, refreshToken: refToken })

    } catch (error) {
        next(error)

    }
})


module.exports = router;