var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var KillingSchema = new Schema({
  reported_date     : Date,
  geo_state         : String,
  gender            : String,
  race              : String,
  name              : String,
  age               : Number,
  kbp_link          : String,
  news_link         : String
});

module.exports = mongoose.model('Killing', KillingSchema);
