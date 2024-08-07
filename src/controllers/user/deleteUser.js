const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../errorHandler/apiErrorHandler");
const NormalUser = require("../../models/normalUserModel");

const deleteUser = async (req, res, next) => {
	// console.log('deleteUser', req.params);

	try {
		let { id } = req.params;

		let user = await NormalUser.findById(id);
		if (!isValidObjectId(id)) throw new ApiError('invalid id format', 400);
		if (!user) throw new ApiError('user does not exist', 404);
		if(user.user_type !== 'customer') throw new ApiError('not allowed', 404);

		user.is_deleted = true;
		await user.save();

		res.status(200).json({ status: true, message: 'users deleted' });
	} catch (error) {
		next(error);
	}
}

module.exports = deleteUser;