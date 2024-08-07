const jwt = require('jsonwebtoken');

const signJWT = (id, duration) => {
	try {
		if (duration) return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: duration })
		return jwt.sign({ id }, process.env.JWT_SECRET)
	} catch (error) {
		console.log(error);
	}
}

module.exports = signJWT;