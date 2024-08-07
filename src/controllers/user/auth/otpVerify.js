const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const NormalUser = require("../../../models/normalUserModel");
const signJWT = require("../../../utils/signJWT");

const otpVerify = async (req, res, next) => {
	try {
		let { phone_number, otp } = req.body;
		if (!phone_number) throw new ApiError('phone_number is required', 400);
		if (!otp) throw new ApiError('otp is required', 400);

		let user = await NormalUser.findOne({ phone_number })
			.lean()
			.select('name email profile_image phone_number address user_type status otp')

		if (!user) throw new ApiError('user does not exist', 404);
		if (user.otp !== Number(otp)) throw new ApiError('invalid otp', 400);
		if (user.otp_expiry < Date.now()) throw new ApiError('otp expired', 400);
		user.otp = undefined;

		let token = signJWT(user._id)
		res.status(200).json({ status: true, message: 'login successful', data: { user, token } })

	} catch (error) {
		next(error);
	}
}

module.exports = otpVerify;