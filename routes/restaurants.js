const express = require('express');
const router = express.Router();

const db = require('../models');
const restaurantList = db.restaurantList;

router.get('/', (req, res, next) => {
  const keywords = req.query.keyword?.replace(/\s+/g, '').toLowerCase();
  const limit = 9;
  const currentPage = parseInt(req.query.page) || 1;

  return restaurantList.findAndCountAll({
    attributes: ['id', 'name', 'category', 'rating', 'image'],
    offset: (currentPage - 1) * limit,
    limit,
    raw: true
  })    
    .then((restaurantsData) => {
      const dataCount = restaurantsData.count;
      const restaurants = restaurantsData.rows;
      const totalPage = Math.ceil(dataCount / limit);      
      const prevPage = currentPage > 1 ? currentPage - 1 : 1;
      const nextPage = currentPage < totalPage ? currentPage + 1 : totalPage;
      
      const pages = Array.from({length: totalPage}, (_, i) => i+1);
      
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
          res.render('index', { restaurants:matchedRestaurants, prevPage, nextPage, currentPage, pages });
        }
      } else {
        
        res.render('index', { restaurants, prevPage, nextPage, currentPage, pages })
      }
    })
    .catch((error) => {
      error.errorMessage = keywords ? '搜尋失敗' : '資料讀取失敗'
      next(error)
    })
})

router.get('/add', (req, res) => {
  return res.render('add')
})

router.get('/:id', (req, res, next) => {
  const id = req.params.id
  return restaurantList.findByPk(id, {raw:true})
      .then((restaurant) => res.render('show', { restaurant }))
      .catch((error) => {
        error.errorMessage = '資料取得失敗'
        next(error)
      })
})

router.get('/:id/edit', (req, res, next) => {
  const id = req.params.id
  return restaurantList.findByPk(id, {raw: true})
    .then((restaurant) => res.render('edit', {restaurant}))
    .catch((error) => {
      error.errorMessage = '資料取得失敗'
      next(error)
    })
})

router.post('/', (req, res, next) => {
  const {name, name_en, category, phone, image, location, google_map, rating, description} = req.body
  return restaurantList.create({name, name_en, category, phone, image, location, google_map, rating, description})
    .then(() => res.redirect('/restaurants'))
    .catch((error) => {
      error.errorMessage = '新增失敗'
      next(error)
    }) 
})

router.put('/:id', (req, res, next) => {
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

router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  return restaurantList.destroy({where: {id}})
    .then(() => res.redirect('/restaurants'))
    .catch((error) => {
      error.errorMessage = '刪除失敗'
      next(error)
    })
})

module.exports = router