const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
    title: {
        type: String,
        default: ''
    },
    date: {
        type: Date
    },
    startTime: {
        type: String
    },
    endTime: {
        type: String
    },
    totalTime: { // in minutes
        type: Number
    },
    details: {
        type: String,
        default: ''
    },
    personId: [ {type: mongoose.Schema.Types.ObjectId, ref: 'Person'} ],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Meeting', meetingSchema);