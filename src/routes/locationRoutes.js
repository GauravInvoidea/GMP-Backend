const locationRoute = require('express').Router();
const getCity = require('../controllers/location/getCity');
const getCountry = require('../controllers/location/getCountry');
const getState = require('../controllers/location/getState');
const createLocality = require('../controllers/location/locality/createLocality');
const deleteLocality = require('../controllers/location/locality/deleteLocality');
const getAllLocalities = require('../controllers/location/locality/getAllLocalities');
const getLocality = require('../controllers/location/locality/getLocality');
const updateLocality = require('../controllers/location/locality/updateLocality');

locationRoute.route('/country').get(getCountry)
locationRoute.route('/state').get(getState)
locationRoute.route('/city').get(getCity)

// locality
locationRoute.route('/locality').post(createLocality).get(getAllLocalities).patch(updateLocality)
locationRoute.route('/locality/:id').get(getLocality).delete(deleteLocality)

module.exports = locationRoute;