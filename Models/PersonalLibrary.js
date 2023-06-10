const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const PersonalLibrarySchema = new Schema({
 
    _id: mongoose.Schema.Types.ObjectId,
    username:{
        type: String,
        required: true,
        unique: true
    },
    workouts_purchased:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workouts'
    }],    

})

const personal_library = mongoose.model('PersonalLibrary', PersonalLibrarySchema);
module.exports = personal_library