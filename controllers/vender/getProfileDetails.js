const getProfileDetails = async (req, res, next) => {
	try {
		user = req.user;
		// await user.select('name email profile_image phone_number address user_type')

		const userData = {
			_id: user._id,
			name: user.name,
			email: user.email,
			profile_image: user.profile_image,
			phone_number: user.phone_number,
			address: user.address,
			user_type: user.user_type,
		}

		res.status(200).json({ status: true, message: 'profile details', data: userData })
	} catch (error) {
		next(error);
	}
}

module.exports = getProfileDetails;