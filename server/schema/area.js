var mongoose = require('mongoose');

const areaSchema = new mongoose.Schema({
    name:String,
});

const Area = mongoose.model('areas', areaSchema);

module.exports = Area;