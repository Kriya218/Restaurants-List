const express = require('express');
const { engine } = require('express-handlebars');
const app = express();
const port = 3000;

const db = require('./models');
const restaurantList = db.restaurantList;
const methodOverride = require('method-override');

app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', './views');

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

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
    attributes: ['id', 'name', 'category', 'rating', 'image'],
    raw: true
  })
    .then((restaurants) => res.render('index', { restaurants }))
    .catch((err) => res.status(422).json(err))
})
app.get('/restaurants/add', (req, res) => {
  return res.render('add')
})

app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return restaurantList.findByPk(id, {
    attributes: ['id', 'name', 'category', 'image', 'location', 'phone', 'google_map', 'description'],
     raw:true})
      .then((restaurant) => res.render('show', { restaurant }))
      .catch((err) => console.log(err))
})

app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return restaurantList.findByPk(id, {
    attributes: ['id', 'name', 'name_en', 'category', 'phone', 'image', 'location', 'google_map', 'rating', 'description'],
    raw: true
  })
    .then((restaurant) => res.render('edit', {restaurant}))
    .catch((err) => console.log(err))
})

app.post('/restaurants', (req, res) => {
  const data = req.body
  return restaurantList.create({ name:data.name, name_en:data.name_en, category:data.category, phone:data.phone, image:data.image, location:data.location, google_map:data.google_map, rating:data.rating, description:data.description })
    .then(() => res.redirect('/restaurants'))
    .catch((err) => console.log(err)) 
})

app.put('/restaurants/:id', (req, res) => {
  const id = req.params.id;
  const data = req.body
  return restaurantList.update(
    {name:data.name, name_en:data.name_en, category:data.category, phone:data.phone, image:data.image, location:data.location, google_map:data.google_map, rating:data.rating, description:data.description}, {where: {id}}
  )
    .then(() =>res.redirect(`/restaurants/${id}`))
})

app.listen(port, () =>{
  console.log(`Express server running on http://localhost:${port}`)
})