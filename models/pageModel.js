const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema(
	{
		slug: { type: String, required: [true, `{PATH} is required`], unique: [true, 'slug should be unique'] },
		cover_image: { type: String, default: null },
		content_id: { type: mongoose.Types.ObjectId, ref: 'PageContent' },
		status: { type: String, default: 'active', enum: ['active', 'inactive'] },
		is_deleted: { type: Boolean, default: false },
	},
	{
		timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
		collection: 'page',
	}
)

const Page = mongoose.model('Page', pageSchema);
module.exports = Page;