const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose');
const User = require('../models/User');
const translate = require('../helper/translate');

module.exports = function(passport){
    passport.use(new GoogleStrategy({
        clientID : process.env.GOOGLE_CLIENT_ID,
        clientSecret : process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'

    },
    async (accessToken, refreshToken, profile, done) => {
        // console.log(profile);

        const newUser = {
            googleId : profile.id,
            displayName : profile.displayName,
            image : profile.photos[0].value,
            emailId : profile.emails[0].value
        }
        try{
            let user = await User.findOne({googleId : profile.id})
            if(user){
                done(null,user);
            }
            else{
                const tamilNames = await translate("My name is " + profile.displayName);
                const tamilNameArray = tamilNames.split(" ");
                var tamilName = "";
                for(var i=2;i<tamilNameArray.length;i++){
                    tamilName += tamilNameArray[i] + " ";
                }
                newUser.tamilName = tamilName;
                user = await User.create(newUser);
                done(null,user);
            }
        }catch(err){
            console.error(err);
        }

    }))

    passport.serializeUser((user,done) => {
        done(null,user.id);
    })
    passport.deserializeUser((id,done) => {
        User.findById(id,function(err,user) {
            done(err,user);
        })
    })
}