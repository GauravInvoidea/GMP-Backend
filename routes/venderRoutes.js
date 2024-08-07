const venderRoute = require('express').Router();
const venderAuth = require('../middleware/venderAuth');

const loginVender = require('../controllers/vender/auth/loginVender');
const otpVerify = require('../controllers/vender/auth/otpVerify');
const googleLogin = require('../controllers/vender/auth/googleLogin');
const getProfileDetails = require('../controllers/vender/getProfileDetails');
const updateProfile = require('../controllers/vender/updateProfile');
// property
const createProperty = require('../controllers/vender/property/createProperty');
const getAllProperties = require('../controllers/vender/property/getAllProperties');
const updateProperty = require('../controllers/vender/property/updateProperty');
const getProperty = require('../controllers/vender/property/getProperty');
const deleteProperty = require('../controllers/vender/property/deleteProperty');
const getVender = require('../controllers/vender/getVender');
const deleteVender = require('../controllers/vender/deleteVender');
const getDashboardData = require('../controllers/vender/dashboard/getDashboardData');



venderRoute.route('/').post(loginVender).patch(venderAuth, updateProfile);
// venderRoute.route('/:id').get(getVender).delete(deleteVender)

venderRoute.post('/otp_verify', otpVerify)
venderRoute.post('/google/login', googleLogin)

venderRoute.get('/profile_details', venderAuth, getProfileDetails)

venderRoute.get('/dashboard', venderAuth, getDashboardData)

venderRoute.route('/property').post(venderAuth, createProperty).get(venderAuth, getAllProperties).patch(venderAuth, updateProperty)
venderRoute.route('/property/:id').get(venderAuth, getProperty).delete(venderAuth, deleteProperty)


module.exports = venderRoute;