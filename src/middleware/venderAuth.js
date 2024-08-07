const { ApiError } = require("../errorHandler/apiErrorHandler");
const NormalUser = require("../models/normalUserModel");
const verifyJWT = require("../utils/verifyJWT");

const venderAuth = async (req, res, next) => {
	try {
		const header = req.header('Authorization');
		if (!header) throw new ApiError('header is not present', 400);
		const token = header.split(" ")[1];
		if (!token) throw new ApiError('token is required', 400);

		const user = verifyJWT(token);
		const rootUser = await NormalUser.findById(user.id);
		if (!rootUser) throw new ApiError('user does not exist', 404);
		if (rootUser.is_deleted) throw new ApiError('user doest not exist', 404);
		if (rootUser.user_type !== 'vender') throw new ApiError('user is not vender', 401);

		req.user = rootUser;
		next();
	} catch (error) {
		next(error);
	}
}

module.exports = venderAuth;