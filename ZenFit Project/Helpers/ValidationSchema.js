const Joi = require('@hapi/joi')

const authorizationSchema =Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(2).required(),
    username:Joi.string(),
    firstname:Joi.string(),
    lastname:Joi.string(),
    role:Joi.string(),
    gender:Joi.string(),
    height:Joi.string(),
    weight:Joi.string(),
    dateofbirth:Joi.string()
    
})

module.exports = {
    authorizationSchema
}