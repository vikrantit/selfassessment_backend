const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Tips = new Schema({

  nurseid: String,
  nursename: String,
  tip: String,
  created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Tips', Tips);