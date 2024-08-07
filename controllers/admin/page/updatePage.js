const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const PageContent = require("../../../models/pageContentModel");
const Page = require("../../../models/pageModel");
const imageUpload = require("../../../utils/imageUplaod");
const deleteImageHandler = require("../../../utils/deleteImageHandler");

const updatePage = async (req, res, next) => {
    // console.log("updatePage")
	imageUpload(req, res, async (error) => {
		try {
			let { id, slug, title, content, meta_title, meta_description, language_id, } = req.body;

			if (!id) throw new ApiError('id is requied', 400);
			if (!isValidObjectId(id)) throw new ApiError("Invalid ID format", 400);

			let page = await Page.findById(id)
			if (!page) throw new ApiError('page does not exist', 404);

			let oldImage = page.cover_image;

			if (slug) {
				if (page.slug === slug) throw new ApiError('slug already exist', 400);
				page.slug = slug;
			}
			if (req.files.cover_image) page.cover_image = "image/" + req.files.cover_image[0].filename;

			let pageContent = await PageContent.findById(page.content_id);
			if (title) pageContent.title = title;
			if (content) pageContent.content = content;
			if (meta_title) pageContent.meta_title = meta_title;
			if (meta_description) pageContent.meta_description = meta_description;
			if (language_id) pageContent.language_id = language_id;

			await Promise.all([page.save(), pageContent.save()])
			res.status(200).json({ status: true, message: 'page updated' })
			deleteImageHandler(oldImage)
		} catch (error) {
			next(error);
		}
	})
}

module.exports = updatePage;