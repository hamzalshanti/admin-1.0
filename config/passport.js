const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/userModel');


// Local Strategy
passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if(!user) return done(null, false, 'wrong email or password');
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return done(null, false, 'wrong email or password');
        return done(null, user);
    } catch (error){
        return done(error);
    }

}));

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT
},
async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({googleId: profile.id});
        if(user) return done(null, user)
        user = await User.create({
            googleId: profile.id,
            fullName: profile.displayName,
            email: profile.emails[0].value,
            image: profile.photos[0].value
        });
        done(null, user)
    } catch(error) {
        done(error);
    }
}));


// Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_REDIRECT,
    profileFields: ['displayName', 'photos', 'email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await User.findOne({ facebookId: profile.id })
        if(user) return done(null, user);
        const newUser = await User.create({
            fullName: profile.displayName,
            email: profile.emails[0].value,
            facebookId: profile.id,
            image: profile._json.picture.data.url
        });
        done(null, newUser);
    } catch (error) {
        done(error);
    }
}
));


passport.serializeUser( (user, done) => done(null, user.id) );  
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
});