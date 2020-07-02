const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');

const Person = mongoose.model('Person');
const Meeting = mongoose.model('Meeting');

const router = express.Router();

router.use(requireAuth);

router.route('/people')
    .get(async (req, res) => { // all people created by user
        const people = await Person.find({ userId: req.user._id }).sort({firstname: 1});
        res.send(people);
    })

    .post(async(req, res) => {  // create new person
        const {firstname, lastname, imageUrl, category} = req.body;
        if (!firstname || !lastname || !category) { // imageUrl is OPTIONAL, totalTime is automatically set to 0
            return res.status(422).send({ error: "You must provide all required parameters." });
        }
        try {
            const person = new Person({ firstname, lastname, imageUrl, category, userId: req.user._id });
            await person.save();
            res.send(person);
        } catch (err) {
            return res.status(422).send({ error: err.message });
        }
    })


router.route('/people/category/:categoryName')
    .get(async (req, res) => {
        const people = await Person.find({ userId: req.user._id, category: req.params.categoryName }).sort({firstname: 1});
        res.send(people);
    })

router.route('/people/categories')
    .get(async (req, res) => {
        const categories = await Person.find({ userId: req.user._id }).distinct('category').sort();
        res.send(categories);
    })


router.route('/people/:personId')
    .put(async(req, res) => { // USER updates person info
        const person = await Person.findById(req.params.personId);
        const {firstname, lastname, imageUrl, category} = req.body;

        if (!firstname || !lastname || !category) { // imageUrl is OPTIONAL; totalTime not managed by user
            return res.status(422).send({ error: "You must provide all required parameters." });
        }
        try { // update params
            person.firstname = firstname;
            person.lastname = lastname;
            person.imageUrl = imageUrl;
            person.category = category;
            await person.save();
            res.send(person);
        } catch (err) {
            return res.status(422).send({ error: err.message });
        }
    })

    .get(async(req, res) => {
        const person = await Person.findById(req.params.personId);
        res.send(person);
    })

    .delete(async(req, res) => {
        const person = await Person.findByIdAndDelete(req.params.personId);
        const meetings = await Meeting.deleteMany({ personId: req.params.personId });
        res.send(person);
    })

router.route('/people/:personId/meetings')
    .get(async(req, res) => {
        const meetings = await Meeting.find({ userId: req.user._id, personId: req.params.personId }).sort({date: -1});
        res.send(meetings);
    })

    .delete(async(req, res) => {
        await Meeting.deleteMany({ personId: req.params.personId });
        const newMeetings = await Meeting.find({ userId: req.user._id }).sort({date: -1});
        res.send(newMeetings);
    })

module.exports = router;