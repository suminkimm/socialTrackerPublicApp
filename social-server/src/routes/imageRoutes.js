const express = require('express');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const requireAuth = require('../middlewares/requireAuth');

// configure google cloud storage
const gc = require('../../config');
const bucket = gc.bucket('social-tracker') 

const router = express.Router();

router.use(requireAuth);

router.post('/upload', async (req, res) => {

    if (!req.file) {
        res.status(400).send("No file uploaded.");
        return;
    }

    // Create a new blob in the bucket and upload the file data.
    const blob = bucket.file(uuidv4() + req.file.originalname);

    const blobStream = blob.createWriteStream({
        metadata: {
        resumable: false
        }
    });

    blobStream.on("error", err => {
        return res.status(422).send({ error: err.message });
    });

    blobStream.on("finish", () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

        blob.makePublic().then(() => { // return the url to frontend => must be inserted into db
            res.status(200).send({ imageUrl: publicUrl });
        });
    });

    blobStream.end(req.file.buffer);
});

module.exports = router;