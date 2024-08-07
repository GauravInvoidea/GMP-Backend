const Agents = require("../../../models/agentmodel");


exports.getagentdetails = async (req, res) => {
  try {

    const result = await Agents.find();

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Some server error occurred",
    });
  }
};


exports.addNewAgent = async (req, res) => {
  try {
    const { name, email, contact, address } = req.body;

    // console.log(req.body)
    // if(!email){
    //   return res.status(400).json({
    //     message: "email is required"
    //   })
    // }

    const isAgentExist = await Agents.findOne({ email });
    if (isAgentExist) {
      return res.status(409).json({
        message: "Agent already exist in database",
      });
    }

    const newAgent = new Agents({
      name: name,
      email: email,
      contact: contact,
      address: address,

    });

    const result = await newAgent.save();
    if (result) {
      return res.status(200).json({
        message: "New Agent has been added",
      });
    } else {
      return res.status(500).json({
        message: "Unable to add new Agent in database",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Some server error occured",
    });
  }
};

exports.updateAgentDetails = async (req, res) => {

  try {
    const { name, email, contact, address, isAdmin, } = req.body;
    cont

    if (isAdmin === true || isAdmin === 'true') {
      // Construct the update object with the fields to be updated
      const updateData = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (contact) updateData.contact = contact;
      if (address) updateData.address = address;

      // Perform the update operation
      const result = await Agents.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );

      // console.log(result)
      if (result) {
        return res.status(200).json({
          message: "Agents details have been updated",
        });
      } else {
        return res.status(404).json({
          message: "Agents not found",
        });
      }
    } else {
      res.status(403).json({
        message: "Unauthorized User",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Some server error occurred",
    });
  }
}


exports.deleteAgentDetails = async (req, res) => {

  const { id } = req.params;

  try {
    const result = await Agents.findByIdAndDelete(id);

    if (result) {
      return res.status(200).json({
        message: "Page has been deleted",
      });
    } else {
      return res.status(404).json({
        message: "Page not found",
      });
    }
  }

  catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Some server error occurred",
    });
  }
};




// exports.getPageDetails = async (req, res) => {
//   const id = req.query.id
//   const isAdmin = req.query.isAdmin

//   if (isAdmin === true || isAdmin === 'true') {
//     try {
//       const result = await Pages.findById(id);
//       return res.status(200).json(result);
//     } catch (err) {
//       console.log(err);
//       res.status(500).json({
//         message: "Some server error occurred",
//       });
//     }
//   }
// }



// exports.getPageDetailsBySlugName = async (req, res) => {
//   const slug = req.query.slug
//   try {
//     const result = await Pages.findOne({ slug });

//     result.metaimage = result.metaimage ? `/uploads/${result.metaimage}` : ''

//     return res.status(200).json({
//       message: "success",
//       page: result,
//     });

//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       message: "Some server error occurred",
//     });
//   }
// }





// exports.toggleStatusOfPage = async (req, res) => {
//   const { id, status, isAdmin } = req.body
//   try {
//     if (isAdmin === true || isAdmin === 'true') {

//       const result = await Pages.findByIdAndUpdate(
//         id,
//         { status },
//         { new: true }
//       );

//       if (result) {
//         return res.status(200).json({
//           message: "Status has been changed",
//         });
//       } else {
//         return res.status(404).json({
//           message: "Page not found",
//         });
//       }
//     } else {
//       res.status(403).json({
//         message: "Unauthorized User",
//       });
//     }
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({
//       message: "Some server error occurred",
//     });
//   }
// }

