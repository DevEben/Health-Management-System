const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['user', 'admin'], default: 'user',
        required: [true, "Role is required"],
    },
    patientName: {
        type: String,
        required: [true, "Patient Name is required"],
    },
    gender: {
        type: String,
        required: [true, "Gender is required"],
    },
    nin: {
        type: Number,
        required: [true, "NIN is required"],
        unique: [true, "NIN already exist"],
    },
    dob: {
        type: Date,
        required: [true, "Date of Birth is required"],
    },
    visitDate: {
        type: Date,
        required: [true, "Visit date is required"],
    }, 
    doctorName: {
        type: String,
        required: [true, "Doctor's name is required"],
    },
    diagnosis: {
        type: String,
        required: [true, "Diagnosis is required"],
    },
    medication: {
        type: String,
        required: [true, "Medication is required"],
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'loginDetailModel', 
        required: true,
    }, 
    email: {
        type: mongoose.Schema.Types.String,
        ref: 'loginDetailModel', 
        required: true,
    }
}, {timestamps: true})

const patientModel = mongoose.model('Patient', patientSchema);


const loginDetailSchema = mongoose.Schema({
    username: {
        type: String,
        required:[true, "Username is required"],
        unique: [true, "Password already exist"],
    },
    email: {
        type: String,
        required:[true, "Email is required"],
        unique: [true, "Email already exist"],
    },
    nin: {
        type: Number,
        required: [true, "NIN is required"],
        unique: [true, "NIN already exist"],
    },
    password: {
        type: String,
        required:[true, "Password is required"],
    },
    role: {
        type: String,
        enum: ['user', 'admin'], default: 'user',
        required:[true, "Role is required"],
    }
}, {timestamps: true})

const loginDetailModel = mongoose.model('loginDetails', loginDetailSchema)


module.exports = { 
    patientModel, 
    loginDetailModel, 

};