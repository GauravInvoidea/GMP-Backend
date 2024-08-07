const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
	{
		name: { type: String, required: [true, 'role name is required'] },
		status: { type: String, default: 'active', enum: ['active', 'inactive'] },
		is_deleted: { type: Boolean, default: false },
	},
	{
		timestamps: { createdAt: 'created_at', updatedAt: 'updatedt' },
		collection: 'role',
	}
);

const Role = new mongoose.model('Role', roleSchema);
module.exports = Role;