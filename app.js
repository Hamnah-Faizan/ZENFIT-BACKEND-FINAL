const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose');
require('dotenv').config();
const bodyParser = require('body-parser'); 
const createError = require('http-errors')
const { verifyAccessToken } = require('./Helpers/JwtHelper')
const bcrypt = require('bcrypt')
const cors = require('cors');
const Trainer = require("./Routes/TrainerRoute");
const User = require("./Routes/UserRoute");
const Customer = require("./Routes/CustomerRoute");
const Exercise = require("./Routes/ExerciseRoute");
const WorkoutLibrary = require("./Routes/WorkoutLibraryRoute");
const PersonalLibrary = require("./Routes/PersonalLibraryRoute");
const FitnessTracking = require("./Routes/FitnessTrackingRoute");

const app = express()

mongoose.set("strictQuery", false);

mongoose.connect('mongodb+srv://eishahaq31:UiAVYcfOObweu8DV@cluster0.tcoc3sg.mongodb.net/?retryWrites=true&w=majority')


mongoose.connection.on('error',err => {
    console.log('Connection failed'); 
});

mongoose.connection.on('connected',connected=>{
    console.log('Connected with database sucessfully'); 
})

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json()); 

app.use(cors({
    origin: true,
    credentials: true
  }));


app.use('/User', User);
app.use('/Trainer', Trainer);
app.use('/Exercise', Exercise);
app.use('/Customer',Customer);
app.use('/WorkoutLibrary', WorkoutLibrary);
app.use('/PersonalLibrary', PersonalLibrary);
app.use('/FitnessTracking', FitnessTracking);

// In your backend server response handler
app.use((req,res) => {
res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
res.setHeader('Access-Control-Allow-Credentials', 'true');
})


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


const PORT = 8000


app.listen(PORT, () => {
    console.log('Server running on port 8000')
})

module.exports = app;