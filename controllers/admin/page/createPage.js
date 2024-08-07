const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const PageContent = require("../../../models/pageContentModel");
const Page = require("../../../models/pageModel");
const imageUpload = require("../../../utils/imageUplaod");

const createPage = async (req, res, next) => {
	// console.log('createPage', req.body);
	imageUpload(req, res, async (error) => {
		try {
			if (error) throw new ApiError(error.message, 400);

			let { title, slug, content, meta_title, meta_description, language_id, } = req.body;

			if (!title) throw new ApiError('title is required', 400);
			if (!content) throw new ApiError('content is required', 400);
			if (!slug) throw new ApiError('slug is required', 400);

			let existingPage = await Page.findOne({ slug });
			if (existingPage) throw new ApiError('slug already exist', 400);

			let cover_image;
			if (Object.keys(req.files).length !== 0) {
				cover_image = "image/" + req.files.cover_image[0].filename;
			}

			const pageContent = await PageContent.create({ title, content, meta_title, meta_description, language_id });
			await Page.create({ slug, content_id: pageContent._id, cover_image });
			res.status(201).json({ status: true, message: 'page created' });
		} catch (error) {
			next(error)
		}
	})
}

module.exports = createPage;