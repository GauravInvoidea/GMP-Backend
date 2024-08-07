const Permission = require("../../../models/permissionModel");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");

const createPermission = async (req, res, next) => {
	// console.log('createPermission', req.body);
	
	try {
		let { name } = req.body;
		if (!name) throw new ApiError('name is required', 400);

		let oldRecord = await Permission.findOne({ name });
		if (oldRecord) throw new ApiError('already exist', 400);

		await Permission.create({ name });
		res.status(201).json({ status: true, message: 'permission created' });

	} catch (error) {
		next(error);
	}
}

module.exports = createPermission;