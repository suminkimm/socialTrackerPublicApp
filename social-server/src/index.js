require('./models/user');
require('./models/person');
require('./models/meeting');
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const imageRoutes = require('./routes/imageRoutes');
const peopleRoutes = require('./routes/peopleRoutes');
const meetingRoutes = require('./routes/meetingRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());


const multerMid = multer({
    storage: multer.memoryStorage(),
    limits: {
      // no larger than 5mb.
      fileSize: 5 * 1024 * 1024,
    },
});

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true
});

mongoose.connection.on('connected', () => {
    console.log("Connected to mongo instance");
});

mongoose.connection.on('error', (err) => {
    console.error('Error connecting to mongo db', err);
});


app.get('/', (req, res) => {
    res.send("hello");
})

app.use(authRoutes);
app.use(peopleRoutes);
app.use(meetingRoutes);
app.use(categoryRoutes);
app.use(multerMid.single('file'));
app.use(imageRoutes);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})