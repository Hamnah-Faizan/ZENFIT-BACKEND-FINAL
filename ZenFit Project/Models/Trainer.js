const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const TrainerSchema = new Schema({

    _id: mongoose.Schema.Types.ObjectId,
    trainer_id:{
        type: String,
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
    status:{
        type: String,
        enum: ["ACTIVE", "INACTIVE"],
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
    trainer_specialization:{
        type: String,
        required: true,
    },
    trainer_picture: {
        type: String
    },
    trainer_description:{
        type: String,
        required:true
    },
    workout_plans: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WorkoutLibrary'
    }],
    clients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
     
})

const trainer = mongoose.model('Trainer', TrainerSchema);
module.exports = trainer;