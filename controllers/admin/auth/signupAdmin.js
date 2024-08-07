const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const User = require("../../../models/userModel");

const signupUser = async (req, res, next) => {
	// console.log('signupUser', req.body);

	try {
		let { name, email, password, user_type } = req.body;
		if (!email) throw new ApiError('email is required', 400);
		// if (phone_number && isNaN(phone_number)) throw new ApiError('phone number is not a number', 400);
		const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
		if (!emailRegex.test(email)) throw new ApiError('email is invalid', 400);
		if (!password) throw new ApiError('password is required', 400);

		let oldRecord = await User.findOne({ user_type: 'admin', email });
		if (oldRecord) throw new ApiError('admin already exist', 400);

		const newRecord = await User.create({ name, email, password, user_type: 'admin' });
		res.status(201).json({ status: true, message: 'admin signup successful' });

	} catch (error) {
		next(error);
	}
}

module.exports = signupUser;