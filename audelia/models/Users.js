var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var UserSchema = new Schema({
  username: { type: String, lowercase: true, unique: true },
  hash: String,
  salt: String
});

UserSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');

//how many times to create a hash of that hash
//iterate 1000 times
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
}

//checks if password is valid
UserSchema.method.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');


//let us know if password equals what's in hash after salting and hashing
  return this.hash === hash;
}

//generate JWT
//takes in payload that gets signed & secret
UserSchema.method.generateJWT = function() {
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() = 60);


  //password will expire after 60 days
  
  return jwt.sign({
    _id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000),

  }, 'SECRET');
}

mongoose.model('User', UserSchema);
