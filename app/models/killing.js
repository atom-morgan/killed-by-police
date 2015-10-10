var mongoose = require('mongoose'),
    moment = require('moment'),
    Schema = mongoose.Schema;

var KillingSchema = new Schema({
  reported_date     : Date,
  geo_state         : String,
  gender            : String,
  race              : String,
  name              : String,
  age               : Number,
  source_of_death   : String,
  kbp_link          : String,
  news_link         : String
});

KillingSchema.virtual('$reported_date').get(function() {
    return moment(this.reported_date).format('MMMM Do, YYYY');
});

KillingSchema.virtual('$reported_month').get(function() {
    return moment(this.reported_date).format('MMMM');
});

KillingSchema.set('toJSON', { getters: true, virtuals: true });

module.exports = mongoose.model('Killing', KillingSchema);
