const mongoose = require("mongoose");

const schemaRules ={
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
  },
confirmPassword: {
        type: String,
        required: function() {
            return this.isNew; 
        },
        minLength: [6, "confirm password must be at least 6 characters long and must match password"],
        validate: [function() {
            return !this.confirmPassword || this.password === this.confirmPassword;
        }, "confirm password must match password"]
    },

  bio: {
    type: String,
    default: "",
  },
}
const userSchema=new mongoose.Schema(schemaRules);



userSchema.pre('save', function(next) {

    this.confirmPassword = undefined; 
    next();
})

userSchema.post('save', function(){
    this.__v = undefined; 
    this.password = undefined;
})

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel


