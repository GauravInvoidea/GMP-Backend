const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const NormalUser = require("../../../models/normalUserModel");
const signJWT = require("../../../utils/signJWT");

const googleLogin = async (req, res, next) => {
	// console.log("googleLogin --------------", req.body);

	try {
		const { name, email, profile_image, user_type } = req.body;

		if (!name) throw new ApiError("Name is required!", 400);
		if (!email) throw new ApiError("Email is required!", 400);
		if (!/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(email)) throw new ApiError("Invalid email format!", 400);
		if (!user_type) throw new ApiError('user_type is required', 400);
		if (!userTypeEnum.includes(user_type)) throw new ApiError('please provide valid user type', 400);

		const user = await NormalUser.findOne({ email });
		if (!user) user = await NormalUser.create({ name, email, profile_image, user_type });

		const token = signJWT(user._id);
		return res.status(201).json({ status: true, message: "login successful", data: { user, token } });

	} catch (error) {
		next(error);
	}
}

module.exports = googleLogin;