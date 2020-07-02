const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');

const User = mongoose.model('User');
const Person = mongoose.model('Person');
const Meeting = mongoose.model('Meeting');

const router = express.Router();
router.use(requireAuth);

router.route('/categories')
    .get(async (req, res) => {
        const user = await User.findById({_id: req.user._id});
        res.send(user.categories.sort());
    })
    
    .put(async(req, res) => {
        const user = await User.findById({_id: req.user._id});
        const {categories} = req.body;
        user.categories = categories.sort();
        await user.save();
        res.send(user.categories);
    })

router.route('/categories/:oldCategory/:newCategory')  
    .delete(async(req, res) => { // delete everyone from old category
        const people = await Person.find({ userId: req.user._id, category: req.params.oldCategory });
        for (let i = 0; i < people.length; i ++) {
            await Meeting.deleteMany({ personId: people[i]._id });
            await Person.deleteOne(people[i]);
        }
        res.send(people);
    })
    
    .put(async(req, res) => { // move people from old cat to new cat
        const people = await Person.find({ userId: req.user._id, category: req.params.oldCategory });
        for (let i = 0; i < people.length; i ++) {
            people[i].category = req.params.newCategory;
            await people[i].save();
        }
        res.send(people);
    })


module.exports = router;