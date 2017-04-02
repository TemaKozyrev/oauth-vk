var express = require('express');
var passport = require("passport");
var router = express.Router();

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login')
}

router.get('/', function(req, res){
    res.render('index', { user: req.user });
});

router.get('/account', ensureAuthenticated, function(req, res){
    res.render('account', { user: req.user });
});

router.get('/login', function(req, res){
    res.render('login', { user: req.user });
});


router.get('/auth/vk',
    passport.authenticate('vkontakte'),
    function(req, res){

    });

router.get('/auth/vk/callback',
    passport.authenticate('vkontakte', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    });

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});
module.exports = router;