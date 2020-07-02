const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
    userId: { // user who created the track
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        default: ''
    },
    imageUrl: {
        type: String,
        default: ''
    }
});

mongoose.model('Person', personSchema);
