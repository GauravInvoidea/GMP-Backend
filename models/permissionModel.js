const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema(
	{
		name: { type: String, required: [true, 'role name is required'] },
		status: { type: Boolean, default: 'active', enum: ['active', 'inactive'] },
		is_deleted: { type: Boolean, default: false },
	},
	{
		timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
		collection: 'permission',
	}
)

const Permission = mongoose.model('Permission', permissionSchema);
module.exports = Permission;