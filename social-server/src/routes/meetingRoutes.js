const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');

const Meeting = mongoose.model('Meeting');
const Person = mongoose.model('Person');

const router = express.Router();

router.use(requireAuth);

router.route('/meetings')
    .post(async(req, res) => {
        const {title, date, startTime, endTime, totalTime, details, personId} = req.body;
        
        if (!title || !date || !startTime || !endTime || !totalTime || !personId) { // details are optional
            return res.status(422).send({ error: "You must provide all required parameters." });
        }

        try {
            const meeting = new Meeting({title, date, startTime, endTime, totalTime, details, personId, userId: req.user._id});

            await meeting.save();

            res.send(meeting);
        } catch (err) {
            return res.status(422).send({ error: err.message });
        }
    })

    .get(async(req, res) => {
        const meetings = await Meeting.find({ userId: req.user._id }).sort({date: -1});
        res.send(meetings);
    })


router.route('/meetings/:meetingId')
    .put(async(req, res) => {
        const meeting = await Meeting.findById(req.params.meetingId);
        const {title, date, startTime, endTime, totalTime, details, personId} = req.body;

        if (!title || !date || !startTime || !endTime || !totalTime || !personId) { // details are optional
            return res.status(422).send({ error: "You must provide all required parameters." });
        }

        try {

            meeting.title = title;
            meeting.date = date;
            meeting.startTime = startTime;
            meeting.endTime = endTime;
            meeting.totalTime = totalTime;
            meeting.details = details;
            meeting.personId = personId;

            await meeting.save();
            res.send(meeting);
        } catch (err) {
            return res.status(422).send({ error: err.message });
        }
    })


    .delete(async(req, res) => {
        
        const meeting = await Meeting.findById(req.params.meetingId);

        try {
            // for (p of meeting.personId) {
            //     const person = await Person.findById(p);
            //     person.totalTime = person.totalTime-meeting.totalTime;
            //     await person.save();
            // }
            await Meeting.findByIdAndDelete(req.params.meetingId);
            res.send(meeting);
        } catch (err) {
            return res.status(422).send({ error: err.message });
        }
        
    })
    

    .get(async(req, res) => {
        const meeting = await Meeting.findById(req.params.meetingId);
        res.send(meeting);
    })



module.exports = router;