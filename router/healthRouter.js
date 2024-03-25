const express = require('express');

const router = express.Router();

const {addPatientRecord, 
    viewAllPatients, 
    viewApatient, 
    updatePatient, 
    deletePatient, 
    register, 
    login } = require('../controller/healthController');
const { authenticate } = require('../middleware/authentication');


// endpoint to add a patient record to the database
router.post('/health', authenticate, addPatientRecord);

//endpoint to view all patient records in the database
router.get('/health', authenticate, viewAllPatients);

//endpoint to view a patient record in the database
router.get('/health/:nin', authenticate, viewApatient);

//endpoint to update a patient record in the database
router.put('/health/:nin', authenticate, updatePatient);

//endpoint to delete a patient record in the database
router.delete('/health/:nin', authenticate, deletePatient);

//endpoint to register a new user
router.post('/register', register);

//endpoint to login a new user
router.post('/login', login);

module.exports = router;