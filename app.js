var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var passport = require('passport');
const VKontakteStrategy = require('passport-vkontakte').Strategy;


var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('express-session')({secret:'keyboard cat', resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

// vk app config
const VKONTAKTE_APP_ID = '5961288';
const VKONTAKTE_APP_SECRET = 'CuYYBlGdVvDuk5PqPzBP';

// passport js config

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new VKontakteStrategy(
    {
        clientID: VKONTAKTE_APP_ID,
        clientSecret: VKONTAKTE_APP_SECRET,
        callbackURL: "http://localhost:3000/auth/vk/callback",
        scope: ['email', 'friends'],
        profileFields: ['email', 'friends'],
    },
    function verify(accessToken, refreshToken, params, profile, done) {
        process.nextTick(function () {
            return done(null, profile);
        });
    }
));



app.use(require('./controllers'));


module.exports = app;