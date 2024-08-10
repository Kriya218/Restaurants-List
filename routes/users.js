const express = require('express');
const router = express.Router();

const db = require('../models');
const User = db.User;

router.post('/', (req, res, next) => {
  const { email, password, confirmPassword, name } = req.body;

  if (!email || !password) {
    req.flash('error','email 及密碼為必填欄位')
    return res.redirect('back')
  };
  if (password !== confirmPassword) {
    req.flash('error','密碼與驗證密碼不一致')
    return res.redirect('back')
  };

  return User.findOne({ where: { email } })
    .then((user) => {
      if (user) {
        req.flash('error','此email已註冊')
        return res.redirect('back')
      };

      return User.create({ name, email, password })
    })
    .then ((user) => {
      if (!user) {
        return res.redirect('back')
      }
      req.flash('success', '註冊成功');
      return res.redirect('/login');
    })  
    .catch((error) => {
      error.errorMessage = '註冊失敗';
      next(error);
    });
});

module.exports = router