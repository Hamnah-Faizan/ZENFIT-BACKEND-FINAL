const Joi = require('@hapi/joi')

 
const authorizationSchema =Joi.object({
 
    email: Joi.string().email().lowercase(),
    password: Joi.string().min(2),
    username:Joi.string(),
    firstname:Joi.string(),
    lastname:Joi.string(),
    role:Joi.string(),
    gender:Joi.string(),
    height:Joi.string(),
  
    dateofbirth: Joi.date().iso(),
    weight: Joi.number(),
    trainer_description: Joi.string(),
    trainer_picture: Joi.string(),
    trainer_specialization: Joi.string(),
    
    workout_name: Joi.string(),
    difficulty_level: Joi.string().valid('Beginner', 'Intermediate', 'Advanced'),
    workout_description: Joi.string(),
    goal: Joi.string(),
    calories_burned: Joi.number(),
    duration: Joi.number(),
    workout_price: Joi.number(),
    payment_successful: Joi.boolean(),
    workout_thumbnail: Joi.string(),
    exercise_name: Joi.string(),
    exercise_description: Joi.string(),
    exercise_duration: Joi.number(),
    exercise_completed: Joi.boolean(),
    exercise_video: Joi.string(),
    calories_eaten: Joi.number().integer().min(0),
    daily_calories: Joi.number().integer().min(0),
    weight: Joi.number(),
    bmi: Joi.number()
    
  
    
    
})

module.exports = {
    authorizationSchema,
}

