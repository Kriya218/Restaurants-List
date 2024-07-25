module.exports = (req, res, next) => {
  res.locals.error_msg = req.flash('error')
  next()
}