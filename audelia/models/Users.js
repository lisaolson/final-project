var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var UserSchema = new Schema({
  username: { type: String, lowercase: true, unique: true, required: true },
  hash: String,
  salt: String
});

//16 random bytes to make a random salt
//turn that to a string and hex - random string that is salt for the user
UserSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');

//create the hash using crypto
//takes in 4 parameters -  password, salt, # of iterations, length of key to create)
//how many times to create a hash of that hash - iterate 1000 times
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
}

//checks if password is valid
UserSchema.method.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');

//return boolean if password equals what's in hash
  return this.hash === hash;
}

//generate JWT
//takes in payload that gets signed by JWT and SECRET
//you should have environment tools put into place to keep it out of codebase
UserSchema.method.generateJWT = function() {
  var exp = new Date();
  exp.setDate(exp.getDate() + 60);

  return jwt.sign({
    _id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000),

  }, process.env.MY_KEY_NAME);
}


//password will expire after 60 days

mongoose.model('User', UserSchema);
