const express = require('express');
const { engine } = require('express-handlebars');
const app = express();
const port = 3000;
const restaurants = require('./public/jsons/restaurant.json').results

app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', './views')

app.use(express.static('public'));

app.get('/', (req,res) => {
  res.redirect('/restaurants')
})

app.get('/restaurants', (req, res) => {
  res.render('index', {restaurants: restaurants} )
})



app.listen(port, () =>{
  console.log(`Express server running on http://localhost:${port}`)
})