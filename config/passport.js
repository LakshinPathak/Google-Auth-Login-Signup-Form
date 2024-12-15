// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const User = require('../models/User');

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: '1010900816162-tecnq3ip1pcudnmhv2ohnmscu6h49s6u.apps.googleusercontent.com',
//       clientSecret: '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',
//       callbackURL: 'http://localhost:3000/auth/google/callback',
//     },

//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         // Check if the user exists in the database
//         let user = await User.findOne({ googleId: profile.id });

//         if (!user) {
//           // Create a new user if they don't exist
//           user = new User({
//             username: profile.displayName,
//             googleId: profile.id,
//             email: profile.emails[0].value
//           });
//           await user.save();
//         }

//         done(null, user);
//       } catch (error) {
//         done(error, null);
//       }
//     }
//   )
// );

// // Serialize and deserialize user for session management
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (error) {
//     done(error, null);
//   }
// });

// module.exports = passport;
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Define callback URLs for development and production
const DEV_CALLBACK_URL = 'http://localhost:3000/auth/google/callback';
const PROD_CALLBACK_URL = 'https://google-auth-login-signup-form.onrender.com/auth/google/callback';

// Check the environment and set the callback URL
const callbackURL = process.env.NODE_ENV === 'production' ? PROD_CALLBACK_URL : DEV_CALLBACK_URL;

passport.use(
  new GoogleStrategy(
    {
      clientID: '1010900816162-tecnq3ip1pcudnmhv2ohnmscu6h49s6u.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: callbackURL, // Use the appropriate callback URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user exists in the database
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // Create a new user if they don't exist
          user = new User({
            username: profile.displayName,
            googleId: profile.id,
            email: profile.emails[0].value,
          });
          await user.save();
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// Serialize and deserialize user for session management
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
