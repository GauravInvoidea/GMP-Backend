const mongoose = require('mongoose');

const pageContentSchema = new mongoose.Schema(

	{
		title: { type: String, required: [true, `{PATH} is required`] },
		content: { type: String,  },
		meta_title: { type: String, default: null },
		meta_description: { type: String, default: null },
		language_id: { type: String, default: '1' },

		status: { type: String, default: 'active', enum: ['active', 'inactive'] },
		is_deleted: { type: Boolean, default: false },
	},
	{
		timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
		collection: 'page_content',
	}
)

const PageContent = mongoose.model('PageContent', pageContentSchema);
module.exports = PageContent;