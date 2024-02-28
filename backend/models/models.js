const mongoose = require("mongoose");
const { Schema } = mongoose;


const userSchema = new Schema({
   username: { type: String, required: true },
   email: { type: String, unique: true, required: true },
   password: { type: String, required: true },
   isAuthenticated: { type: Boolean,default : false },
   confirmationToken: { type: String, default : null },
   resetPasswordToken: { type: String, default : null },
   resetPasswordExpires: { type: Date }
  
}, {
   timestamps: true,
}

);






const User = mongoose.model('User', userSchema);



module.exports = {

   User,
 
   
};