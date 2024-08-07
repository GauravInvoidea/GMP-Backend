const Page = require("../../../models/pageModel");

const getAllPages = async (req, res, next) => {
	// console.log('getAllPages', req.query);

	try {
		let { page, limit } = req.query;
		page = page ? parseInt(page) : 1;
		limit = limit ? parseInt(limit) : 10;

		let conditionObj = {};
		let allRecords = await Page.find(conditionObj)
			.lean()
			.skip((page * limit) - limit)
			.limit(limit)
			.sort({ created_at: -1 })
			.populate('content_id', 'title content meta_title meta_description language_id')
			.select('slug cover_image cover_image status is_deleted created_at');
		let totalCount = await Page.countDocuments(conditionObj);

		allRecords.map(rec => {
			let dd = rec;
			dd.title = rec.content_id.title
			return dd
		})

		res.status(200).json({
			status: true,
			message: 'all record listing',
			data: allRecords,
			total_data: totalCount,
			total_pages: Math.ceil(totalCount / limit),
		});

	} catch (error) {
		next(error);
	}
}

module.exports = getAllPages;