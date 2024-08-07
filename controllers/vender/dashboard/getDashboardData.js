const Property = require("../../../models/propertyModel");

const getDashboardData = async (req, res, next) => {
	try {
		let vender = req.user;

		let conditionObj = { is_deleted: false, user_id: vender._id };

		let pipeline = [
			{ $match: conditionObj },
			{
				$facet: {
					total_property: [
						{ $match: conditionObj }
					],
					total_approved: [
						{ $match: { $or: [{ status: "verified" }, { status: "active" }] } }
					],
					total_pending: [
						{ $match: { status: 'unverified' } }
					],
					total_rejected: [
						{ $match: { status: 'rejected' } }
					],
					total_disabled: [
						{ $match: { status: 'inactive' } }
					],
					total_featured: [
						{ $match: { is_featured: true } }
					],
				},
			},
		];

		let data = await Property.aggregate(pipeline)
		let { total_property, total_approved, total_pending, total_rejected, total_disabled, total_featured } = data[0]

		let resData = {
			total_property: total_property.length,
			total_approved: total_approved.length,
			total_pending: total_pending.length,
			total_rejected: total_rejected.length,
			total_disabled: total_disabled.length,
			total_featured: total_featured.length,
		}

		res.status(200).json({
			status: true,
			message: 'vender dashboard details',
			data: resData,
		});
	} catch (error) {
		next(error);
	}
}

module.exports = getDashboardData;