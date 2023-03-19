const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const WorkoutLibrarySchema = new Schema({
    
    _id: mongoose.Schema.Types.ObjectId,
    workout_library_id:{
        type: String,
        required: true,
        unique: true
    },
    workout_name:{
        type: String,
        required: true,
        unique: true
    },
    workout_image:{
        type: String,
        required: true
    },
    workout_description:{
        type: String,
        required: true
    },   
    difficulty_level:{
        type: String,
        required: true
    },
    workout_price: {
        type: Number,
        required: true
    }, 
    excercise_sets:{
        type: Number,
        required: true
    },
    goal_:{
        type: String,
        required: true
    },
    goals_completed:{
        type: String
    },
    notes:{
        type: String
    },
    calories_burned:{
        type: Number
    },    
    percentage:{
        type: Number
    },
    payment:{
        isSuccessful: Boolean,
        required: true
    },
    workouts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise'
      }]
    
})

const workout_library = mongoose.model('WorkoutLibrary', WorkoutLibrarySchema);
module.exports = workout_library