const express = require('express');
const router = express.Router();

const Op = require('sequelize').Op;

const db = require('../models');
const restaurantList = db.restaurantList;

router.get('/', (req, res, next) => {
  const limit = 9;
  const sort = req.query.sort;
  const currentPage = parseInt(req.query.page) || 1;
  
  // 取得排序條件
  let condition = []
  switch (sort) {
    case 'ASC':
    case 'DESC':
      condition = [[ 'name', sort ]]
      break;
    case 'category':
    case 'location':
      condition = [[ sort ]]
      break;
    case 'rating_DESC':
      condition = [[ 'rating', 'DESC' ]]
      break;
    case 'rating_ASC':
      condition = [[ 'rating', 'ASC' ]]
      break;
  }

  //取得 keyword
  const keywords = req.query.keywords?.replace(/\s+/g, '').toLowerCase();
  const whereCondition = keywords ? {
    [Op.or]: [
      {name: { [Op.like]: `%${keywords}%` }},
      {name_en: { [Op.like]: `%${keywords}%` }},
      {category: { [Op.like]: `%${keywords}%` }},
      {location: { [Op.like]: `%${keywords}%` }},
      {description: { [Op.like]: `%${keywords}%` }},
    ]
  } : {}

  return restaurantList.findAndCountAll({
    attributes: ['id', 'name', 'name_en', 'category','location', 'rating', 'image', 'description'],
    where: whereCondition,
    order: condition,
    offset: (currentPage - 1) * limit,
    limit,
    raw: true
  })    
    .then((restaurantsData) => {
      console.log('restaurantsData:', restaurantsData)
      const dataCount = restaurantsData.count;
      const restaurants = restaurantsData.rows;
      const totalPage = Math.ceil(dataCount / limit);      
      const prevPage = currentPage > 1 ? currentPage - 1 : 1;
      const nextPage = currentPage < totalPage ? currentPage + 1 : totalPage;
      
      const pages = Array.from({length: totalPage}, (_, i) => i+1);
      
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