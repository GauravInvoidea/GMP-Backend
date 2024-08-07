const adminRoute = require('express').Router();
const adminAuth = require('../middleware/adminAuth')

const { upload } = require('../helpers/multer');

const UserController = require('../controllers/admin/user/usercontrollers')
const agentcontroller = require('../controllers/admin/agent/agentcontroller')
const settingsController = require('../controllers/admin/system_setting/settings')
const loginAdmin = require('../controllers/admin/auth/loginAdmin');
const signupAdmin = require('../controllers/admin/auth/signupAdmin');
const createRole = require('../controllers/admin/role/createRole');
const getAllRoles = require('../controllers/admin/role/getAllRoles');
const createPermission = require('../controllers/admin/permission/createPermission');
const createPage = require('../controllers/admin/page/createPage');
const getAllPages = require('../controllers/admin/page/getAllPages');
const updatePage = require('../controllers/admin/page/updatePage');
const deletePage = require('../controllers/admin/page/deletePage');
const getPage = require('../controllers/admin/page/getpage');

// purpose
const createPropertyPurpose = require('../controllers/admin/proerty_purpose/createPropertyPurpose');
const getAllPropertyPurposes = require('../controllers/admin/proerty_purpose/getAllPropertyPurposes');
const updatePropertyPurpose = require('../controllers/admin/proerty_purpose/updatePropertyPurpose');
const deletePropertyPurpose = require('../controllers/admin/proerty_purpose/deletePropertyPurpose');
const getPropertyPurpose = require('../controllers/admin/proerty_purpose/getPropertyPurpose');
// type
const createPropertyType = require('../controllers/admin/product_type/createPropertyType');
const getAllPropertyTypes = require('../controllers/admin/product_type/getAllPropertyTypes');
const updatePropertyType = require('../controllers/admin/product_type/updatePropertyType');
const deletePropertyType = require('../controllers/admin/product_type/deletePropertyType');
const getPropertyType = require('../controllers/admin/product_type/getPropertyType');
// category
const createPropertyCategory = require('../controllers/admin/product_category/createPropertyCategory');
const getAllPropertyCategory = require('../controllers/admin/product_category/getAllPropertyCategory');
const updatePropertyCategory = require('../controllers/admin/product_category/updatePropertyCategory');
const deletePropertyCategory = require('../controllers/admin/product_category/deletePropertyCategory');
const getPropertyCategory = require('../controllers/admin/product_category/getPropertyCategory');
// amenity
const createPropertyAmenity = require('../controllers/admin/property_amenity/createPropertyAmenity');
const getAllPropertyAmenities = require('../controllers/admin/property_amenity/getAllPropertyAmenities');
const updatePropertyAmenity = require('../controllers/admin/property_amenity/updatePropertyAmenity');
const getPropertyAmenity = require('../controllers/admin/property_amenity/getPropertyAmenity');
const deletePropertyAmenity = require('../controllers/admin/property_amenity/deletePropertyAmenity');
// property
const createProperty = require('../controllers/admin/property/createProperty');
const getAllProperties = require('../controllers/admin/property/getAllProperties');
const deleteProperty = require('../controllers/admin/property/deleteProperty');
const getProperty = require('../controllers/admin/property/getProperty');
const updateProperty = require('../controllers/admin/property/updateProperty');




// routes
adminRoute.route('/').post(signupAdmin)
adminRoute.post('/login', loginAdmin);

// page & page content
adminRoute.route('/page').post(adminAuth, createPage).get(adminAuth, getAllPages).patch(adminAuth, updatePage);
adminRoute.route('/page/:id').get(adminAuth, getPage).delete(adminAuth, deletePage);

// Property
adminRoute.route('/property').post(adminAuth, createProperty).get(adminAuth, getAllProperties).patch(adminAuth, updateProperty)
adminRoute.route('/property/:id').get(adminAuth, getProperty).delete(adminAuth, deleteProperty)
// property purpose
adminRoute.route('/property_purpose').post(adminAuth, createPropertyPurpose).get(adminAuth, getAllPropertyPurposes).patch(adminAuth, updatePropertyPurpose)
adminRoute.route('/property_purpose/:id').get(adminAuth, getPropertyPurpose).delete(adminAuth, deletePropertyPurpose)
// property type
adminRoute.route('/property_type').post(adminAuth, createPropertyType).get(adminAuth, getAllPropertyTypes).patch(adminAuth, updatePropertyType)
adminRoute.route('/property_type/:id').get(adminAuth, getPropertyType).delete(adminAuth, deletePropertyType)
// property Category
adminRoute.route('/property_category').post(adminAuth, createPropertyCategory).get(adminAuth, getAllPropertyCategory).patch(adminAuth, updatePropertyCategory)
adminRoute.route('/property_category/:id').get(adminAuth, getPropertyCategory).delete(adminAuth, deletePropertyCategory)
// property amenity
adminRoute.route('/property_amenity').post(adminAuth, createPropertyAmenity).get(adminAuth, getAllPropertyAmenities).patch(adminAuth, updatePropertyAmenity)
adminRoute.route('/property_amenity/:id').get(adminAuth, getPropertyAmenity).delete(adminAuth, deletePropertyAmenity)






// 
adminRoute.patch("/update-general-settings", upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'favicon', maxCount: 1 }
]), settingsController.addorUpdateGeneralData);

adminRoute.get("/get-general-details", settingsController.getAllGeneralData)

adminRoute.get("/get-allagent-details", agentcontroller.getagentdetails)
adminRoute.post("/add-agent-details", agentcontroller.addNewAgent)
adminRoute.patch("/update-agent-details", agentcontroller.updateAgentDetails)
adminRoute.delete("/delete-agent-details:id", agentcontroller.deleteAgentDetails)


// old
adminRoute.route('/permission').post(adminAuth, createPermission).get(adminAuth, getAllRoles);
adminRoute.route('/role').post(adminAuth, createRole).get(adminAuth, getAllRoles);



adminRoute.post("/create-user", upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'favicon', maxCount: 1 }
]), UserController.createNewUser);

adminRoute.patch("/update-user", upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'favicon', maxCount: 1 }
]), UserController.updateUser);

adminRoute.get("/get-all-user", UserController.getuserdetails)
adminRoute.delete("/delete-user/:id", UserController.deleteUser)
adminRoute.get("/get-user/:id", UserController.getOneuserdetails)

module.exports = adminRoute;