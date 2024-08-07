const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../errorHandler/apiErrorHandler");
const City = require("../../models/cityModel");
const NormalUser = require("../../models/normalUserModel");
const State = require("../../models/stateModel");
const imageUpload = require("../../utils/imageUplaod");

let statusEnum = ['vender', 'customer'];

const updateProfile = async (req, res, next) => {


	imageUpload(req, res, async (error) => {
		try {
			if (error) throw new ApiError(error.message, 400);

			let { name, phone_number, email, user_type, address, state_id, city_id, pincode, username, website_url } = req.body;

			const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
			if (email && emailRegex.test(email)) throw new ApiError('invalid email format', 400);

			let rootUser = req.user;

			if (name) rootUser.name = name;
			if (phone_number) rootUser.phone_number = phone_number;
			if (email) rootUser.email = email;
			if (address) rootUser.address = address;
			if (website_url) {
				let regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/
				if (!regex.test(website_url)) throw new ApiError('invalid url format', 400);
				rootUser.website_url = website_url;
			}

			// if (user_type) {
			// 	if (!statusEnum.includes(user_type)) throw new ApiError('please provide valid user_type', 400);
			// 	rootUser.user_type = user_type;
			// }

			if (username) {
				let user = await NormalUser.findOne({ _id: { $ne: rootUser._id }, username }).lean();
				if (user) throw new ApiError('username already in use', 400);
				rootUser.username = username;
			}

			if (state_id) {
				if (!isValidObjectId(state_id)) throw new ApiError('invalid state_id format', 400);
				let state = await State.findById(state_id).lean();
				if (!state) throw new ApiError('state does not exist', 404);
				rootUser.state_id = state_id;
			}

			if (city_id) {
				if (!isValidObjectId(city_id)) throw new ApiError('invalid city_id format', 400);
				let city = await City.findById(city_id).lean()
				if (!city) throw new ApiError('city does not exist', 404);
				if (city.state_id.toString() !== rootUser.state_id.toString()) throw new ApiError('city does not belong to user state', 400);
				rootUser.city_id = city_id;
			}

			if (pincode) {
				if (isNaN(pincode)) throw new ApiError('invalid pincode format', 400);
				if (pincode.length > 6) throw new ApiError('incorrect pincode format', 400);
				rootUser.pincode = pincode;
			}


			if (req.files?.profile_image) rootUser.profile_image = req.files?.profile_image?.[0]?.filename;

			await rootUser.save();
			
			rootUser.otp = undefined;
			rootUser.otp_expiry = undefined;
			rootUser.is_deleted = undefined;
			rootUser.updated_at = undefined;
			rootUser.__v = undefined;
			res.status(200).json({ status: true, message: 'profile updated', data: { user: rootUser } });

		} catch (error) {
			next(error);
		}
	})
}

module.exports = updateProfile;