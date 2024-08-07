const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const NormalUser = require("../../../models/normalUserModel");

let userTypeEnum = ['vender', 'customer'];

const loginUser = async (req, res, next) => {

	try {
		let { phone_number, user_type } = req.body;
		if (!phone_number) throw new ApiError('phone_number is required', 400);
		if (isNaN(phone_number)) throw new ApiError('invalid number format', 400);
		if (!user_type) throw new ApiError('user_type is required', 400);
		if (!userTypeEnum.includes(user_type)) throw new ApiError('please provide valid user type', 400);
		if (user_type !== 'customer') throw new ApiError('user does not belong to customer type', 400);

		let user = await NormalUser.findOne({ phone_number });
		if (!user) user = await NormalUser.create({ phone_number, user_type });
		if (user.user_type !== 'customer') throw new ApiError('user does not belong to customer type', 400);

		user.otp = 1234;
		user.otp_expiry = new Date(Date.now() + 10 * 60 * 1000);
		await user.save();

		res.status(200).json({ status: true, message: 'otp sent' });
	} catch (error) {
		next(error);
	}
}

module.exports = loginUser;