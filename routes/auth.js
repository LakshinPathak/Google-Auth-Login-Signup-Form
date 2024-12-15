const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const router = express.Router();

// Google Login/Register Route
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);


router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(`/dashboard.html?username=${req.user.username}`);
  }
);


// Google Callback Route
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    try {
      // Check if user exists or is logged in
      const googleUser = req.user;
      
      // Generate a JWT token for the authenticated user
      const token = jwt.sign({ _id: googleUser._id }, 'secretKey', { expiresIn: '1h' });

      // Send token and user data to the frontend
      res.status(200).send({
        message: 'Google Authentication successful',
        token,
        user: { username: googleUser.username, email: googleUser.email },
      });
     // res.redirect('/dashboard.html');
    } catch (error) {
      res.status(500).send({ error: 'Internal Server Error' });
    }
  }
);

// Registration Route
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.status(201).send({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Login Route
// router.post('/login', async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const user = await User.findOne({ username });
//     if (!user || !(await user.comparePassword(password))) {
//       throw new Error('Invalid username or password');
//     }
//     const token = jwt.sign({ _id: user._id }, 'secretKey', { expiresIn: '1h' });
//     res.redirect(`/dashboard.html?username=${username}`);
//     res.send({ token });
//   } catch (error) {
//     res.status(400).send({ error: error.message });
//   }
// });



router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Invalid username or password');
    }

    const token = jwt.sign({ _id: user._id }, 'secretKey', { expiresIn: '1h' });

    res.send({ message: 'Login successful', token, username });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});


module.exports = router;
