const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const Page = require("../../../models/pageModel");
const PageContent = require("../../../models/pageContentModel");

const deletePage = async (req, res, next) => {
	// console.log('deletePage', req.params);

	try {
		const id = req.params.id;
		if (!isValidObjectId(id)) throw new ApiError("Invalid ID format", 400);

		let page = await Page.findByIdAndDelete(id);
		if (!page) throw new ApiError('page does not exist', 404);
		await PageContent.findByIdAndDelete(page.content_id);

		res.status(200).json({ status: true, message: 'page deleted' });
	} catch (error) {
		next(error);
	}
}

module.exports = deletePage;