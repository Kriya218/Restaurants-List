const express = require('express');
const router = express.Router();

const db = require('../models');
const restaurantList = db.restaurantList;

router.get('/', (req,res) => {
  res.redirect('/restaurants')
})

router.get('/restaurants', (req, res) => {
  return restaurantList.findAll({
    attributes: ['id', 'name', 'category', 'rating', 'image'],
    raw: true
  })
    .then((restaurants) => res.render('index', { restaurants }))
    .catch((err) => res.status(422).json(err))
})

router.get('/restaurants/search', (req, res) => {
  const keywords = req.query.keyword?.replace(/\s+/g, '').toLowerCase()
  return restaurantList.findAll({
      attributes: ['id', 'name', 'category', 'location', 'description', 'image', 'rating'],
      raw: true
  })
    .then((restaurants) => {
      const matchedRestaurants = keywords ? restaurants.filter((rest) =>
      Object.values(rest).some( property => {
        if (typeof property === 'string') {
          return property.toLowerCase().includes(keywords)
        }
        return false;
        })
        ) : []

      if (matchedRestaurants.length === 0) {
        res.render('index', { message: "查詢無結果，請輸入其他關鍵字" });
      } else {
        res.render('index', { restaurants:matchedRestaurants });
      }
    })
    .catch((err) => console.log(err));
  })

router.get('/restaurants/add', (req, res) => {
  return res.render('add')
})

router.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return restaurantList.findByPk(id, {raw:true})
      .then((restaurant) => res.render('show', { restaurant }))
      .catch((err) => console.log(err))
})

router.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return restaurantList.findByPk(id, {raw: true})
    .then((restaurant) => res.render('edit', {restaurant}))
    .catch((err) => console.log(err))
})

router.post('/restaurants', (req, res) => {
  const {name, name_en, category, phone, image, location, google_map, rating, description} = req.body
  return restaurantList.create({name, name_en, category, phone, image, location, google_map, rating, description})
    .then(() => res.redirect('/restaurants'))
    .catch((err) => console.log(err)) 
})

router.put('/restaurants/:id', (req, res) => {
  const id = req.params.id;
  const {name, name_en, category, phone, image, location, google_map, rating, description} = req.body
  return restaurantList.update(
    {name, name_en, category, phone, image, location, google_map, rating, description}, {where: {id}}
  )
    .then(() =>res.redirect(`/restaurants/${id}`))
})

router.delete('/restaurants/:id', (req, res) => {
  const id = req.params.id;
  return restaurantList.destroy({where: {id}})
    .then(() => res.redirect('/restaurants'))
})

module.exports = router