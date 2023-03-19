const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose');
require('dotenv').config();
const bodyParser = require('body-parser'); 
const createError = require('http-errors')
const { verifyAccessToken } = require('./Helpers/JwtHelper')
const bcrypt = require('bcrypt')
const User = require("./Routes/UserRoute");
const Trainer = require("./Routes/TrainerRoute");
const Exercise = require("./Routes/ExerciseRoute");
const WorkoutLibrary = require("./Routes/WorkoutRoute");
const PersonalLibrary = require("./Routes/PersonalLibraryRoute");

const app = express()

mongoose.set("strictQuery", false);

mongoose.connect('mongodb+srv://User:hamnah123@cluster0.qel1iqf.mongodb.net/test')

mongoose.connection.on('error',err => {
    console.log('Connection failed'); 
});

mongoose.connection.on('connected',connected=>{
    console.log('Connected with database sucessfully'); 
})

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json()); 


app.use('/UserRoute', User);
app.use('/TrainerRoute', Trainer);
app.use('/ExerciseRoute', Exercise);
app.use('/WorkoutLibraryRoute', WorkoutLibrary);
app.use('/PersonalLibraryRoute', PersonalLibrary);


app.get('/', verifyAccessToken, async (req, res, next) => {
    res.send("Hello from express.")
})


app.use((err,req,res,next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            status: err.status || 500,
            message: err.message,
        },
    })
})


const PORT = 3000


app.listen(PORT, () => {
    console.log('Server running on port 3000')
})

module.exports = app;