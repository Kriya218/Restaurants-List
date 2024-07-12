const express = require('express');
const { engine } = require('express-handlebars');
const app = express();
const port = 3000;
const restaurants = require('./public/jsons/restaurant.json').results
const db = require('./models');
const restaurantList = db.restaurantList;

const fs = require('fs');

app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', './views')

app.use(express.static('public'));


app.get('/', (req,res) => {
  res.redirect('/restaurants')
})

app.get('/restaurants', (req, res) => {
  // const keywords = req.query.keyword || '';
  // const matchedRestaurants = keywords.length > 0 ? restaurants.filter(restaurant =>
  //   Object.values(restaurant).some( property => {
  //     if (typeof property ==='string') {
  //       return property.toLowerCase().includes(keywords.toLowerCase())
  //     }
  //   })
  // ): restaurants
  // const noResultsMessage = (keywords.length > 0 && matchedRestaurants.length === 0) ? `${keywords}查詢無結果，請輸入其他關鍵字` : '';
  // res.render('index', {restaurants: matchedRestaurants, message: noResultsMessage})
  
  return restaurantList.findAll({
    attributes: ['id', 'name','category', 'rating'],
    raw: true
  })
    .then((restaurants) => res.render('index', { restaurants }))
    .catch((err) => res.status(422).json(err))
})

app.get('/restaurant/:id', (req, res) => {
  const id = req.params.id
  const restaurant = restaurants.find((restaurant) => restaurant.id.toString() === id)
  res.render('show', {restaurant})
})

app.listen(port, () =>{
  console.log(`Express server running on http://localhost:${port}`)
})