const express = require('express');
const router = express.Router();

router.get('/',(req, res) => {
  res.redirect('/login')
})

router.get('/login', (req, res) => {
  return res.render('login')
})

router.get('/register', (req, res) => {
  return res.render('register')
})

router.post('/login', (req, res) => {
  return res.send(req.body)
})

router.post('/logout', (req, res) => {
  return res.send('登出成功')
})

module.exports = router