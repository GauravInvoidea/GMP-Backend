const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const User = require("../../../models/userModel");
let bcrypt = require('bcrypt');
const signJWT = require("../../../utils/signJWT");

const loginAdmin = async (req, res, next) => {
	// console.log('loginAdmin', req.body);

	try {
		const { email, password } = req.body;
		if (!email) throw new ApiError("Email is required!", 400);
		if (!password) throw new ApiError("Password is required!", 400);

		const admin = await User.findOne({ user_type: 'admin', email })
			.lean()
			.select('name email profile_image phone_number user_type status password')

		if (!admin) throw new ApiError("User does not exist!", 404);
		const passMatched = await bcrypt.compare(password, admin.password);
		if (!passMatched) throw new ApiError("Invalid credentails!", 404);
		admin.password = undefined;

		const token = signJWT(admin._id);
		res.status(200).json({ status: true, message: "Login successful.", data: { user: admin, token } });
	} catch (error) {
		next(error);
	}
}

module.exports = loginAdmin;