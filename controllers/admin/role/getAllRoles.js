const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const Role = require('../../../models/roleModel');




const getAllRoles = async (req, res, next) => {
	
	try {
		const result = await Role.find();
		return res.status(200).json(result);
	  } catch (err) {
		console.log(err);
		res.status(500).json({
		  message: "Some server error occurred",
		});
	  }
}
	
module.exports = getAllRoles;