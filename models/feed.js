const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedSchema = new Schema({
    feeds: {
        type: String,
        required: true
    },
    expiry: {
        type: Date,
        required:false
    }
}, {
    timestamps: true
});

var Feeds = mongoose.model('Feed', feedSchema);

module.exports = Feeds;