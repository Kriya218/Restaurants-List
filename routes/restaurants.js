const express = require('express');
const router = express.Router();

const db = require('../models');
const restaurantList = db.restaurantList;

router.get('/', (req,res) => {
  res.redirect('/restaurants')
})

router.get('/restaurants', (req, res, next) => {
  const keywords = req.query.keyword?.replace(/\s+/g, '').toLowerCase()
  return restaurantList.findAll({
    attributes: ['id', 'name', 'category', 'rating', 'image'],
    raw: true
  })
    .then((restaurants) => {
      if (keywords) {
        const matchedRestaurants = restaurants.filter((rest) =>
          Object.values(rest).some( property => {
            if (typeof property === 'string') {
              return property.toLowerCase().includes(keywords)
            }
            return false; 
          })
        );

        if (matchedRestaurants.length === 0) {
          res.render('index', { no_result_msg: "查詢無結果，請輸入其他關鍵字" });
        } else {
          res.render('index', { restaurants:matchedRestaurants });
        }
      } else {
        res.render('index', { restaurants })
      }
    })
    .catch((error) => {
      error.errorMessage = keywords ? '搜尋失敗' : '資料讀取失敗'
      next(error)
    })
})

router.get('/restaurants/add', (req, res) => {
  return res.render('add')
})

router.get('/restaurants/:id', (req, res, next) => {
  const id = req.params.id
  return restaurantList.findByPk(id, {raw:true})
      .then((restaurant) => res.render('show', { restaurant }))
      .catch((error) => {
        error.errorMessage = '資料取得失敗'
        next(error)
      })
})

router.get('/restaurants/:id/edit', (req, res, next) => {
  const id = req.params.id
  return restaurantList.findByPk(id, {raw: true})
    .then((restaurant) => res.render('edit', {restaurant}))
    .catch((error) => {
      error.errorMessage = '資料取得失敗'
      next(error)
    })
})

router.post('/restaurants', (req, res, next) => {
  const {name, name_en, category, phone, image, location, google_map, rating, description} = req.body
  return restaurantList.create({name, name_en, category, phone, image, location, google_map, rating, description})
    .then(() => res.redirect('/restaurants'))
    .catch((error) => {
      error.errorMessage = '新增失敗'
      next(error)
    }) 
})

router.put('/restaurants/:id', (req, res, next) => {
  const id = req.params.id;
  const {name, name_en, category, phone, image, location, google_map, rating, description} = req.body
  return restaurantList.update(
    {name, name_en, category, phone, image, location, google_map, rating, description}, {where: {id}}
  )
    .then(() =>res.redirect(`/restaurants/${id}`))
    .catch((error) => {
      error.errorMessage = '更新失敗'
      next(error)
    })
})

router.delete('/restaurants/:id', (req, res, next) => {
  const id = req.params.id;
  return restaurantList.destroy({where: {id}})
    .then(() => res.redirect('/restaurants'))
    .catch((error) => {
      error.errorMessage = '刪除失敗'
      next(error)
    })
})

module.exports = router