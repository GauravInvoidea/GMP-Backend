const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../errorHandler/apiErrorHandler");
const User = require("../../models/userModel");

const getUser = async (req, res, next) => {
	// console.log('getUser', req.params);

	try {
		let { id } = req.params;
		if (!isValidObjectId(id)) throw new ApiError('invalid id format', 400);
		let user = await User.findById(id)
			.lean()
			.select('_id name email profile_image phone_number')

		if (!user) throw new ApiError('user does not exist', 404);
		if (user.is_deleted) throw new ApiError('user does not exist', 404);

		res.status(200).json({ status: true, message: 'users details', data: { user } });
	} catch (error) {
		next(error);
	}
}

module.exports = getUser;