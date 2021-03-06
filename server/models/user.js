const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const ObjectID = require('mongodb').ObjectID;
const bcrypt = require('bcryptjs');

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: `{VALUE} is not a valid email`
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }
    ]
});

userSchema.methods.toJSON = function () {
    var user = this;
    var userObj = user.toObject();
    return _.pick(userObj, ['_id', 'email']);
}

userSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var tokens = [];
    var token = jwt.sign({ _id: user._id.toHexString(), access: access }, process.env.JWT_SECRET).toString();
    tokens.push({ access: access, token: token });
    user.tokens = tokens;

    return user.save().then(() => {
        return token;
    });
}

userSchema.methods.removeToken = function(token){
    var user = this;

   return user.update({
        $pull:{
            tokens:{
                token:token
            }
        }
    });
}

userSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded = undefined;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    }
    catch (e) {
        return new Promise((resolve, reject) => {
            reject();
        });
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    })
}

userSchema.statics.findByCredential = function (email, password) {
    var User = this;

    return User.findOne({ email: email }).then((user) => {
        if (!user) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if(err){
                    reject();
                }
                if(res){
                    resolve(user);
                }
                else{
                    reject();
                }
            });
        });
    });
}

userSchema.pre('save', function (next) {
    var user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10, (error, salt) => {
            bcrypt.hash(user.password, salt, (error, hash) => {
                user.password = hash;
                next();
            });
        });
    }
    else {
        next();
    }
});

var User = mongoose.model('User', userSchema);

module.exports = {
    User: User
}