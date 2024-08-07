const { ApiError } = require("../../errorHandler/apiErrorHandler");
const deleteImageHandler = require("../../utils/deleteImageHandler");
const imageUpload = require("../../utils/imageUplaod");

const updateProfile = async (req, res, next) => {
	imageUpload(req, res, async (error) => {
		try {
			if (error) throw new ApiError(error.message, 400);

			let { name, email, profile_image, address } = req.body;

			const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
			if (email && emailRegex.test(email)) throw new ApiError('invalid email format', 400);

			let rootUser = req.user;
			let oldImage = rootUser.profile_image;

			if (name) rootUser.name = name;
			if (email) rootUser.email = email;
			if (profile_image) rootUser.profile_image = profile_image;
			if (address) rootUser.address = address;

			if(req.files?.profile_image) rootUser.profile_image = req.files?.profile_image?.[0]?.filename;

			await rootUser.save();
			res.status(200).json({ status: true, message: 'profile updated', data: { user: rootUser } });
			deleteImageHandler(oldImage);

		} catch (error) {
			next(error);
		}
	})
}

module.exports = updateProfile;