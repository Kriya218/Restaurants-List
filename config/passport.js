const passport = require('passport');
const LocalStrategy = require('passport-local');

const db = require('../models');
const User = db.User

passport.use(new LocalStrategy({ usernameField: 'email' }, (username, password, done) => {
  return User.findOne({
    attributes: ['id', 'name', 'email', 'password'],
    where: { email: username },
    raw: true
  })
    .then((user) => {
      if (!user || password !== user.password) {
        return done(null, false, { message: 'email或密碼錯誤' })
      }
      return done(null, user)
    })
    .catch((error) => {
      error.errorMessage = '登入失敗'
      done('back')
    })
}))

passport.serializeUser((user, done) => {
  const { id, name, email } = user;
  return done(null, { id, name, email })
})

passport.deserializeUser((user, done) => {
  done(null, {id: user.id})
})

module.exports = passport