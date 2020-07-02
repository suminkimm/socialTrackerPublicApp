const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema( // define formatting
    {
        email: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        categories: [ {type: String} ]
    }
);

userSchema.pre('save', function(next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }
    
    bcrypt.genSalt(10, (err, salt) => { // salt is a random str of chars
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});

// check if entered password == database password
userSchema.methods.comparePassword = function(candidatePassword) {
    const user = this;

    return new Promise((resolve, reject) => { 
        // candidatePassword: entered into app
        // user.password: stored in db
        bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
            if (err) {
                return reject(err);
            }
            if (!isMatch) {
                return reject(false);
            }
            resolve(true);
        });
    });
};

mongoose.model('User', userSchema);