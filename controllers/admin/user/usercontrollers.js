const bcrypt = require('bcrypt');
const User = require('../../../models/userModel');
const Role = require('../../../models/roleModel');

exports.createNewUser = async (req, res) => {
    try {
        const { name, email, phone_number, password, avatar, isAdmin, role_id, address } = req.body;

        // Check if the user already exists
        const userAlreadyExist = await User.findOne({ email });
        if (userAlreadyExist) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        // Hash the password before saving to the database
        // const hashedPassword = await bcrypt.hash(password, 10);

        let role = await Role.findById(role_id).lean()
        

        // Create a new user instance
        const userDetails = new User({
            name,
            email,
            address,
            phone_number,
            password,
            role_id,
            user_type:role.name,
            // avatar,
            // isAdmin, // If isAdmin is required, add it here
        });

        // Save the user details to the database
        const savedUser = await userDetails.save();

        if (savedUser) {
            return res.status(200).json({
                message: "User has been saved successfully",
            });
        } else {
            return res.status(500).json({
                message: "Unable to save user details",
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Some server error occurred",
        });
    }
};




exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params; // Assuming id is passed as a route parameter
        const { name, email, phone_number, password, avatar, isAdmin, role_id, address } = req.body;

        // Find the user by id
        let user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // Update user fields
        if (name) user.name = name;
        if (email) user.email = email;
        if (phone_number) user.phone_number = phone_number;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }
        if (avatar) user.avatar = avatar;
        if (isAdmin !== undefined) user.isAdmin = isAdmin;
        if (role_id) {
            user.role_id = role_id;
            let role = await Role.findById(role_id).lean()
            user.user_type = role.name
        }
        if (address) user.address = address;

        // Save updated user details
        const updatedUser = await user.save();

        if (updatedUser) {
            return res.status(200).json({
                message: "User has been updated successfully",
            });
        } else {
            return res.status(500).json({
                message: "Unable to update user details",
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Some server error occurred",
        });
    }
};


exports.getuserdetails = async (req, res) => {
    try {
        // Fetch users with populated role name
        const users = await User.find().populate('role_id', 'name');

        // Transform the data to flatten the role name
        const result = users.map(user => {
            const userObject = user.toObject();
            const roleName = userObject.role ? userObject.role.name : null;
            delete userObject.role;
            return { ...userObject, rolename: roleName };
        });

        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Some server error occurred",
        });
    }
};



exports.getOneuserdetails = async (req, res) => {
    try {
        const id = req.params.id;


        const user = await User.findById(id).populate('role', 'name');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Transform the data to flatten the role name
        const userObject = user.toObject();
        const roleName = userObject.role ? userObject.role.name : null;
        delete userObject.role;

        const result = { ...userObject, rolename: roleName };

        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Some server error occurred",
        });
    }
};


exports.deleteUser = async (req, res) => {

    // const { id } = req.query;
    const id = req.params.id;

    try {
        const result = await User.findByIdAndDelete(id);

        if (result) {
            return res.status(200).json({
                message: "User has been deleted",
            });
        } else {
            return res.status(404).json({
                message: "User not found",
            });
        }
    }

    catch (e) {
        console.error(e);
        res.status(500).json({
            message: "Some server error occurred",
        });
    }
}