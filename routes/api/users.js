const mongoose = require('mongoose');
const router = require('express').Router();
const passport = require('passport');

const User = mongoose.model('User');
const auth = require('../auth');

router.get('/user', auth.required, (req, res, next) => {
  User.findById(req.payload.id).then((user) => {
    if (!user) { return res.sendStatus(401); }

    return res.json({ user: user.toAuthJSON() });
  }).catch(next);
});

router.put('/user', auth.required, (req, res, next) => {
  User.findById(req.payload.id).then((user) => {
    if (!user) { return res.sendStatus(401); }

    // only update fields that were actually passed...
    if (typeof req.body.user.username !== 'undefined') {
      user.username = req.body.user.username;
    }
    if (typeof req.body.user.password !== 'undefined') {
      user.setPassword(req.body.user.password);
    }

    return user.save().then(() => res.json({ user: user.toAuthJSON() }));
  }).catch(next);
});

router.post('/users/login', (req, res, next) => {
  if (!req.body.user.username) {
    return res.status(422).json({ errors: { username: "can't be blank" } });
  }
  if (!req.body.user.password) {
    return res.status(422).json({ errors: { password: "can't be blank" } });
  }

  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) { return next(err); }

    if (user) {
      user.token = user.generateJWT();
      return res.json({ user: user.toAuthJSON() });
    }
    return res.status(422).json(info);
  })(req, res, next);
});

router.post('/users', (req, res, next) => {
  const user = new User();
  console.log(req.body)

  user.username = req.body.user.username;
  user.gender = req.body.user.gender
  user.age = req.body.user.age
  user.setPassword(req.body.user.password);

  user.save().then(() => res.json({ user: user.toAuthJSON() })).catch(next);
});

module.exports = router;
