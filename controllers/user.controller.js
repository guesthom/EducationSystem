const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');

const User = mongoose.model('User');

module.exports.register = (req, res, next) => {
    var user = new User();
    user.fullName = req.body.fullName;
    user.email = req.body.email;
    user.password = req.body.password;
    user.mobile = req.body.mobile;
    user.userId = req.body.userId;
    user.userLevel = req.body.userLevel;
    user.group = req.body.group;
    user.save((err, doc) => {
        if (!err)
            res.send({"status" : 1,"message":"Reistation successfully","data":doc});
        else {
            if (err.code == 11000)
                res.status(422).send(['Duplicate email adrress found.']);
            else
                return next(err);
        }

    });
}

module.exports.authenticate = (req, res, next) => {
    // call for passport authentication
    passport.authenticate('local', (err, user, info) => {       
        // error from passport middleware
        if (err) return res.status(400).json(err);
        // registered user
        else if (user) return res.status(200).json({"status": 1, "message":"Login successfully", "data" : {"token": user.generateJwt(),"user" : user}});
        // unknown user or wrong password
        else return res.status(404).json(info);
    })(req, res);
}

module.exports.userProfile = (req, res, next) =>{
    User.findOne({ _id: req._id },
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else
                return res.status(200).json({ status: true, user : _.pick(user,['fullName','email']) });
        }
    );
}

module.exports.getUserList = (req, res, next) =>{
    User.find({},
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else
                return res.status(200).json({ status: true, user :user });
        }
    );
}

module.exports.imageSlider = (req, res, next) => {
    let imageArray = [
        'https://www.chans.in/wp-content/uploads/2019/07/cHANS-SCHOLARSHIP.jpg',
        'https://www.chans.in/wp-content/uploads/2019/07/p1.jpg',
        'https://www.chans.in/wp-content/uploads/2019/07/p3.jpg',
        'https://www.chans.in/wp-content/uploads/2019/07/cHANS-SCHOLARSHIP.jpg',
    ]
    return res.status(200).json({ "status": true, "data" :imageArray });
}