const Page = require("../../../models/pageModel");

const getPageById = async (req, res, next) => {
    try {
        const id = req.params.id;

        // Find the page by id and populate content_id
        let page = await Page.findById(id)
            .lean()
            .populate('content_id', 'title content meta_title meta_description language_id')
            .select('slug cover_image status is_deleted created_at');

        // Check if page exists
        if (!page) {
            return res.status(404).json({ status: false, message: 'Page not found' });
        }

        // Extract content_id fields into the page object directly
        if (page.content_id) {
            page = {
                ...page,
                ...page.content_id,
                content_id: undefined, // Optional: Remove the nested content_id field if desired
            };
        }

        // Send the modified page object as the response
        res.status(200).json({
            status: true,
            message: 'Page data',
            data: page,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = getPageById;
