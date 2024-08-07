const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AgentSchema = new Schema({
  name: { type: String },
  email: { type: String },
  contact: { type: String },
  address: {type: String },
 
}, {timestamps : true});


const Agents = mongoose.model('Agents', AgentSchema);
module.exports = Agents;





// module.exports = mongoose.model("Agents", AgentSchema);


// const Page = mongoose.model('Page', pageSchema);
// module.exports = Page;