var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt-nodejs');


var UserSchema = new Schema({
      name: String,
  username: { type: String, required: true, index: { unique: true}},
  password: { type: String, required: true, select: false }
});

//hash the password before the user is saved
UserSchema.pre('save', function(next) {
  var user = this;

  //hash the password only if the password has been changed or the user is new
  if (!user.isModified('password')) { return next(); }

  //generate the hash
  bcrypt.hash(user.password, null, null, function(err, hash) {
    if (err) { return next(err); }

    user.password = hash;
    next();
  });
});

//method to compare a given password with the database hash
UserSchema.methods.comparePassword = function(password) {
  var user = this;
  return bcrypt.compareSync(password, user.password);
};

//return the model
module.exports = mongoose.model('User', UserSchema);
