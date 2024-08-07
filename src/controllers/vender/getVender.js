const { ApiError } = require("../../errorHandler/apiErrorHandler");
const NormalUser = require("../../models/normalUserModel");

const getVender = async (req, res, next) => {
	try {
		let { id } = req.params;

		const vender = await NormalUser.findById(id)
			.lean()
			.select('name email profile_image phone_number address user_type status')

		if (!vender) throw new ApiError('vender does not exist', 404);
		res.status(200).json({ status: true, message: 'vender detail', data: vender });
		
	} catch (error) {
		next(error);
	}
}

module.exports = getVender;