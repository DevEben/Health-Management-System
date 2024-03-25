const jwt = require('jsonwebtoken');
const {loginDetailModel} = require('../model/healthModel')
require('dotenv').config();


const authenticate = async (req, res, next) => {
    try {
        //Extract the user token from the request headers
        const hasAuthorization = req.headers.authorization;

        //check if the user has a token
        if (!hasAuthorization) {
            return res.status(400).json({
                message: 'Student not Authorized'
            })
        }

        // Separate the token from the bearer
        const token = hasAuthorization.split(' ')[1];
        if (!token) {
            return res.status(400).json({
                message: 'No token provided'
            })
        }
        //Decode the token
        const decodeToken = jwt.verify(token, process.env.secret);
        const student = await loginDetailModel.findById(decodeToken.userId);
        if (!student) {
            return res.status(404).json({
                message: 'Authentication failed: Student not found'
            })
        }
        req.user = decodeToken;

        next()

    } catch (err) {
        res.status(500).json({
            error: err.message
        })
    }

}

module.exports = {authenticate, }