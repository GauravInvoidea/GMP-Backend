const userRoute = require('express').Router();
const userAuth = require('../middleware/userAuth');

// auth controllers
const loginUser = require('../controllers/user/auth/loginUser');
const otpVerify = require('../controllers/user/auth/otpVerify');

const getProfileDetails = require('../controllers/user/getProfileDetails');
const deleteUser = require('../controllers/user/deleteUser');
const updateProfile = require('../controllers/user/updateProfile');
const getUser = require('../controllers/user/getUser');
const getAllProperties = require('../controllers/user/property/getAllProperties');
const getProperty = require('../controllers/user/property/getProperty');




// auth routes
userRoute.route('/').post(loginUser).patch(userAuth, updateProfile)
userRoute.post('/otp_verify', otpVerify)

userRoute.get('/profile_details', userAuth, getProfileDetails);
// userRoute.route('/:id').get(getUser).delete(deleteUser);

// property
userRoute.route('/property').post(getAllProperties)
userRoute.route('/property/:id').get(getProperty)

module.exports = userRoute;