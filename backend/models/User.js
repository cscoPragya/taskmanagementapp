const mongoose=require("mongoose")


//have to create an schema
let userSchema= mongoose.Schema({
name:{type:String, required:true, minlength:2},
email:{type:String, required:true, unique:true},
password:{type:String, required:true},

})
module.exports= mongoose.model("User", userSchema);