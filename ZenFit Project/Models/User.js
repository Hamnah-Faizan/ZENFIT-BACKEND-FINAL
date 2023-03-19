const mongoose = require('mongoose')
const Schema = mongoose.Schema 
const bcrypt = require('bcrypt')

const UserSchema = new Schema({
  
    _id: mongoose.Schema.Types.ObjectId,
    role:{
      type: String,
      enum: ["User","Trainer"],
      default: 'User'
    }, 
    user_id:{
        type: Number,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }, 
    gender: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    height: {
        type: String,
        required: true
    },
    dateofbirth: {
        type: Date,
        required: true
    },
    status:{
        type: String,
        enum: ["ACTIVE", "INACTIVE"],
        required: true
    },
    personal_library: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PersonalLibrary',
        required: true
  }
})

UserSchema.pre('save', async function (next) {
  try {
    if (this.isNew) {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(this.password, salt)
      this.password = hashedPassword
    }
    next()
  } catch (error) {
    next(error)
  }
})


UserSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password)
  } catch (error) {
    throw error
  }
}

const user = mongoose.model('User', UserSchema)
module.exports = user