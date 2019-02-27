const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

let User = require('../models/users');

// router.post('/signup', function(req, res){
//     req.checkBody('confirmPassword', 'Passwords do not match').equals(req.body.password);
//     let errors = req.validationErrors();
//     if (errors){
//         res.render('signup', {
//             title: 'Hypertube | Sign Up',
//             errors: errors
//         });
//     }
//     else{
//         let user = new User();
//         user.firstname = req.body.firstname;
//         user.lastname = req.body.lastname;
//         user.username = req.body.username;
//         user.email = req.body.email;
//         user.password = req.body.password;

//         bcrypt.genSalt(10, function(err, salt){
//             bcrypt.hash(user.password, salt, function(err, hash){
//                 if (err) console.log(err);
//                 user.password = hash;
//                 user.save(function(err){
//                     if (err){
//                         console.log(err);
//                         return;
//                     }
//                     else{
//                         req.flash('success', 'User Registered and can now login');
//                         res.redirect('/user/loginForm');
//                     }
//                 });
//             });
//         });
//     }
// });

router.post('/login', function(req, res, next){
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/user/loginForm',
        failureFlash: true
    })(req, res, next);
    
});

router.post('/signup', function(req, res, next){
    req.checkBody('confirmPassword', 'Passwords do not match').equals(req.body.password);
    let errors = req.validationErrors();
    if (errors){
        res.render('signup', {
            title: 'Hypertube | Sign Up',
            errors: errors
        });
    }
    else{
        passport.authenticate('local-signup', {
            successRedirect: '/user/loginForm',
            failureRedirect: '/user/signupForm',
            failureFlash: true,
            passReqToCallback: true
        })(req, res, next);
    }
});

router.get('/signupForm', function(req, res){
    res.render("signup", {
        title:'Hypertube | Sign Up'
    });
});

router.get('/loginForm', function(req, res){
    res.render("login", {
        title:'Hypertube | Login'
    });
});

router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/user/loginform');
});

module.exports = router;