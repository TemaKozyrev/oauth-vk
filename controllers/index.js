var express = require('express');
var passport = require("passport");
var router = express.Router();

router.get('/', function(req, res){
    res.render('index', { user: req.user });
});

router.get('/auth/vk',
    passport.authenticate('vkontakte', { display: 'mobile' }),
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