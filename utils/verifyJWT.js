const jwt = require('jsonwebtoken');
const { ApiError } = require('../errorHandler/apiErrorHandler');

const verifyJWT = (token) => {
	try {
		return jwt.verify(token, process.env.JWT_SECRET)
	} catch (error) {
		throw new ApiError('invalid token', 401)
	}
}

module.exports = verifyJWT;