const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
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
        if(!user) return done(null, false, 'no user found');
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return done(null, false, 'incorrect password');
        return done(null, user);
    } catch (error){
        return done(error);
    }

}));

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK
},
async (accessToken, refreshToken, profile, done) => {
    const newUser = {
        googleId: profile.id,
        displayName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        image: profile.photos[0].value
    }
    try {
        let user = await User.findOne({googleId: profile.id});
        if(user){
            done(null, user)
        } else {
            user = await User.create(newUser);
            done(null, user)
        }
    } catch(err) {
        console.log(err.message);
    }
}));



passport.serializeUser( (user, done) => done(null, user.id) );  
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
});