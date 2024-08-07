const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const Role = require("../../../models/roleModel");

const createRole = async (req, res, next) => {
	// console.log('createRole', req.body);

	try {
		let { name } = req.body;
		if (!name) throw new ApiError('name is required', 400);

		let oldRole = await Role.findOne({ name });
		if (oldRole) throw new ApiError('role already exist', 400);

		await Role.create({ name });
		res.status(201).json({ status: true, message: 'role created' });

	} catch (error) {
		next(error);
	}
}

module.exports = createRole;