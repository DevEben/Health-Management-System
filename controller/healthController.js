const {patientModel, loginDetailModel} = require('../model/healthModel');
const {validator, validator2, validateReg, validateReg2} = require('../middleware/validator');
const jwt = require('jsonwebtoken')
require('dotenv').config();
const bcrypt = require('bcrypt');


// Add a patient's record to the database
const addPatientRecord = async (req, res) => {
    try{
      const {error} = validator(req.body);
      if (error) {
        res.status(500).json({
          message: error.details[0].message
        })
      } else {
        const { role, patientName, gender, nin, dob, visitDate, doctorName, diagnosis, medication } = req.body;
        const email = req.user.email;
        const userId = req.user.userId;
      const checkPatientNIN = await patientModel.findOne({ nin: req.body.nin })
            if (checkPatientNIN) {
            return res.status(400).json({
              message: "NIN already exists", 
              })
          }
        const patient = await new patientModel({role, patientName, gender, nin, dob, visitDate, doctorName, diagnosis, medication, email: email, userId: userId});
    
        if ((req.body.role).toLowerCase() !== "admin") {
            res.status(401).json({
            message: "Permission denied. Admin access required.",
        });
        return;
      }

      if (!patient){
            res.status(400).json({
            message: "Can not add a new patient record",
        });
        return;
      }
      else {
            await patient.save();
            res.status(201).json({
            message: "Successfully added a patient record",
            data: patient
      });
      }  

      }
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}


// View all patient records
const viewAllPatients = async (req, res) => {
    try {
        const patient = await patientModel.find();
        if (patient.length == 0) {
          res.status(404).json({
            message: "Patients database is empty",
          });
          return;
        } else {
          res.status(201).json({
            message: "List of all patients in this database",
            No_of_patients: patient.length,
            data: patient,
          });
        }
      } catch (error) {
        res.status(500).json({
          message: error.message,
        });
      }
}


// View a patient record
const viewApatient = async (req, res) => {
    try {
        const nin = req.params.nin;
        if (nin.length !== 11) {
          res.status(400).json({
          message: "The NIN is not valid.",
        });
        return;
        }
        const patient = await patientModel.findOne({nin});
        if (!patient) {
          res.status(404).json({
            message: "Patient data not found",
          });
          return;
        } else{
          res.status(201).json({
            message: `Patient with NIN: ${nin} found`,
            data: patient,
          });
        }
      } catch (error) {
        res.status(500).json({
          message: error.message,
        });
      }
}


// update a patient's data in the database
const updatePatient = async (req, res) => {
    try{
      const {error} = validator2(req.body);
      if (error) {
        res.status(500).json({
          message: error.details[0].message
        })
      } else {
        const nin = req.params.nin;
        if (nin.length !== 11) {
          res.status(400).json({
          message: "The NIN is not valid.",
        });
        return;
        }
        const patient = await patientModel.findOne({nin});
        const patientData = {
            role: (req.body.role || patient.role).toLowerCase(),
            patientName: (req.body.patientName || patient.patientName).toLowerCase(),
            gender: (req.body.gender || patient.gender).toLowerCase(),
            nin: req.body.nin || patient.nin,
            dob: req.body.dob || patient.dob,
            visitDate: req.body.visitDate || patient.visitDate,
            doctorName: (req.body.doctorName || patient.doctorName).toLowerCase(),
            diagnosis: (req.body.diagnosis || patient.diagnosis).toLowerCase(),
            medication: (req.body.medication || patient.medication).toLowerCase(),
        };
        const updatePatient = await patientModel.findOneAndUpdate(patient, patientData, {new: true})
        if ((req.body.role).toLowerCase() !== "admin"){
            res.status(404).json({
                message: "Permission denied. Admin access required."
            });
            return;
        } 
        else if (!updatePatient){
            res.status(404).json({
                message: "Error updating patient data."
            });
            return;
        } else {
            res.status(200).json({
                message: `Patient with the NIN: ${nin} has been updated successfully.`,
                data: updatePatient,
            });
            return;
        }
      }  
    } catch(err){
        res.status(500).json({
             message: err.message});
    }
}


// delete a patient's data from the database
const deletePatient = async (req, res) => {
    try{
      const nin = req.params.nin;
      if (nin.length !== 11) {
        res.status(400).json({
        message: "The NIN is not valid.",
      });
      return;
      }
      const role = (req.body.role || "").toLowerCase();
      if (!role) {
        res.status(400).json({
          message: "Role is required for deleting a patient record.",
        });
        return;
      }

      const patient = await patientModel.findOne({nin});
        if (!patient) {
            res.status(400).json({
              message: "Patient data not found",
            })
            return;
        }
        if (role !== "admin"){
            res.status(403).json({
                message: "Permission denied. Admin access required."
            });
            return;
        }
        await patientModel.findOneAndDelete(patient)
        return res.status(200).json({
            message: `Patient with the NIN: ${nin} was successfully deleted.`,
            data: patient,
        });
    }catch (err) {
        res.status(500).json({
            message: err.message});
    }
}


// user registration
const register = async (req, res) => {
  try {
    const {error} = validateReg(req.body);
    if (error) {
      res.status(500).json({
        message: error.details[0].message
      })
    } else { 
      const {username, email, nin, password, role} = req.body;
      const checkPatientNIN = await loginDetailModel.findOne({ nin })
              if (checkPatientNIN) {
              res.status(400).json({
                message: "NIN already exists",
                })
                return;
            }
  
            if (nin.toString().length !== 11) {
              res.status(400).json({
              message: "The NIN is not valid.",
          });
          return;
          }
  
      const hashPassword = await bcrypt.hash(password, 10);
  
      const newUser = await loginDetailModel({username, email, nin, password: hashPassword, role})
      if (!newUser) {
        res.status(400).json({
          message: "Registration failed. Please check your input.",
      });
      return;
      }
      else {
        await newUser.save();
        res.status(201).json({
          message: `${username} registered successfully.`,
          data: newUser
        });
        return;
      }
    }
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
}

// user login authentication
const login = async (req, res) => {
    try {
      const {error} = validateReg2(req.body);
    if (error) {
      res.status(500).json({
        message: error.details[0].message
      })
    } else { 
      const {email, password} = req.body;
      const checkUser = await loginDetailModel.findOne({email}) 
      if (!checkUser) {
          res.status(400).json({
            message: "Authentication failed. Invalid email",
          })
          return;
      }
  
      const checkPassword = await bcrypt.compare(password, checkUser.password)
      if (!checkPassword) {
        res.status(400).json({
          message: "Authentication failed. Invalid password",
        })
        return;
    } 
    const userData = await patientModel.findOne({ nin: checkUser.nin }).select('-role');

    if (!userData) {
        return res.status(404).json({
            message: "Patient data not found.",
        });
    }

    const token = jwt.sign({
      userId: checkUser._id,
      email: checkUser.email,
  }, process.env.secret, {expiresIn: "1d"});
  res.status(200).json({
      message: "Login successful",
      token: token,
      //data: userData
  })

    }
    } catch (err) {
        res.status(500).json({
          message: err.message
        });
    }
}


module.exports = {
    addPatientRecord,
    viewAllPatients,
    viewApatient,
    updatePatient,
    deletePatient,
    register,
    login
};