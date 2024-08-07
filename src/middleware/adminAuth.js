const { ApiError } = require("../errorHandler/apiErrorHandler");
const User = require("../models/userModel");
const verifyJWT = require("../utils/verifyJWT");

const adminAuth = async (req, res, next) => {
	try {
		const header = req.header('Authorization')
		if (!header) throw new ApiError('header is not present', 400);
		const token = header.split(" ")[1];
		if (!token) throw new ApiError('token is required', 400);

		const user = verifyJWT(token);
		const rootUser = await User.findById(user.id);
		if (!rootUser) throw new ApiError('user does not exist', 404);
		if (rootUser.user_type !== 'admin') throw new ApiError('user is not admin', 401);

		req.user = rootUser;
		next()
	} catch (error) {
		next(error)
	}
}

module.exports = adminAuth;