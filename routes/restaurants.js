const express = require('express');
const router = express.Router();

const restaurantHandler = require('../middlewares/restaurants-handler')

router.get('/', restaurantHandler.getAll, (req, res, next) => {
  const {keywords, restaurants, prevPage, nextPage, currentPage, pages, sort} = req

  if (keywords) {                        
    if (restaurants.length === 0) {
      res.render('index', { no_result_msg: "查詢無結果，請輸入其他關鍵字" });
    } else {
      res.render('index', { restaurants, prevPage, nextPage, page:currentPage, pages, sort, keywords });
    }
  } else {
    res.render('index', { restaurants, prevPage, nextPage, page:currentPage, pages, sort })
  }
})

router.get('/add', (req, res) => {
  return res.render('add')
})

router.get('/:id', restaurantHandler.getById, (req, res, next) => {
  const {restaurant} = req;
  res.render('show', { restaurant });
})

router.get('/:id/edit', restaurantHandler.editById, (req, res, next) => {
  const { restaurant } = req;
  res.render('edit', {restaurant});
})

router.post('/', restaurantHandler.create, (req, res, next) => {
  req.flash('success', '新增成功')
  res.redirect('/restaurants')
})

router.put('/:id', restaurantHandler.update, (req, res, next) => {
  const { id } = req;
  req.flash('success', '編輯成功')
  res.redirect(`/restaurants/${id}`)
})

router.delete('/:id', restaurantHandler.delete, (req, res, next) => {
  req.flash('success', '刪除成功')
  res.redirect('/restaurants');
})

module.exports = router