var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var VK = require('vksdk');

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
        scope: ['friends']
        // profileFields: ['email', 'friends'],
    },
    function verify(accessToken, refreshToken, params, profile, done) {
        vk.setToken(accessToken);

        vk.request('friends.get', {'user_id' : profile.id, 'count': 5, 'fields': ['nickname']}, function(_o) {
            profile.friends = []
            _o.response.items.forEach(function (elem) {
                profile.friends.push(elem.first_name + ' ' + elem.last_name)
            })
            process.nextTick(function () {
                console.log(profile.friends);
                return done(null, profile);
            });
        });

    }
));

// vk api

var vk = new VK({
    'appId'     : VKONTAKTE_APP_ID,
    'appSecret' : VKONTAKTE_APP_SECRET,
    'language'  : 'ru'
});


// Setup server access token for server API methods

// Turn on requests with access tokens

app.use(require('./controllers'));


module.exports = app;