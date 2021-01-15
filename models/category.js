const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const catSchema = new Schema({
    name:{
            type:String,
            required:true
        }
});

var catg = mongoose.model('Category', catSchema);

module.exports = catg;