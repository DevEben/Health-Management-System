const joi = require('@hapi/joi'); 

const validator = (data) => {
    const validateHealth = joi.object({
        nin: joi.number().min(10000000000).required().messages({
            'number.min': 'NIN number must be a number and 11 digits',
        }),
        role: joi.string().valid('user', 'admin').required(),
        patientName: joi.string().min(3).max(40).pattern(/^[A-Za-z\s]*$/).required().messages({
            'string.empty': 'Patient name cannot be empty',
            'string.min': 'Min 3 characters',
          }),
        gender: joi.string().min(4).max(6).valid("male", "female").required(),
        dob: joi.date().iso().required().max('now').messages({
            'date.base': 'Invalid date format. Please use the format YYYY-MM-DD.',
            'date.max': 'Date cannot be in the future.',
        }),
        visitDate: joi.date().iso().required().messages({
            'date.base': 'Invalid date format. Please use the format YYYY-MM-DD.',
        }),
        doctorName: joi.string().min(3).max(40).required().messages({
            'string.empty': 'Doctor name cannot be empty',
            'string.min': 'Min 3 characters',
          }),
        diagnosis: joi.string().min(3).max(120).required().messages({
            'string.empty': 'Diagnosis cannot be empty',
            'string.min': 'Min 3 characters',
          }),
        medication: joi.string().min(3).max(120).required().messages({
            'string.empty': 'Medication cannot be empty',
            'string.min': 'Min 3 characters',
          })
    })
    return validateHealth.validate(data);
}


const validator2 = (data) => {
    const validateHealth2 = joi.object({
        nin: joi.number().min(11),
        role: joi.string().valid('user', 'admin'),
        patientName: joi.string().min(3).max(40).pattern(/^[a-zA-Z]+$/).messages({
            'string.empty': 'Patient name cannot be empty',
            'string.min': 'Min 3 characters',
          }),
        gender: joi.string().min(4).max(6).valid("male", "female"),
        dob: joi.date().iso().format('YYYY-MM-DD').max('now').messages({
            'date.base': 'Invalid date format. Please use a valid date.',
            'date.format': 'Invalid date format. Please use the format YYYY-MM-DD.',
            'date.max': 'Date cannot be in the future.',
        }),
        visitDate: joi.date().iso().format('YYYY-MM-DD').messages({
            'date.format': 'Invalid date format. Please use the format YYYY-MM-DD.',
        }),
        doctorName: joi.string().min(3).max(40).messages({
            'string.empty': 'Doctor name cannot be empty',
            'string.min': 'Min 3 characters',
          }),
        diagnosis: joi.string().min(3).max(90).messages({
            'string.empty': 'Diagnosis cannot be empty',
            'string.min': 'Min 3 characters',
          }),
        medication: joi.string().min(3).max(90).messages({
            'string.empty': 'Medication cannot be empty',
            'string.min': 'Min 3 characters',
          })
    })
    return validateHealth2.validate(data);
}



const validateReg = (data) => {
    const validateReg = joi.object({
        username: joi.string().min(3).max(40).trim().required().messages({
            'string.empty': 'Username cannot be empty',
            'string.min': 'Min 3 characters',
          }),
        email: joi.string().email({ tlds: { allow: false } }).trim().required(),
        nin: joi.number().min(11).required(),
        password: joi.string().min(8).trim().required().messages({
            'string.empty': 'Password cannot be empty',
            'string.min': 'Password should be atleast 8 characters',
          }),
        role: joi.string().valid('user', 'admin').trim().required()
    })
    return validateReg.validate(data);
}


const validateReg2 = (data) => {
    const validateReg2 = joi.object({
        email: joi.string().email({ tlds: { allow: false } }).trim().required(),
        password: joi.string().min(8).trim().required().messages({
            'string.empty': 'Password cannot be empty',
            'string.min': 'Password should be atleast 8 characters',
          }),
    })
    return validateReg2.validate(data);
}


module.exports = {
    validator, 
    validator2, 
    validateReg, 
    validateReg2
};
