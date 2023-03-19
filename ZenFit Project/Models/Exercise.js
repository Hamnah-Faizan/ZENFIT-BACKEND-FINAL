const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const ExerciseSchema = new Schema({
    
    _id: mongoose.Schema.Types.ObjectId,
    exercise_id:{
        type: String,
        required: true,
        unique: true
    },   
    exercise_name:{
        type: String,
        required: true,
        unique: true
    },
    exercise_image:{
        type: String,
        required: true
    },
    exercise_description:{
        type: String,
        required: true
    },
    exercise_duration:{
        type: Number,
        required: true
    },
    exercise_completion:{
        isCompleted: Boolean,
        required: true
    }

})    

const exercise = mongoose.model('Exercise', ExerciseSchema);
module.exports = exercise